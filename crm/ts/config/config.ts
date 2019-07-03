import * as path from 'path';
import * as logger from 'winston';
import { Op } from 'sequelize';

const operatorsAliases = {
	$eq: Op.eq,
	$ne: Op.ne,
	$gte: Op.gte,
	$gt: Op.gt,
	$lte: Op.lte,
	$lt: Op.lt,
	$not: Op.not,
	$in: Op.in,
	$notIn: Op.notIn,
	$is: Op.is,
	$like: Op.like,
	$notLike: Op.notLike,
	$iLike: Op.iLike,
	$notILike: Op.notILike,
	$regexp: Op.regexp,
	$notRegexp: Op.notRegexp,
	$iRegexp: Op.iRegexp,
	$notIRegexp: Op.notIRegexp,
	$between: Op.between,
	$notBetween: Op.notBetween,
	$overlap: Op.overlap,
	$contains: Op.contains,
	$contained: Op.contained,
	$adjacent: Op.adjacent,
	$strictLeft: Op.strictLeft,
	$strictRight: Op.strictRight,
	$noExtendRight: Op.noExtendRight,
	$noExtendLeft: Op.noExtendLeft,
	$and: Op.and,
	$or: Op.or,
	$any: Op.any,
	$all: Op.all,
	$values: Op.values,
	$col: Op.col
}

const development = {
	port: 8021,
	mysql: {
		database: 'classroom',
		username: 'root',
		password: '',
		options: {
			dialect: 'mysql',
			host: '127.0.0.1',
			port: 3306,
			timezone: "+8:00",
			pool: {
				max: 5,
				min: 0,
				idle: 100000
			},
			logging: (d: any) => logger.verbose(d),
			operatorsAliases: operatorsAliases
		}
	},
	redis: {
		host: '127.0.0.1',
		port: 1810
	},
	imageHost: 'http://127.0.0.1:8001'
}

const production = {
	port: process.env.CLASSROOM_PORT || 8002,
	mysql: {
		database: process.env.MYSQL_DATABASE || 'classroom',
		username: 'classroom',
		password: process.env.MYSQL_ROOT_PASSWORD || 'chenlang',
		options: {
			dialect: 'mysql',
			host: process.env.MYSQL_IPV4 || '47.106.247.86',
			port: 3306,
			timezone: "+8:00",
			pool: {
				max: 5,
				min: 0,
				idle: 100000
			},
			logging: (d: any) => logger.verbose(d),
			operatorsAliases: operatorsAliases
		}
	},
	redis: {
		host: process.env.REDIS_IPV4 || '47.106.247.86',
		port: 6379
	},
	imageHost: 'https://77dress.cn'
}

const iconfig = process.env.NODE_ENV === 'development' ? development : production;
const staticDir = path.join(path.resolve(__dirname, '../..'), 'public'); // 静态文件目录

export const config = {
	host: '127.0.0.1',
	port: iconfig.port,
	mysql: iconfig.mysql,
	redis: iconfig.redis,
	imageHost: iconfig.imageHost,
	staticDir: staticDir,
	imageFolderTmp: path.join(staticDir, 'upload_tmp/images'),  // 图片上传临时目录
	imageFolder: path.join(staticDir, 'images'), // 图片目录
	jwt: {
		secret: 'TS78/(%9EC@J-MKOHGyDku4LIUYG=w0',
		expiresIn: '7d'
	},
	vod: {
		secretId: 'AKIDENKFqGEnsofCvXvhJkwHPL6f55KjnZC7',
		secretKey: '2yjJsR3Vl6XovreFeifPZbT8DNM9zc3I',
		defaultRegion: 'gz',
		serviceType: 'vod',
		rds_dk_pre: 'key:dk', // redis 缓存加密密钥  // 弃用，小程序不支持的hls播放音频
		refererKey: 'Ty5SP9NOR5wBZgnB5zXX', // 防盗链key
		refererExtTime: 7200 // 防盗链延长时间 单位：s
	},
}