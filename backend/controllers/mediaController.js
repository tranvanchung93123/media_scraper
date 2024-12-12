const puppeteer = require("puppeteer");
const { Op } = require("sequelize");
const ImageVideo = require("../models/ImageVideo");

/**
 * Get Paginated Media
 */
exports.getMediaController = async (req, res) => {
  try {
    // Parse query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 8;
    const type = req.query.type || ""; // Filter by type (image/video)
    const search = req.query.search || ""; // Filter by search term

    // Calculate offset for pagination
    const offset = (page - 1) * pageSize;

    // Build `where` clause dynamically
    const where = {};
    if (type) {
      where.type = type;
    }
    if (search) {
      where.src = { [Op.like]: `%${search}%` }; // Partial matching
    }

    // Query database with pagination and filters
    const { count, rows } = await ImageVideo.findAndCountAll({
      where,
      limit: pageSize,
      offset,
    });

    // Respond with paginated results
    res.json({
      items: rows,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      totalItems: count,
    });
  } catch (error) {
    console.error("Error fetching media:", error.message);
    res.status(500).json({ message: "An error occurred while fetching media." });
  }
};

/**
 * Scrape Media from URLs using Puppeteer
 */
exports.scrapeMediaController = async (req, res) => {
  const { urls } = req.body;

  // Validate input
  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ message: "Please provide a valid array of URLs." });
  }

  let browser;

  try {
    // Launch Puppeteer browser with necessary flags for Docker environments
    browser = await puppeteer.launch({
      headless: true, // Headless mode is essential for most server-side environments
      args: [
        '--no-sandbox',           // Disables the sandboxing feature which is not allowed for root users
        '--disable-setuid-sandbox' // Disables setuid sandboxing
      ],
    });

    const results = [];

    // Loop through each URL and scrape media
    for (const url of urls) {
      try {
        console.log(`Scraping URL: ${url}`); // Debug log
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Extract images and videos
        const images = await page.$$eval('img', imgs => imgs.map(img => img.src));
        const videos = await page.$$eval('video', vids => vids.map(vid => vid.src));

        // Save extracted media to the database
        const newMedia = [];
        for (const img of images) {
          newMedia.push({ type: 'image', src: img, url });
        }
        for (const vid of videos) {
          newMedia.push({ type: 'video', src: vid, url });
        }

        if (newMedia.length > 0) {
          await ImageVideo.bulkCreate(newMedia); // Bulk insert to optimize database writes
        }

        results.push({ url, images, videos });
        await page.close(); // Close the page
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error.stack);
        results.push({ url, error: `Failed to scrape: ${error.message}` });
      }
    }

    await browser.close(); // Close the browser

    res.status(200).json({ data: results });
  } catch (error) {
    console.error("Error in scrapeMediaController:", error.stack);
    res.status(500).json({ message: "An error occurred while scraping media." });
  }
};
