import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const getCache = async (key) => {
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
};

export const setCache = async (key, value, ttlSeconds = 300) => {
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch {
    // cache failures shouldn't break the app
  }
};

export const delCache = async (key) => {
  try {
    await redis.del(key);
  } catch {}
};

export const delCacheByPattern = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch {}
};

export default redis;
