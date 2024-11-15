// routes/mediaRoutes.js
const express = require('express');
const { scrapeMediaController, getMediaController } = require('../controllers/mediaController');

const router = express.Router();

router.post('/scrape', scrapeMediaController);
router.get('/', getMediaController);

module.exports = router;
