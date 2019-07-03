"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validator_1 = require("../../lib/validator");
const routerbase_1 = require("../../lib/routerbase");
const jwt_1 = require("../../lib/jwt");
const controllers_1 = require("../../controllers");
const r = express_1.Router();
const router = new routerbase_1.routerHandler(r).handler;
router.get('/list', validator_1.validate, jwt_1.checkLogin, controllers_1.Categories.findOrderList);
exports.default = r;

//# sourceMappingURL=../../maps/routers/v1/categories.js.map
