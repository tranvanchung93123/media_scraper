const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { scrapeMediaController, getMediaController } = require('../controllers/mediaController');

// Route to scrape media from URLs
router.post('/scrape', authMiddleware, scrapeMediaController);

// Route to fetch scraped media with pagination and optional type filter
router.get('/media', authMiddleware, getMediaController);

module.exports = router;
