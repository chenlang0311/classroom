import { Router } from 'express';
// import { validate } from '../../lib/validator';
import { routerHandler } from '../../lib/routerbase';
import { checkLogin } from '../../lib/jwt';
import { Classes } from '../../controllers';
const r = Router();
const router = new routerHandler(r).handler;

router.get('/list', checkLogin, Classes.findClassList); // 课程列表
router.get('/details/:id', checkLogin, Classes.findClassDetails); // 课程详情
router.post('/create', checkLogin, Classes.updateImage, Classes.create); // 课程详情
router.put('/update/:id', checkLogin, Classes.updateImage, Classes.update); // 课程详情
router.delete('/delete/:id', checkLogin, Classes.deleteClass); // 课程详情
router.post('/image', checkLogin, Classes.findImage);//获取图片请求
export default r;