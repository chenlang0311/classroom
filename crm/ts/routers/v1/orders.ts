import { Router } from 'express';
import { validate } from '../../lib/validator';
import { routerHandler } from '../../lib/routerbase';
import { checkLogin } from '../../lib/jwt';
import { Orders } from '../../controllers';
const r = Router();
const router = new routerHandler(r).handler;

router.get('/list', validate, checkLogin, Orders.findOrderList); // 课程列表


export default r;