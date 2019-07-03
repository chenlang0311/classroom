import { Request, Response, NextFunction } from 'express';
import { SwipersDao, ClassesDao } from '../dao';
import * as utils from '../lib/utils';
import { imgHandler } from '../lib/uploads';
// import { config } from '../config/config';

//  图片列表
export async function findSwiperList(req: Request, res: Response, next: NextFunction) {
    let { page, count } = req.query;
    let { offset, limit } = utils.getPageCount(page, count);
    let opts: any = {
        attributes: ['id', 'parent_id', 'category', 'pic', 'title', 'level', 'channel'],
        where: { state: "normal" },
        offset: offset,
        limit: limit,
        order: [['level', 'desc']]
    };

    let result = await SwipersDao.getInstance().findSwiperList(opts);
    if (!result) return res.sendErr('获取图片列表失败！');
    result.rows.forEach((r: any) => {
        if (r.pic) r.pic = r.pic;
    });
    let data: any[] = [];
    for (let i = 0; i < result.rows.length; i++) {
        let el = result.rows[i];
        let class_id = el.get().parent_id;
        let results = await ClassesDao.getInstance().findByPrimary(class_id);
        if (results) {
            el.get().class_name = results.title;
        }
        data.push(el.get())
    }
    res.property('total', result.count);
    return res.sendOk(data);
}


// 增加主页图
export async function addSwiper(req: Request, res: Response, next: NextFunction) {
    let { parent_id, category, pic, title, level, channel, url } = req.body;
    let opts: any = {
        parent_id: parent_id, category: category, pic: imgHandler(pic), title: title, level: level, channel: channel, url: url
    }
    let results = await SwipersDao.getInstance().creatPage(opts);
    if (!results) return res.sendErr('增加图片失败！');
    return res.sendOk();
}

//删除图
export async function deleteSwiper(req: Request, res: Response, next: NextFunction) {
    let id = req.params['id'];

    let pages = await SwipersDao.getInstance().findSwiperByPrimary(id);
    if (!pages) return res.sendErr('删除失败！不存在的图片ID');

    let results = await SwipersDao.getInstance().deleteSwiper(id);
    if (!results) return res.sendErr('删除图片失败！');

    return res.sendOk();
}

//更新图片优先级
export async function updateSwiperLevel(req: Request, res: Response, next: NextFunction) {
    let id = req.params['id'];
    let level = req.body.level;

    let pages = await SwipersDao.getInstance().findSwiperByPrimary(id);
    if (!pages) return res.sendErr('不存在的图片ID');

    let results = await SwipersDao.getInstance().updateSwiperLevel(id, level);
    if (!results) return res.sendErr('更新图片失败');

    return res.sendOk();
}