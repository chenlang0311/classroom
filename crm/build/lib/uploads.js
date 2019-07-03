"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const utils = require("./utils");
const config_1 = require("../config/config");
class UploadMulter {
    constructor(folder, uptype, fileSize = 1024 * 1024) {
        utils.mkdirsSync(folder);
        this.upload = multer({
            storage: multer.diskStorage({
                //设置上传后文件路径，uploads文件夹会自动创建。
                destination: (req, file, cb) => cb(null, folder),
                filename: (req, file, cb) => {
                    let fileFormat = (file.originalname).split('.');
                    cb(null, utils.randomString() + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
                }
            }),
            //给上传文件重命名，获取添加后缀名
            fileFilter: function (req, file, cb) {
                let fileFormat = file.originalname.split('.');
                let type = fileFormat[fileFormat.length - 1];
                if (!uptype)
                    return cb(null, true);
                let arr = uptype.split('|');
                for (let i = 0, len = arr.length; i < len; i++) {
                    if (type === arr[i])
                        return cb(null, true);
                }
                return cb(null, false);
            },
            limits: { fileSize: fileSize }
        });
    }
}
exports.UploadMulter = UploadMulter;
function imgHandler(filename) {
    filename = filenameFormat(filename);
    if (utils.isString(filename)) {
        return handle(filename);
    }
    else if (utils.isArray(filename)) {
        let arr = filename.map((el) => handle(el));
        return arr.join(',');
    }
    function handle(filename) {
        let reg = new RegExp("^\\S+-(\\d{13})\\.\\S+$", "i");
        if (!reg.test(filename))
            return `/public/images/${filename}`;
        let date = new Date(parseInt(RegExp.$1));
        let year = date.getFullYear().toString();
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate().toString();
        let imageTmp = path.join(config_1.config.imageFolderTmp, filename);
        if (!fs.existsSync(imageTmp))
            return `/public/images/${year}/${month}/${day}/${filename}`;
        let imageFolder = path.join(config_1.config.imageFolder, year, month, day);
        utils.mkdirsSync(imageFolder);
        let image = path.join(imageFolder, filename);
        fs.renameSync(imageTmp, image);
        return `/public/images/${year}/${month}/${day}/${filename}`;
    }
    if (utils.isString(filename))
        return '';
    return [];
}
exports.imgHandler = imgHandler;
function filenameFormat(filename) {
    if (utils.isString(filename)) {
        return handle(filename);
    }
    else if (utils.isArray(filename)) {
        return filename.map((el) => handle(el));
    }
    function handle(str) {
        let reg = new RegExp("^(.*\\/)?(\\S+-\\d{13}\\.\\S+)$", "i");
        if (!reg.test(str))
            return str;
        return RegExp.$2;
    }
}

//# sourceMappingURL=../maps/lib/uploads.js.map
