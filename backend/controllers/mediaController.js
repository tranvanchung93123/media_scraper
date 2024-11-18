const axios = require("axios");
const cheerio = require("cheerio");
const ImageVideo = require("../models/ImageVideo");

const scrapeMedia = async (urls) => {
  const mediaData = [];

  for (const url of urls) {
    try {
      const { data } = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });
      const $ = cheerio.load(data);

      $("img").each((_, elem) => {
        const src = $(elem).attr("src");
        if (src) {
          mediaData.push({ url, type: "image", src });
        }
      });

      $("video").each((_, elem) => {
        const src = $(elem).attr("src");
        if (src) {
          mediaData.push({ url, type: "video", src });
        }
      });
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error.message);
    }
  }

  return mediaData;
};

// Scrape media with pagination support
exports.scrapeMediaController = async (req, res, next) => {
  try {
    const { urls, page = 1, pageSize = 8 } = req.body;

    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ message: "URLs must be an array." });
    }

    const mediaData = await scrapeMedia(urls);

    // Paginate results
    const offset = (page - 1) * pageSize;
    const paginatedData = mediaData.slice(offset, offset + parseInt(pageSize));

    await ImageVideo.bulkCreate(mediaData); // Save all data to the database

    res.json({
      success: true,
      data: paginatedData,
      totalPages: Math.ceil(mediaData.length / pageSize),
      totalItems: mediaData.length,
    });
  } catch (error) {
    next(error);
  }
};

// Fetch media from database with pagination
exports.getMediaController = async (req, res, next) => {
  try {
    const { page = 1, pageSize, type, search } = req.query;
    const offset = (page - 1) * pageSize;

    const where = {};
    if (type) where.type = type;

    if (search) {
      where.src = { [Op.like]: `%${search}%` }; // Sequelize LIKE query for partial matching
    }

    const { count, rows } = await ImageVideo.findAndCountAll({
      where,
      limit: parseInt(pageSize, 10),
      offset: parseInt(offset, 10),
    });

    res.json({
      items: rows,
      totalPages: Math.ceil(count / pageSize),
      currentPage: parseInt(page, 10),
      totalItems: count,
    });
  } catch (error) {
    if (error.original?.code === "42P01") {
      // PostgreSQL error for missing table
      console.error("Table does not exist. Please create it first.");
      res
        .status(500)
        .json({
          message: "Table does not exist. Please initialize the database.",
        });
    } else {
      next(error);
    }
  }
};
