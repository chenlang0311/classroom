"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dao_1 = require("../dao");
const utils = require("../lib/utils");
const uploads_1 = require("../lib/uploads");
// import { config } from '../config/config';
//  图片列表
async function findSwiperList(req, res, next) {
    let { page, count } = req.query;
    let { offset, limit } = utils.getPageCount(page, count);
    let opts = {
        attributes: ['id', 'parent_id', 'category', 'pic', 'title', 'level', 'channel'],
        where: { state: "normal" },
        offset: offset,
        limit: limit,
        order: [['level', 'desc']]
    };
    let result = await dao_1.SwipersDao.getInstance().findSwiperList(opts);
    if (!result)
        return res.sendErr('获取图片列表失败！');
    result.rows.forEach((r) => {
        if (r.pic)
            r.pic = r.pic;
    });
    let data = [];
    for (let i = 0; i < result.rows.length; i++) {
        let el = result.rows[i];
        let class_id = el.get().parent_id;
        let results = await dao_1.ClassesDao.getInstance().findByPrimary(class_id);
        if (results) {
            el.get().class_name = results.title;
        }
        data.push(el.get());
    }
    res.property('total', result.count);
    return res.sendOk(data);
}
exports.findSwiperList = findSwiperList;
// 增加主页图
async function addSwiper(req, res, next) {
    let { parent_id, category, pic, title, level, channel, url } = req.body;
    let opts = {
        parent_id: parent_id, category: category, pic: uploads_1.imgHandler(pic), title: title, level: level, channel: channel, url: url
    };
    let results = await dao_1.SwipersDao.getInstance().creatPage(opts);
    if (!results)
        return res.sendErr('增加图片失败！');
    return res.sendOk();
}
exports.addSwiper = addSwiper;
//删除图
async function deleteSwiper(req, res, next) {
    let id = req.params['id'];
    let pages = await dao_1.SwipersDao.getInstance().findSwiperByPrimary(id);
    if (!pages)
        return res.sendErr('删除失败！不存在的图片ID');
    let results = await dao_1.SwipersDao.getInstance().deleteSwiper(id);
    if (!results)
        return res.sendErr('删除图片失败！');
    return res.sendOk();
}
exports.deleteSwiper = deleteSwiper;
//更新图片优先级
async function updateSwiperLevel(req, res, next) {
    let id = req.params['id'];
    let level = req.body.level;
    let pages = await dao_1.SwipersDao.getInstance().findSwiperByPrimary(id);
    if (!pages)
        return res.sendErr('不存在的图片ID');
    let results = await dao_1.SwipersDao.getInstance().updateSwiperLevel(id, level);
    if (!results)
        return res.sendErr('更新图片失败');
    return res.sendOk();
}
exports.updateSwiperLevel = updateSwiperLevel;

//# sourceMappingURL=../maps/controllers/swipers.js.map
