const Promise = require('bluebird');
const redis = require('redis');

Promise.promisifyAll(redis.RedisClient.prototype);

const { REDIS_HOST, REDIS_PORT, REDIS_PREFIX } = process.env;

if (!REDIS_HOST || !REDIS_PORT) {
  throw new Error('REDIS_HOST and REDIS_PORT environmnent variables are not set on host');
}

const redisClient = redis.createClient(`redis://${REDIS_HOST}:${REDIS_PORT}`, {
  prefix: REDIS_PREFIX || null,
});

module.exports = redisClient;
