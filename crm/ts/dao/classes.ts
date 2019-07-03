import { Sequelize } from 'sequelize';
import { DaoBase, SeqzDao } from './base';

class Dao extends DaoBase {
    private static instance: Dao;
    private static tableName: string = 'classes';

    public constructor(seqz: Sequelize, modelName: string) {
        super(seqz, modelName);
    }

    public static getInstance(seqz: Sequelize = SeqzDao.getInstance()) {
        if (!Dao.instance) Dao.instance = new Dao(seqz, this.tableName);
        return Dao.instance;
    }

    public async findByPrimary(id: string | number) {
        let res = await this.model().findByPrimary(id);
        return res ? res.get() : undefined;
    }

    public async findClassList(opts: any) {
        let count = await this.model().count(opts);
        let catalogs = 'catalogs';
        let model_catalogs = this.model(catalogs);
        opts.include = [
            { model: model_catalogs, as: catalogs, attributes: ['duration', 'level'], where: { state: 'normal' }, required: false }
        ];

        let res = await this.model().findAll(opts);
        return res ? { count: count, rows: res } : undefined;
    }

    public async findClassDetails(id: string | number, locked: boolean) {
        let [catalogs, details] = ['catalogs', 'details'];
        let [model_catalogs, model_details] = [this.model(catalogs), this.model(details)];

        let options: any = { where: { id: id } };
        let attr = ['id', 'title', 'audition', 'duration', 'cover_pic', 'reads', 'desc', 'content', 'fileid', 'level'];
        if (!locked) attr.push('video_link');

        options.include = [
            { model: model_catalogs, as: catalogs, attributes: attr, where: { state: { $ne: 'deleted' } }, required: false },
            { model: model_details, as: details, attributes: ['detail_pic', 'content', 'desc'], required: false }
        ];

        let res = await this.model().findOne(options);
        return res ? res.get() : undefined;
    }

    public async create(opt: any) {
        let res = await this.model().create(opt);
        return res ? res.get() : undefined;
    }

    public async update(opt: any, id: string | number) {
        let res = await this.model().update(opt, { where: { id: id } });
        return res ? res : undefined;
    }
    public async delete(id: string | number) {
        let res = await this.model().update({ state: 'deleted' }, { where: { id: id } });
        return res ? res : undefined;
    }
}

export { Dao as ClassesDao }