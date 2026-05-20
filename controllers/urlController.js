const Url = require('../models/Url');
const generateShortCode = require('../utils/generateShortCode');

const {
  redisClient,
  isRedisConnected,
} = require('../config/redis');

const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customCode, expiresAt } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        message: 'Original URL is required',
      });
    }

    const shortCode = customCode || generateShortCode();

    const existingCode = await Url.findOne({
      shortCode,
    });

    if (existingCode) {
      return res.status(400).json({
        message: 'Short code already exists',
      });
    }

    const url = await Url.create({
      originalUrl,
      shortCode,
      expiresAt: expiresAt || null,
    });

    const baseUrl =
      process.env.BASE_URL || 'http://localhost:5000';

    res.status(201).json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${baseUrl}/${url.shortCode}`,
      clicks: url.clicks,
      expiresAt: url.expiresAt,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    let cachedUrl = null;

    if (isRedisConnected()) {
      cachedUrl = await redisClient.get(shortCode);
    }

    if (cachedUrl) {
      await Url.findOneAndUpdate(
        { shortCode },
        { $inc: { clicks: 1 } }
      );

      return res.redirect(cachedUrl);
    }

    const url = await Url.findOne({
      shortCode,
    });

    if (!url) {
      return res.status(404).json({
        message: 'URL not found',
      });
    }

    if (
      url.expiresAt &&
      url.expiresAt < new Date()
    ) {
      return res.status(410).json({
        message: 'URL has expired',
      });
    }

    url.clicks += 1;

    await url.save();

    if (isRedisConnected()) {
      await redisClient.setEx(
        shortCode,
        3600,
        url.originalUrl
      );
    }

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUrlStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const url = await Url.findOne({
      shortCode,
    });

    if (!url) {
      return res.status(404).json({
        message: 'URL not found',
      });
    }

    res.json({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createShortUrl,
  redirectUrl,
  getUrlStats,
};