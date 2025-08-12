

import Redis from 'ioredis';

export const redis = new Redis(); // General purpose (caching, etc.)
export const pub = new Redis();   // Publisher
export const sub = new Redis();   // Subscriber

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

// export default { redis, pub, sub };

