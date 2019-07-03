import { Request, Response, NextFunction } from "express";
import { config } from '../config/config';
// import * as utils from '../lib/utils';

export function uploadImage(req: Request, res: Response, next: NextFunction) {
    if (!(req.file && req.file.filename)) return res.sendErr('上传失败');
    let data: any = {
        name: req.file.filename,
        url: `${config.imageHost}/public/upload_tmp/images/${req.file.filename}`
    };
    
    return res.sendOk(data);
}