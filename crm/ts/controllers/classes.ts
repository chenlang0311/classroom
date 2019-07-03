import { Request, Response, NextFunction } from 'express';
import * as utils from '../lib/utils';
import { ClassesDao, DetailsDao } from '../dao';
import { imgHandler } from '../lib/uploads';
import { myHttpRequest } from '../lib/http';
import * as fs from 'fs';
import * as logger from 'winston';
import * as url from 'url';
import * as Path from 'path';
import * as cheerio from 'cheerio';
import { config } from '../config/config';


export async function findClassList(req: Request, res: Response, next: NextFunction) {
    let { page, count, category_id, order_by, order_sort, search } = req.query;
    let { offset, limit } = utils.getPageCount(page, count);

    let options: any = {
        offset: offset,
        limit: limit,
        where: {
            state: 'normal'
        },
        order: [['unlocks', 'desc']]
    };

    if (category_id) options.where.category_id = category_id;
    if (order_by && order_sort) options.order = [[`${order_by}`, `${order_sort}`]];
    if (search && search !== '') {
        search = utils.trim(search);
        options.where.$or = [
            { title: { $like: `%${search}%` } },
            { abstract: { $like: `%${search}%` } },
            { author: { $like: `%${search}%` } },
            { author_abstract: { $like: `%${search}%` } }
        ];
    }

    let results = await ClassesDao.getInstance().findClassList(options);
    if (!results) return res.sendErr('获取列表失败！');

    let data = results.rows.map(r => {
        let item = r.get();
        let sum = 0;
        if (item.catalogs && item.catalogs.length > 0) {
            item.catalogs.forEach((el: any) => {
                if (el && utils.isRealNumber(el.duration)) sum += Number(el.duration);
            });
        }
        item.duration = sum;
        item.catalogs = item.catalogs ? item.catalogs.length : 0;
        return item;
    });

    res.property('total', results.count);
    return res.sendOk(data);
}

export async function findClassDetails(req: Request, res: Response, next: NextFunction) {
    let locked = true;
    let { id } = req.params;

    let results = await ClassesDao.getInstance().findClassDetails(id, locked);
    if (!results) return res.sendErr('获取详情失败');
    if (results.state !== 'normal') return res.sendErr('该课程已下架');

    results.locked = locked;
    return res.sendOk(results);
}

export async function create(req: Request, res: Response, next: NextFunction) {
    let { category_id, channel, original_price, price, title, abstract, author, author_abstract, cover_pic, desc, content, detail_pic } = req.body;
    console.log("-------------------------",detail_pic, imgHandler(detail_pic))
    let opt: any = {
        category_id: category_id,
        channel: channel,
        original_price: original_price,
        price: price,
        title: title,
        abstract: abstract,
        author: author,
        author_abstract: author_abstract,
        cover_pic: await imgHandler(cover_pic),
        desc: desc
    }

    let results = await ClassesDao.getInstance().create(opt);
    if (!results) return res.sendErr('创建失败！');

    if (content || detail_pic) {
        let opts:any ={class_id: results.id};
        if (content) opts.content = content;
        if (detail_pic) opts.detail_pic = await imgHandler(detail_pic);
        await DetailsDao.getInstance().create(opts);
    }
    return res.sendOk(results);
}

export async function update(req: Request, res: Response, next: NextFunction) {
    let id = req.params['id'];
    let { category_id, channel, original_price, price, title, abstract, author, author_abstract, cover_pic, desc, unlocks, content, detail_pic } = req.body;
    let opt: any = {}
    if (category_id) opt.category_id = category_id;
    if (channel) opt.channel = channel;
    if (original_price) opt.original_price = original_price;
    if (price) opt.price = price;
    if (title) opt.title = title;
    if (abstract) opt.abstract = abstract;
    if (author) opt.author = author;
    if (author_abstract) opt.author_abstract = author_abstract;
    if (cover_pic) opt.cover_pic = imgHandler(cover_pic);
    if (desc) opt.desc = desc;
    if (unlocks) opt.unlocks = unlocks;
    
    if (content || detail_pic) {
        let opt: any = {}
        if (content) opt.content = content;
        if (detail_pic) opt.detail_pic = imgHandler(detail_pic);
        let result = await DetailsDao.getInstance().updateByClassId(opt, id);
        if (!result) res.sendErr('更新错误')
    }
    if (JSON.stringify(opt) !== '{}') {
        let results = await ClassesDao.getInstance().update(opt, id);
        if (!results) res.sendErr('更新错误')
        return res.sendOk(results);
    }
    return res.sendOk();
}

export async function deleteClass(req: Request, res: Response, next: NextFunction) {
    let id = req.params['id'];

    let result = await ClassesDao.getInstance().findByPrimary(id);
    if (!result) return res.sendErr('不存在的ID');

    let results = await ClassesDao.getInstance().delete(id);
    if (!results) return res.sendErr('删除失败');
    return res.sendOk();
}


//图片下载
export async function findImage(req: Request, res: Response, next: NextFunction) {
    let { img_src, sign } = req.body;
    let { protocol, host, path } = url.parse(img_src);
    protocol = protocol ? protocol.split(':')[0] : null;
    let myHttp = new myHttpRequest(host, path, protocol);
    let { format, chunks } = await myHttp.getImg();
    if (!format || !chunks) return res.sendErr(`myHttp getImg fail: ${img_src}`);

    let fileName = utils.randomString() + '-' + Date.now();
    let filePathName = Path.join(config.imageFolderTmp, `${fileName}.${format}`);

    fs.writeFile(filePathName, chunks, "binary", function (err) {
        if (err) {
            logger.error(`writeFile image fail: ${img_src}. \n${err.stack}`);
            return res.sendErr(`Can\'t download image by URL: ${img_src}`);
        }
        res.property("sign", sign);
        res.sendOk(`/public/upload_tmp/images/${fileName}.${format}`);
    });
}

//图片上传替换
export async function updateImage(req: Request, res: Response, next: NextFunction) {
    let { content } = req.body;
    if (!content) return next();

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
        let newFileName = config.imageHost + imgHandler(fileName);
        content = content.replace(fileName, newFileName)
    }
    req.body.content = content;
    req.body.num = num;
    req.body.failImage = failImage;
    return next();
}
