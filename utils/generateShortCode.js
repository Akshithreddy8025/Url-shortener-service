const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  7
);

const generateShortCode = () => nanoid();

module.exports = generateShortCode;
