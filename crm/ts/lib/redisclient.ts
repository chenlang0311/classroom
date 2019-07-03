import * as Redis from 'ioredis';
import * as logger from 'winston';
import { config } from '../config/config';

const redisClient = new Redis({ host: config.redis.host, port: config.redis.port, family: 4, db: 0 });

redisClient.on('error', (e: any) => logger.error(`redis connect error : ${e}`));

redisClient.on('connect', () => logger.info('redis connect success!'));

export async function set(key: string, value: string, expire?: number) {
    try {
        if (expire && expire > 0) {
            return await redisClient.set(key, value, 'EX', expire);
        } else {
            return await redisClient.set(key, value);
        }
    } catch (e) {
        logger.error(`redis set error : ${e}`);
    }
}

export async function get(key: string) {
    try {
        return await redisClient.get(key);
    } catch (e) {
        logger.error(`redis get error : ${e}`);
    }
}

export async function ttl(key: string) {
    try {
        return await redisClient.ttl(key);
    } catch (e) {
        logger.error(`redis ttl error : ${e}`);
    }
}

export async function hset(key: string, field: string, val: string) {
    try {
        return await redisClient.hset(key, field, val);
    } catch (e) {
        logger.error(`redis hset error : ${e}`);
    }
}

export async function hget(key: string, field: string) {
    try {
        return await redisClient.hget(key, field);
    } catch (e) {
        logger.error(`redis hget error : ${e}`);
    }
}

export async function hmset(key: string, ...args: any[]) {
    try {
        return await redisClient.hmset(key, args);
    } catch (e) {
        logger.error(`redis hmset error : ${e}`);
    }
}

export async function hlen(key: string) {
    try {
        return await redisClient.hlen(key);
    } catch (e) {
        logger.error(`redis hlen error : ${e}`);
    }
}

export async function hmget(key: string, ...args: any[]) {
    try {
        return await redisClient.hmset(key, args);
    } catch (e) {
        logger.error(`redis hmget error : ${e}`);
    }
}

export async function hexists(key: string, field: string) {
    try {
        return await redisClient.hexists(key, field);
    } catch (e) {
        logger.error(`redis hexists error : ${e}`);
    }
}