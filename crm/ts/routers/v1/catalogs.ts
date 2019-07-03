import { Router } from 'express';
import { routerHandler } from '../../lib/routerbase';
import { Catalogs } from '../../controllers';
import { checkLogin } from '../../lib/jwt';
const r = Router();
const router = new routerHandler(r).handler;

router.get('/details/:id', checkLogin, Catalogs.findCatalogDetails);
router.get('/list', checkLogin, Catalogs.findCatalogList);
router.post('/add', checkLogin, Catalogs.updateImage, Catalogs.addCatalog);
router.delete('/delete/:id', checkLogin, Catalogs.deleteCatalog);
router.put('/update/:id', checkLogin, Catalogs.updateImage, Catalogs.updateCatalog);
router.get('/sig', checkLogin, Catalogs.get_sig_for_client); // 帮助客户端生成签名
router.post('/qcloud_callback', checkLogin, Catalogs.qcloud_callback);//等待回调
router.get('/getqcinfo', checkLogin, Catalogs.getqcinfo);
router.post('/image', checkLogin, Catalogs.findImage);//获取图片请求
// router.get('/trans', checkLogin,Catalogs.gettrans); // 
export default r;