import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as logger from 'winston';
import * as expressValidator from 'express-validator';
import { jwtMiddle } from './lib/jwt';
import { routers } from './routers';
import { response, ReqError } from './lib/response';
import { initDao } from './dao';
import { customValidators, errorFormatter } from './lib/validator';
import { config as config } from './config/config';
import { config as logConfig } from './config/winston';

const app = express();
const isDev = process.env.NODE_ENV === 'development' ? true : false;

// 日志
const logdir = path.join(path.resolve(__dirname, '..'), 'logs');
fs.existsSync(logdir) || fs.mkdirSync(logdir);
logger.configure(logConfig(logdir));

// 数据操作初始化
initDao()();

app.all('*', function (req: any, res: any, next: any) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'HEAD,PUT,POST,GET,DELETE,OPTIONS,PATCH');
	res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Authorization");
	next();
});

app.use(express.json({limit: '5mb'}));
// 通用中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression()); // 压缩

if (isDev) app.use('/public', express.static(config.staticDir));

// 自定义中间件
app.use(expressValidator({ customValidators: customValidators, errorFormatter: errorFormatter }));
app.use(response);
app.use(jwtMiddle);

routers(app); // 路由

// 错误处理
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
	let err = new ReqError('Not Found', 1004, 404);
	next(err);
});

app.use(function (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) {
	logger.error(req.protocol + '://' + req.get('host') + req.originalUrl, err.stack);
	let code = err instanceof ReqError ? err.getStatusCode() : 500;
	if (isDev) return res.status(code).send(err.stack).end();
	return res.status(code).end();
});

process.on("uncaughtException", (err: Error) => logger.error("uncaughtException", err.stack));

app.listen(config.port, () => logger.info(`service start sucess and listening on port ${config.port}...`));