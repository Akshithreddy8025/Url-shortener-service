const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => {
  console.error('Redis Error:', err.message || err);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis Connected');
  } catch (error) {
    console.error('Redis connection failed:', error.message || error);
  }
};

module.exports = connectRedis;
module.exports.redisClient = redisClient;
module.exports.isRedisConnected = () => redisClient.isOpen;