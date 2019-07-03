"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dao_1 = require("../dao");
const utils = require("../lib/utils");
//  列表
async function findOrderList(req, res, next) {
    let opts = {
        order: [['level', 'asc']]
    };
    let result = await dao_1.CategoriesDao.getInstance().findList(opts);
    if (!result)
        return res.sendErr('获取列表失败！');
    let data = [];
    result.rows.forEach(el => data.push(utils.cloneChildToSelf(el.get())));
    res.property('total', result.count);
    return res.sendOk(data);
}
exports.findOrderList = findOrderList;

//# sourceMappingURL=../maps/controllers/categories.js.map
