"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dao_1 = require("../dao");
const utils = require("../lib/utils");
//  列表
async function findOrderList(req, res, next) {
    let { page, count, search } = req.query;
    let { offset, limit } = utils.getPageCount(page, count);
    let opts = {
        where: {},
        offset: offset,
        limit: limit,
        order: [['created', 'desc']]
    };
    if (search && search !== '') {
        search = utils.trim(search);
        opts.where.$or = [
            { out_trade_no: { $like: `%${search}%` } },
            { transaction_id: { $like: `%${search}%` } },
            { prepay_id: { $like: `%${search}%` } },
            { '$users.nickname$': { $like: `%${search}%` } },
            { '$classes.title$': { $like: `%${search}%` } }
        ];
    }
    let result = await dao_1.OrdersDao.getInstance().findOrderList(opts);
    if (!result)
        return res.sendErr('获取列表失败！');
    let data = [];
    result.rows.forEach(el => data.push(utils.cloneChildToSelf(el.get())));
    res.property('total', result.count);
    return res.sendOk(data);
}
exports.findOrderList = findOrderList;

//# sourceMappingURL=../maps/controllers/orders.js.map
