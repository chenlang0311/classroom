"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
// import * as utils from '../lib/utils';
function uploadImage(req, res, next) {
    if (!(req.file && req.file.filename))
        return res.sendErr('上传失败');
    let data = {
        name: req.file.filename,
        url: `${config_1.config.imageHost}/public/upload_tmp/images/${req.file.filename}`
    };
    return res.sendOk(data);
}
exports.uploadImage = uploadImage;

//# sourceMappingURL=../maps/controllers/uploads.js.map
