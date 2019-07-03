"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const routerbase_1 = require("../../lib/routerbase");
const uploads_1 = require("../../lib/uploads");
const config_1 = require("../../config/config");
const controllers_1 = require("../../controllers");
// import { checkLogin } from '../../lib/jwt';
const r = express_1.Router();
const router = new routerbase_1.routerHandler(r).handler;
const uploadImg = new uploads_1.UploadMulter(config_1.config.imageFolderTmp, 'jpg|png|webp|BMP|bmp').upload;
router.post('/uploadimg', uploadImg.single('uploadimg'), controllers_1.Uploads.uploadImage);
exports.default = r;

//# sourceMappingURL=../../maps/routers/v1/uploads.js.map
