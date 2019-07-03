import { Sequelize } from 'sequelize';
import { DaoBase, SeqzDao } from './base';

class Dao extends DaoBase {
    private static instance: Dao;
    private static tableName: string = 'details';

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
    public async create(opt: any) {
        let res = await this.model().create(opt);
        return res ? res.get() : undefined;
    }

    public async updateByClassId(opt: any, class_id: string | number) {
        let res = await this.model().update(opt, { where: { class_id: class_id } });
        return res ? res : undefined;
    }
}

export { Dao as DetailsDao }