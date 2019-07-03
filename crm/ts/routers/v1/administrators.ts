import { Router } from 'express';
import { routerHandler } from '../../lib/routerbase';
import { Administrators } from '../../controllers';
import { validate } from '../../lib/validator';

const r = Router();
const router = new routerHandler(r).handler;

router.post('/login', validate, Administrators.login); // 登录

export default r;