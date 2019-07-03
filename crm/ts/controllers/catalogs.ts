import { Request, Response, NextFunction } from 'express';
import { CatalogsDao } from '../dao';
import * as utils from '../lib/utils';
// import { imgHandler } from '../lib/uploads';
import { config } from '../config/config';
import { Qcapi } from '../lib/qcapi';
import * as logger from 'winston';
import { imgHandler } from '../lib/uploads';
import { myHttpRequest } from '../lib/http';
import * as fs from 'fs';
import * as url from 'url';
import * as Path from 'path';
import * as cheerio from 'cheerio';


export async function findCatalogDetails(req: Request, res: Response, next: NextFunction) {
    let { id } = req.params;
    let results = await CatalogsDao.getInstance().findByPrimary(id);
    if (!results) return res.sendErr('获取文稿失败');

    return res.sendOk(results);
}

export async function findCatalogList(req: Request, res: Response, next: NextFunction) {
    let { page, count, search } = req.query;
    let { offset, limit } = utils.getPageCount(page, count);

    let options: any = {
        offset: offset,
        limit: limit,
        where: {
            state: { $ne: 'deleted' }
        },
        order: [['created', 'desc']]
    };
    if (search && search !== '') {
        search = utils.trim(search);
        options.where.$or = [
            { title: { $like: `%${search}%` } },
        ];
    }

    let results = await CatalogsDao.getInstance().findCatalogList(options);
    if (!results) return res.sendErr('获取视频信息失败');

    let date: any[] = [];
    results.rows.forEach(el => {
        date.push(utils.cloneChildToSelf(el.get()))
    })
    res.property('total', results.count);
    return res.sendOk(date);
}


export async function updateCatalog(req: Request, res: Response, next: NextFunction) {
    let id = req.params['id'];
    let { class_id, title, audition, definition, cover_pic, reads, content, desc, level } = req.body;
    let result = await CatalogsDao.getInstance().findByPrimary(id);
    if (!result) return res.sendErr('没有此视频');

    let options: any = {};
    if (class_id) options.class_id = class_id;
    if (title) options.title = title;
    if (audition) options.audition = audition;
    if (definition) options.definition = definition;
    if (cover_pic) options.cover_pic = cover_pic;
    if (reads) options.reads = reads;
    if (content) options.content = content;
    if (desc) options.desc = desc;
    if (level) options.level = level;

    let results = await CatalogsDao.getInstance().updateCatalog(id, options);
    if (!results) return res.sendErr('更新视频信息失败');

    return res.sendOk();
}

export async function deleteCatalog(req: Request, res: Response, next: NextFunction) {
    let id = req.params['id'];

    let result = await CatalogsDao.getInstance().findByPrimary(id);
    if (!result) return res.sendErr('没有此视频');

    let results = await CatalogsDao.getInstance().deleteCatalog(id);
    if (!results) return res.sendErr('更新视频信息失败');

    return res.sendOk();
}
export async function addCatalog(req: Request, res: Response, next: NextFunction) {
    let { fileid, class_id, title, audition, definition, reads, content, desc, level } = req.body;

    let options: any = {
        fileid: fileid,
        class_id: class_id,
        title: title,
        audition: audition,
        definition: definition,
        // cover_pic: cover_pic.replace('http://1254407981.vod2.myqcloud.com', 'https://vodcjzw.topjinrong.net.cn'),
        reads: reads,
        content: content,
        desc: desc,
        level: level
    };

    let catalog = await CatalogsDao.getInstance().findByfileid(fileid);
    if (catalog && catalog.get().state !== 'deleted') return res.sendOk('已存在');

    let results = await CatalogsDao.getInstance().create(options);
    if (!results) return res.sendErr('添加视频失败');
    let result = await trans(fileid);
    if (!(result.code == 0)) {
        await CatalogsDao.getInstance().updateByFileid({ state: 'deleted' }, fileid);
        return res.sendErr('添加视频失败');
    }
    return res.sendOk();
}

async function trans(fileid: string) {
    let mp4info = await Qcapi.getInstance().request({
        Region: config.vod.defaultRegion,
        transcode: {
            definition: [10, 20, 30, 40],
        },
        Action: 'ProcessFile',
        fileId: fileid
    });
    return mp4info;

}

//主动获取视频信息
async function getinfo(fileid: string) {

    let mp4info = await Qcapi.getInstance().request({
        Region: config.vod.defaultRegion,
        Action: 'GetVideoInfo',
        fileId: fileid
    });

    let all: any = [];
    let mp4_true_info: any = {};
    if (mp4info.transcodeInfo && mp4info.transcodeInfo.transcodeList)
        all = mp4info.transcodeInfo.transcodeList;
    all.forEach((mp4_trans: any) => {
        if (mp4_trans.definition == 10) {
            console.log(mp4_trans);
            mp4_true_info = mp4_trans;
        }
    });

    if (JSON.stringify(mp4_true_info) !== '{}')
        save_mp4(mp4_true_info, mp4info.basicInfo, fileid);
    else return ''
    return mp4info;
}


export async function getqcinfo(req: Request, res: Response, next: NextFunction) {
    let fileid = req.query.fileid;
    let results = await CatalogsDao.getInstance().findByfileid(fileid);
    if (results.get().video_link && results.get().cover_pic && results.get().definition) return res.sendOk()

    let result = await getinfo(fileid)
    if (result == "") return res.sendErr('转码未完成')
    return res.sendOk(result);
}
// 帮助客户端生成签名（用于在PC上上传视频到 腾讯-VOD服务器）
export async function get_sig_for_client(req: Request, res: Response, next: NextFunction) {
    var querystring = require("querystring");
    var crypto = require('crypto');

    // 确定签名的当前时间和失效时间
    var current = parseInt(((new Date()).getTime() / 1000) + '')
    var expired = current + 86400;  // 签名有效期：1天
    var arg_list = {
        secretId: config.vod.secretId,
        currentTimeStamp: current,
        expireTime: expired,
        random: Math.round(Math.random() * Math.pow(2, 32))
    }

    // 计算签名
    var orignal = querystring.stringify(arg_list);
    var orignal_buffer = new Buffer(orignal, "utf8");
    var hmac = crypto.createHmac("sha1", config.vod.secretKey);
    var hmac_buffer = hmac.update(orignal_buffer).digest();
    var signature = Buffer.concat([hmac_buffer, orignal_buffer]).toString("base64");

    return res.sendOk(signature);
}

//接受腾讯-VOD服务器的请求. (视频转码完成后, 腾讯-VOD服务器会主动请求我们)
export async function qcloud_callback(req: Request, res: Response, next: NextFunction) {
    let { eventType, data } = req.body;
    let all: any = [];
    let mp4_true_info: any = [];

    logger.info('\n\n\n vod: qcloud_callback in\n');
    logger.info("vod:", eventType);
    logger.info("vod:", data);

    if (eventType != "TranscodeComplete") return res.sendOk();
    if (data && data.playSet) all = data.playSet;
    all.forEach((mp4_trans: any) => {
        if (mp4_trans.definition == 10) {
            mp4_true_info = mp4_trans;
            logger.info("vod:", mp4_true_info);
        }
    });

    logger.info('\n\n\n vod: qcloud_callback() call save_mp4 \n');
    save_mp4(mp4_true_info, data, data.fileId);
    return res.sendOk();
}

//保存视频转码后的 地址 （没有视频地址, 封面图片不要保存)
async function save_mp4(transcode: any, basic_info: any, fileid: string) {

    let result = await CatalogsDao.getInstance().findByfileid(fileid);
    if (!result || result.get().state == 'deleted') return '没有此视频';

    let mp4: any = {
        video_link: transcode.url.replace('http://1254407981.vod2.myqcloud.com', 'https://vodcjzw.topjinrong.net.cn'),
        definition: transcode.definition,
        duration: transcode.duration,
        size: transcode.size,
        cover_pic: basic_info.coverUrl.replace('http://1254407981.vod2.myqcloud.com', 'https://vodcjzw.topjinrong.net.cn'),
        state: 'normal'
    }

    if (!transcode.duration || !transcode.url || !basic_info.coverUrl) {
        logger.warn('\n\n\n vod: save_mp4().  FK QQ. duration=', transcode.duration, "mp4_url=", transcode.url, "coverUrl=", basic_info.coverUrl);
        return '';
    }
    if (!utils.isNumber(transcode.duration) || !utils.isString(transcode.url) || !utils.isString(basic_info.coverUrl) || !utils.isString(fileid)) {
        logger.warn('\n\n\n vod: save_mp4().  FK QQ. duration=', transcode.duration, "mp4_url=", transcode.url, "coverUrl=", basic_info.coverUrl);
        return '';
    }
    if (transcode.duration == "" || transcode.url == "" || basic_info.coverUrl == "") {
        logger.warn('\n\n\n vod: save_mp4().  FK QQ. duration=', transcode.duration, "mp4_url=", transcode.url, "coverUrl=", basic_info.coverUrl);
        return '';
    }

    logger.info('\n\n\n vod: save_mp4().  good QQ. duration=', transcode.duration, "mp4_url=", transcode.url, "coverUrl=", basic_info.coverUrl,
        "fileid=", fileid, "transcode.size=", transcode.size);


    let res = await CatalogsDao.getInstance().updateByFileid(mp4, fileid);

    return res;
}

//图片下载
export async function findImage(req: Request, res: Response, next: NextFunction) {
    let { img_src, sign } = req.body;
    let { protocol, host, path } = url.parse(img_src);
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
        res.sendOk(`${config.imageHost}/public/upload_tmp/images/${fileName}.${format}`);
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