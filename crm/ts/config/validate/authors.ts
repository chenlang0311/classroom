import * as common from './common';

export const authors: any = {
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
}