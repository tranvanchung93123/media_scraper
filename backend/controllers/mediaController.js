// controllers/mediaController.js
const axios = require('axios');
const cheerio = require('cheerio');
const ImageVideo = require('../models/ImageVideo');

const scrapeMedia = async (urls) => {
  const mediaData = [];

  for (const url of urls) {
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      $('img').each((_, elem) => {
        const src = $(elem).attr('src');
        if (src) {
          mediaData.push({ url, type: 'image', src });
        }
      });

      $('video').each((_, elem) => {
        const src = $(elem).attr('src');
        if (src) {
          mediaData.push({ url, type: 'video', src });
        }
      });
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error.message);
    }
  }

  return mediaData;
};

exports.scrapeMediaController = async (req, res, next) => {
  try {
    const { urls } = req.body;
    const mediaData = await scrapeMedia(urls);
    await ImageVideo.bulkCreate(mediaData);
    res.json({ success: true, data: mediaData });
  } catch (error) {
    next(error);
  }
};

exports.getMediaController = async (req, res, next) => {
  try {
    const { page = 1, type } = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    const where = {};
    if (type) where.type = type;

    const { count, rows } = await ImageVideo.findAndCountAll({
      where,
      limit,
      offset,
    });

    res.json({
      items: rows,
      totalPages: Math.ceil(count / limit),
    });
  } catch (error) {
    next(error);
  }
};
