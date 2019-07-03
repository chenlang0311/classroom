import { Sequelize } from 'sequelize';
import { DaoBase, SeqzDao } from './base';

class Dao extends DaoBase {
    private static instance: Dao;
    private static tableName: string = 'orders';

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

    public async findOrderList(opts: any) {
        opts.include = [
            { model: this.model('users'), as: 'users', attributes: ['nickname', 'phone'],  required: false },
            { model: this.model('classes'), as: 'classes',  required: false }
        ];
        let res = await this.model().findAndCount(opts);
        return res ? res : undefined;
    }
    
}

export { Dao as OrdersDao }