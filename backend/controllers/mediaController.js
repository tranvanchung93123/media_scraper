const puppeteer = require("puppeteer");
const ImageVideo = require("../models/ImageVideo");

const scrapeMedia = async (urls) => {
  const mediaData = [];
  const browser = await puppeteer.launch();

  for (const url of urls) {
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle2" });

      if (url.includes("youtube.com/watch")) {
        const videoData = await page.evaluate(() => {
          const videoId = document.querySelector("meta[itemprop='videoId']")?.content;
          const title = document.querySelector("meta[name='title']")?.content || "Unknown";
          const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      
          if (videoId) {
            return {
              type: "video",
              title,
              src: `https://www.youtube.com/embed/${videoId}`, // Embed URL
              thumbnail, // Thumbnail URL
            };
          }
          return null;
        });

      
        if (videoData) {
          mediaData.push(videoData);
        }
      } else {
        // General website scraping
        const images = await page.evaluate(() => {
          return Array.from(document.querySelectorAll("img"))
            .map((img) => img.src)
            .filter((src) => src);
        });

        const videos = await page.evaluate(() => {
          return Array.from(document.querySelectorAll("video source"))
            .map((video) => video.src)
            .filter((src) => src);
        });

        mediaData.push(
          ...images.map((src) => ({ url, type: "image", src })),
          ...videos.map((src) => ({ url, type: "video", src }))
        );
      }

      await page.close();
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error.message);
    }
  }

  await browser.close();
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
