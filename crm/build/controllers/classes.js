"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("../lib/utils");
const dao_1 = require("../dao");
const uploads_1 = require("../lib/uploads");
const http_1 = require("../lib/http");
const fs = require("fs");
const logger = require("winston");
const url = require("url");
const Path = require("path");
const cheerio = require("cheerio");
const config_1 = require("../config/config");
async function findClassList(req, res, next) {
    let { page, count, category_id, order_by, order_sort, search } = req.query;
    let { offset, limit } = utils.getPageCount(page, count);
    let options = {
        offset: offset,
        limit: limit,
        where: {
            state: 'normal'
        },
        order: [['unlocks', 'desc']]
    };
    if (category_id)
        options.where.category_id = category_id;
    if (order_by && order_sort)
        options.order = [[`${order_by}`, `${order_sort}`]];
    if (search && search !== '') {
        search = utils.trim(search);
        options.where.$or = [
            { title: { $like: `%${search}%` } },
            { abstract: { $like: `%${search}%` } },
            { author: { $like: `%${search}%` } },
            { author_abstract: { $like: `%${search}%` } }
        ];
    }
    let results = await dao_1.ClassesDao.getInstance().findClassList(options);
    if (!results)
        return res.sendErr('获取列表失败！');
    let data = results.rows.map(r => {
        let item = r.get();
        let sum = 0;
        if (item.catalogs && item.catalogs.length > 0) {
            item.catalogs.forEach((el) => {
                if (el && utils.isRealNumber(el.duration))
                    sum += Number(el.duration);
            });
        }
        item.duration = sum;
        item.catalogs = item.catalogs ? item.catalogs.length : 0;
        return item;
    });
    res.property('total', results.count);
    return res.sendOk(data);
}
exports.findClassList = findClassList;
async function findClassDetails(req, res, next) {
    let locked = true;
    let { id } = req.params;
    let results = await dao_1.ClassesDao.getInstance().findClassDetails(id, locked);
    if (!results)
        return res.sendErr('获取详情失败');
    if (results.state !== 'normal')
        return res.sendErr('该课程已下架');
    results.locked = locked;
    return res.sendOk(results);
}
exports.findClassDetails = findClassDetails;
async function create(req, res, next) {
    let { category_id, channel, original_price, price, title, abstract, author, author_abstract, cover_pic, desc, content, detail_pic } = req.body;
    console.log("-------------------------", detail_pic, uploads_1.imgHandler(detail_pic));
    let opt = {
        category_id: category_id,
        channel: channel,
        original_price: original_price,
        price: price,
        title: title,
        abstract: abstract,
        author: author,
        author_abstract: author_abstract,
        cover_pic: await uploads_1.imgHandler(cover_pic),
        desc: desc
    };
    let results = await dao_1.ClassesDao.getInstance().create(opt);
    if (!results)
        return res.sendErr('创建失败！');
    if (content || detail_pic) {
        let opts = { class_id: results.id };
        if (content)
            opts.content = content;
        if (detail_pic)
            opts.detail_pic = await uploads_1.imgHandler(detail_pic);
        await dao_1.DetailsDao.getInstance().create(opts);
    }
    return res.sendOk(results);
}
exports.create = create;
async function update(req, res, next) {
    let id = req.params['id'];
    let { category_id, channel, original_price, price, title, abstract, author, author_abstract, cover_pic, desc, unlocks, content, detail_pic } = req.body;
    let opt = {};
    if (category_id)
        opt.category_id = category_id;
    if (channel)
        opt.channel = channel;
    if (original_price)
        opt.original_price = original_price;
    if (price)
        opt.price = price;
    if (title)
        opt.title = title;
    if (abstract)
        opt.abstract = abstract;
    if (author)
        opt.author = author;
    if (author_abstract)
        opt.author_abstract = author_abstract;
    if (cover_pic)
        opt.cover_pic = uploads_1.imgHandler(cover_pic);
    if (desc)
        opt.desc = desc;
    if (unlocks)
        opt.unlocks = unlocks;
    if (content || detail_pic) {
        let opt = {};
        if (content)
            opt.content = content;
        if (detail_pic)
            opt.detail_pic = uploads_1.imgHandler(detail_pic);
        let result = await dao_1.DetailsDao.getInstance().updateByClassId(opt, id);
        if (!result)
            res.sendErr('更新错误');
    }
    if (JSON.stringify(opt) !== '{}') {
        let results = await dao_1.ClassesDao.getInstance().update(opt, id);
        if (!results)
            res.sendErr('更新错误');
        return res.sendOk(results);
    }
    return res.sendOk();
}
exports.update = update;
async function deleteClass(req, res, next) {
    let id = req.params['id'];
    let result = await dao_1.ClassesDao.getInstance().findByPrimary(id);
    if (!result)
        return res.sendErr('不存在的ID');
    let results = await dao_1.ClassesDao.getInstance().delete(id);
    if (!results)
        return res.sendErr('删除失败');
    return res.sendOk();
}
exports.deleteClass = deleteClass;
//图片下载
async function findImage(req, res, next) {
    let { img_src, sign } = req.body;
    let { protocol, host, path } = url.parse(img_src);
    protocol = protocol ? protocol.split(':')[0] : null;
    let myHttp = new http_1.myHttpRequest(host, path, protocol);
    let { format, chunks } = await myHttp.getImg();
    if (!format || !chunks)
        return res.sendErr(`myHttp getImg fail: ${img_src}`);
    let fileName = utils.randomString() + '-' + Date.now();
    let filePathName = Path.join(config_1.config.imageFolderTmp, `${fileName}.${format}`);
    fs.writeFile(filePathName, chunks, "binary", function (err) {
        if (err) {
            logger.error(`writeFile image fail: ${img_src}. \n${err.stack}`);
            return res.sendErr(`Can\'t download image by URL: ${img_src}`);
        }
        res.property("sign", sign);
        res.sendOk(`/public/upload_tmp/images/${fileName}.${format}`);
    });
}
exports.findImage = findImage;
//图片上传替换
async function updateImage(req, res, next) {
    let { content } = req.body;
    if (!content)
        return next();
    let $ = cheerio.load(content);
    let img = $('img');
    let num = 0;
    let failImage = [];
    for (let i = 0, len = img.length; i < len; i++) {
        let fileName = img.eq(i).attr("src");
        let re = /\S+-(\d{13})\.\S+$/;
        if (!re.test(fileName)) {
            num++;
            failImage.push(fileName);
            continue;
        }
        let newFileName = config_1.config.imageHost + uploads_1.imgHandler(fileName);
        content = content.replace(fileName, newFileName);
    }
    req.body.content = content;
    req.body.num = num;
    req.body.failImage = failImage;
    return next();
}
exports.updateImage = updateImage;

//# sourceMappingURL=../maps/controllers/classes.js.map
