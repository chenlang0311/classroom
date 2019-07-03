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
    async findClassIdByFileid(fileid) {
        let res = await this.model().findOne({ where: { fileid: fileid } });
        return res ? res.get() : undefined;
    }
    async findCatalogList(opt) {
        let res = await this.model().findAndCount(opt);
        return res ? res : undefined;
    }
    async create(opt) {
        let res = await this.model().create(opt);
        return res ? res : undefined;
    }
    async updateCatalog(id, opt) {
        let res = await this.model().update(opt, { where: { id: id } });
        return res ? res : undefined;
    }
    async deleteCatalog(id) {
        let res = await this.model().update({ state: 'deleted' }, { where: { id: id } });
        return res ? res : undefined;
    }
    async updateByFileid(opt, fileid) {
        let res = await this.model().update(opt, { where: { fileid: fileid } });
        return res ? res : undefined;
    }
    async findByfileid(fileid) {
        let res = await this.model().findOne({ where: { fileid: fileid } });
        return res ? res : undefined;
    }
}
Dao.tableName = 'catalogs';
exports.CatalogsDao = Dao;

//# sourceMappingURL=../maps/dao/catalogs.js.map
