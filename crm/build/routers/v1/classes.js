"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { validate } from '../../lib/validator';
const routerbase_1 = require("../../lib/routerbase");
const jwt_1 = require("../../lib/jwt");
const controllers_1 = require("../../controllers");
const r = express_1.Router();
const router = new routerbase_1.routerHandler(r).handler;
router.get('/list', jwt_1.checkLogin, controllers_1.Classes.findClassList); // 课程列表
router.get('/details/:id', jwt_1.checkLogin, controllers_1.Classes.findClassDetails); // 课程详情
router.post('/create', jwt_1.checkLogin, controllers_1.Classes.updateImage, controllers_1.Classes.create); // 课程详情
router.put('/update/:id', jwt_1.checkLogin, controllers_1.Classes.updateImage, controllers_1.Classes.update); // 课程详情
router.delete('/delete/:id', jwt_1.checkLogin, controllers_1.Classes.deleteClass); // 课程详情
router.post('/image', jwt_1.checkLogin, controllers_1.Classes.findImage); //获取图片请求
exports.default = r;

//# sourceMappingURL=../../maps/routers/v1/classes.js.map
