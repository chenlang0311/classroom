"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.page = {
    optional: true,
    isInt: {
        options: [{ min: 1, max: 999999 }]
    },
    errorMessage: '页码错误'
};
exports.count = {
    optional: true,
    isInt: {
        options: [{ min: 1, max: 999999 }]
    },
    errorMessage: '页码错误'
};
exports.order_sort = {
    optional: true,
    myWhitelisted: {
        options: ['desc', 'asc']
    },
    errorMessage: '排序错误'
};
exports.id = {
    isInt: true,
    errorMessage: 'id错误'
};
exports.name = {
    notEmpty: true,
    errorMessage: '名称不能为空'
};
exports.pic = {
    notEmpty: true,
    errorMessage: '图片错误'
};

//# sourceMappingURL=../../maps/config/validate/common.js.map
