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
    async findAuthorByAuthorname(username) {
        let res = await this.model().findOne({ where: { username: username } });
        return res ? res.get() : undefined;
    }
    async findByPrimary(id) {
        let res = await this.model().findByPrimary(id);
        return res ? res.get() : undefined;
    }
}
Dao.tableName = 'administrators';
exports.AdministratorsDao = Dao;

//# sourceMappingURL=../maps/dao/administrators.js.map
