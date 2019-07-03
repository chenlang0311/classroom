import * as common from './common';

export const homepages: any = {
    '/list': {
        page: common.page,
        count: common.count,
    },
    '/add': {
        parent_id: common.id,
        category: { notEmpty: true, myWhitelisted: { options: ['pages', 'videos', '*'] }, errorMessage: '分类选择错误' },
        pic: { notEmpty: true, isURL: { options: { require_protocol: false } }, errorMessage: '图片地址错误' },
        level: { notEmpty: true, isInt: true, errorMessage: "优先级不能为空且只能为数字" }
    },
    '/delete/:id': {
        id: common.id
    },
    '/updatelevel/:id': {
        id: common.id,
        level: { notEmpty: true, isInt: true, errorMessage: "优先级不能为空且只能为数字" }
    },

}