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
    async create(opt) {
        let res = await this.model().create(opt);
        return res ? res.get() : undefined;
    }
    async updateByClassId(opt, class_id) {
        let res = await this.model().update(opt, { where: { class_id: class_id } });
        return res ? res : undefined;
    }
}
Dao.tableName = 'details';
exports.DetailsDao = Dao;

//# sourceMappingURL=../maps/dao/details.js.map
