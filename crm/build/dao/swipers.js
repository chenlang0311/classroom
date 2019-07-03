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
    async findSwiperList(opts) {
        let res = await this.model().findAndCount(opts);
        return res ? res : undefined;
    }
    async creatPage(opts) {
        let res = await this.model().create(opts);
        return res ? res : undefined;
    }
    async deleteSwiper(id) {
        let res = await this.model().update({ state: 'deleted' }, { where: { id: id } });
        return res && res[0] === 1 ? res[0] : undefined;
    }
    async findSwiperByPrimary(id) {
        let res = await this.model().findByPrimary(id);
        return res ? res.get() : undefined;
    }
    async updateSwiperLevel(id, level) {
        let res = await this.model().update({ level: level }, { where: { id: id } });
        return res && res[0] === 1 ? res[0] : undefined;
    }
}
Dao.tableName = 'swipers';
exports.SwipersDao = Dao;

//# sourceMappingURL=../maps/dao/swipers.js.map
