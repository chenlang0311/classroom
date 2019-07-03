import { Router } from 'express';
import { routerHandler } from '../../lib/routerbase';
import { Swipers } from '../../controllers';
import { validate } from '../../lib/validator';
import { checkLogin } from '../../lib/jwt';

const r = Router();
const router = new routerHandler(r).handler;

router.get('/list', checkLogin, validate, Swipers.findSwiperList   ); // 主图列表
router.post('/add', checkLogin, validate, Swipers.addSwiper); // 增加主图
router.delete('/delete/:id', checkLogin, validate, Swipers.deleteSwiper); // 删除主图
router.put('/updatelevel/:id', checkLogin,validate, Swipers.updateSwiperLevel); // 更新图片优先级

export default r;