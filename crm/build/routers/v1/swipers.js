"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routerbase_1 = require("../../lib/routerbase");
const controllers_1 = require("../../controllers");
const validator_1 = require("../../lib/validator");
const jwt_1 = require("../../lib/jwt");
const r = express_1.Router();
const router = new routerbase_1.routerHandler(r).handler;
router.get('/list', jwt_1.checkLogin, validator_1.validate, controllers_1.Swipers.findSwiperList); // 主图列表
router.post('/add', jwt_1.checkLogin, validator_1.validate, controllers_1.Swipers.addSwiper); // 增加主图
router.delete('/delete/:id', jwt_1.checkLogin, validator_1.validate, controllers_1.Swipers.deleteSwiper); // 删除主图
router.put('/updatelevel/:id', jwt_1.checkLogin, validator_1.validate, controllers_1.Swipers.updateSwiperLevel); // 更新图片优先级
exports.default = r;

//# sourceMappingURL=../../maps/routers/v1/swipers.js.map
