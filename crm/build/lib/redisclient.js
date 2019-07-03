"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Redis = require("ioredis");
const logger = require("winston");
const config_1 = require("../config/config");
const redisClient = new Redis({ host: config_1.config.redis.host, port: config_1.config.redis.port, family: 4, db: 0 });
redisClient.on('error', (e) => logger.error(`redis connect error : ${e}`));
redisClient.on('connect', () => logger.info('redis connect success!'));
async function set(key, value, expire) {
    try {
        if (expire && expire > 0) {
            return await redisClient.set(key, value, 'EX', expire);
        }
        else {
            return await redisClient.set(key, value);
        }
    }
    catch (e) {
        logger.error(`redis set error : ${e}`);
    }
}
exports.set = set;
async function get(key) {
    try {
        return await redisClient.get(key);
    }
    catch (e) {
        logger.error(`redis get error : ${e}`);
    }
}
exports.get = get;
async function ttl(key) {
    try {
        return await redisClient.ttl(key);
    }
    catch (e) {
        logger.error(`redis ttl error : ${e}`);
    }
}
exports.ttl = ttl;
async function hset(key, field, val) {
    try {
        return await redisClient.hset(key, field, val);
    }
    catch (e) {
        logger.error(`redis hset error : ${e}`);
    }
}
exports.hset = hset;
async function hget(key, field) {
    try {
        return await redisClient.hget(key, field);
    }
    catch (e) {
        logger.error(`redis hget error : ${e}`);
    }
}
exports.hget = hget;
async function hmset(key, ...args) {
    try {
        return await redisClient.hmset(key, args);
    }
    catch (e) {
        logger.error(`redis hmset error : ${e}`);
    }
}
exports.hmset = hmset;
async function hlen(key) {
    try {
        return await redisClient.hlen(key);
    }
    catch (e) {
        logger.error(`redis hlen error : ${e}`);
    }
}
exports.hlen = hlen;
async function hmget(key, ...args) {
    try {
        return await redisClient.hmset(key, args);
    }
    catch (e) {
        logger.error(`redis hmget error : ${e}`);
    }
}
exports.hmget = hmget;
async function hexists(key, field) {
    try {
        return await redisClient.hexists(key, field);
    }
    catch (e) {
        logger.error(`redis hexists error : ${e}`);
    }
}
exports.hexists = hexists;

//# sourceMappingURL=../maps/lib/redisclient.js.map
