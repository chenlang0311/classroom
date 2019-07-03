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
    async findClassList(opts) {
        let count = await this.model().count(opts);
        let catalogs = 'catalogs';
        let model_catalogs = this.model(catalogs);
        opts.include = [
            { model: model_catalogs, as: catalogs, attributes: ['duration', 'level'], where: { state: 'normal' }, required: false }
        ];
        let res = await this.model().findAll(opts);
        return res ? { count: count, rows: res } : undefined;
    }
    async findClassDetails(id, locked) {
        let [catalogs, details] = ['catalogs', 'details'];
        let [model_catalogs, model_details] = [this.model(catalogs), this.model(details)];
        let options = { where: { id: id } };
        let attr = ['id', 'title', 'audition', 'duration', 'cover_pic', 'reads', 'desc', 'content', 'fileid', 'level'];
        if (!locked)
            attr.push('video_link');
        options.include = [
            { model: model_catalogs, as: catalogs, attributes: attr, where: { state: { $ne: 'deleted' } }, required: false },
            { model: model_details, as: details, attributes: ['detail_pic', 'content', 'desc'], required: false }
        ];
        let res = await this.model().findOne(options);
        return res ? res.get() : undefined;
    }
    async create(opt) {
        let res = await this.model().create(opt);
        return res ? res.get() : undefined;
    }
    async update(opt, id) {
        let res = await this.model().update(opt, { where: { id: id } });
        return res ? res : undefined;
    }
    async delete(id) {
        let res = await this.model().update({ state: 'deleted' }, { where: { id: id } });
        return res ? res : undefined;
    }
}
Dao.tableName = 'classes';
exports.ClassesDao = Dao;

//# sourceMappingURL=../maps/dao/classes.js.map
