"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common = require("./common");
exports.authors = {
    '/login': {
        username: { notEmpty: true, errorMessage: '请输入用户名' },
        password: { notEmpty: true, isLength: { options: [{ min: 3, max: 32 }], errorMessage: '密码错误' }, errorMessage: '请输入密码' }
    },
    '/info/:id': {
        id: common.id,
    },
    '/list': {
        page: common.page,
        count: common.count,
    },
};

//# sourceMappingURL=../../maps/config/validate/authors.js.map
