import { Request, Response, NextFunction } from 'express';
import { AdministratorsDao } from '../dao';
import { jwtEncode } from '../lib/jwt';
// import * as utils from '../lib/utils';


// 登录
export async function login(req: Request, res: Response, next: NextFunction) {
    let { username, password } = req.body;
    let author = await AdministratorsDao.getInstance().findAuthorByAuthorname(username);
    if (!author) return res.sendErr('用户名不存在');

    if (password !== author.password) return res.sendErr('密码错误');
    let token = jwtEncode(author);
    if (!token) return res.sendErr('生成token失败');

    return res.sendOk({ token: token});
}

 