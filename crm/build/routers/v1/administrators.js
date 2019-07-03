"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routerbase_1 = require("../../lib/routerbase");
const controllers_1 = require("../../controllers");
const validator_1 = require("../../lib/validator");
const r = express_1.Router();
const router = new routerbase_1.routerHandler(r).handler;
router.post('/login', validator_1.validate, controllers_1.Administrators.login); // 登录
exports.default = r;

//# sourceMappingURL=../../maps/routers/v1/administrators.js.map
