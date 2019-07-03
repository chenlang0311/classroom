"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routerbase_1 = require("../../lib/routerbase");
const controllers_1 = require("../../controllers");
const jwt_1 = require("../../lib/jwt");
const r = express_1.Router();
const router = new routerbase_1.routerHandler(r).handler;
router.get('/details/:id', jwt_1.checkLogin, controllers_1.Catalogs.findCatalogDetails);
router.get('/list', jwt_1.checkLogin, controllers_1.Catalogs.findCatalogList);
router.post('/add', jwt_1.checkLogin, controllers_1.Catalogs.updateImage, controllers_1.Catalogs.addCatalog);
router.delete('/delete/:id', jwt_1.checkLogin, controllers_1.Catalogs.deleteCatalog);
router.put('/update/:id', jwt_1.checkLogin, controllers_1.Catalogs.updateImage, controllers_1.Catalogs.updateCatalog);
router.get('/sig', jwt_1.checkLogin, controllers_1.Catalogs.get_sig_for_client); // 帮助客户端生成签名
router.post('/qcloud_callback', jwt_1.checkLogin, controllers_1.Catalogs.qcloud_callback); //等待回调
router.get('/getqcinfo', jwt_1.checkLogin, controllers_1.Catalogs.getqcinfo);
router.post('/image', jwt_1.checkLogin, controllers_1.Catalogs.findImage); //获取图片请求
// router.get('/trans', checkLogin,Catalogs.gettrans); // 
exports.default = r;

//# sourceMappingURL=../../maps/routers/v1/catalogs.js.map
