"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dao_1 = require("../dao");
const jwt_1 = require("../lib/jwt");
// import * as utils from '../lib/utils';
// 登录
async function login(req, res, next) {
    let { username, password } = req.body;
    let author = await dao_1.AdministratorsDao.getInstance().findAuthorByAuthorname(username);
    if (!author)
        return res.sendErr('用户名不存在');
    if (password !== author.password)
        return res.sendErr('密码错误');
    let token = jwt_1.jwtEncode(author);
    if (!token)
        return res.sendErr('生成token失败');
    return res.sendOk({ token: token });
}
exports.login = login;

//# sourceMappingURL=../maps/controllers/administrators.js.map
