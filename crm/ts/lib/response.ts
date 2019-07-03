import { Request, Response, NextFunction } from "express";

export function response(req: Request, res: Response, next: NextFunction) {
    let success = (data: any = {}, statusCode: number = 200) => {
        res.status(statusCode);
        let result: any = { status: true, data: data }

        if (res.extraProperty) {
            for (let key in res.extraProperty) {
                result[key] = res.extraProperty[key];
            }
        }
        res.json(result);
    }
    let fail = (e: Error = new Error()) => {
        res.status(e instanceof ReqError ? e.getStatusCode() : 500);
        res.json({ status: false, msg: e.message, code: e instanceof ReqError ? e.getCode() : 1000 });
    }

    /**
     * 异常回复
     */
    res.sendError = (e: Error = new Error()) => fail(e);

    res.sendErr = (msg: any = '') => fail(new ReqError(msg, 1100));

    res.sendErrMsg = (msg: any = '') => fail(new ReqError(msg, 1103));

    res.sendNotLogin = (msg: any = '未登录') => fail(new ReqError(msg, 1101));

    res.sendNotRole = (msg: any = '权限不足') => fail(new ReqError(msg, 1201));

    res.sendNotFound = (msg: any = '资源不存在') => fail(new ReqError(msg, 1104, 404));

    /**
     * 成功回复
     */
    res.sendOk = (data: any = {}, statusCode: number = 200) => success(data, statusCode);

    res.createdOk = (data: any = {}, statusCode: number = 201) => success(data, statusCode);

    res.deleteOK = (data: any = {}, statusCode: number = 204) => success(data, statusCode);

    res.property = (key: string, val: any) => {
        res.extraProperty = res.extraProperty || {};
        res.extraProperty[key] = val;
    }
    

    next();
}

export class ReqError extends Error {
    private code: number;
    private statusCode: number;
    constructor(msg: string, code = 1000, statusCode = 200) {
        super(msg);
        this.code = code;
        this.statusCode = statusCode;
    }

    getCode(): number {
        return this.code;
    }

    getStatusCode(): number {
        return this.statusCode;
    }
}