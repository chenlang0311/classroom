"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("./base");
class Dao extends base_1.DaoBase {
    constructor(seqz, modelName) {
        super(seqz, modelName);
    }
    static getInstance(seqz = base_1.SeqzDao.getInstance()) {
        if (!Dao.instance)
            Dao.instance = new Dao(seqz, this.tableName);
        return Dao.instance;
    }
    async findByPrimary(id) {
        let res = await this.model().findByPrimary(id);
        return res ? res.get() : undefined;
    }
    async findOrderList(opts) {
        opts.include = [
            { model: this.model('users'), as: 'users', attributes: ['nickname', 'phone'], required: false },
            { model: this.model('classes'), as: 'classes', required: false }
        ];
        let res = await this.model().findAndCount(opts);
        return res ? res : undefined;
    }
}
Dao.tableName = 'orders';
exports.OrdersDao = Dao;

//# sourceMappingURL=../maps/dao/orders.js.map
