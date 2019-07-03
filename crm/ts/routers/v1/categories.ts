import { Router } from 'express';
import { validate } from '../../lib/validator';
import { routerHandler } from '../../lib/routerbase';
import { checkLogin } from '../../lib/jwt';
import { Categories } from '../../controllers';
const r = Router();
const router = new routerHandler(r).handler;

router.get('/list', validate, checkLogin, Categories.findOrderList); 


export default r;