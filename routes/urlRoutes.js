const express = require('express');

const {
  createShortUrl,
  redirectUrl,
  getUrlStats,
} = require('../controllers/urlController');

const router = express.Router();

router.post('/shorten', createShortUrl);
router.get('/stats/:shortCode', getUrlStats);
router.get('/:shortCode', redirectUrl);

module.exports = router;
