import { Sequelize } from 'sequelize';
import { DaoBase, SeqzDao } from './base';

class Dao extends DaoBase {
    private static instance: Dao;
    private static tableName: string = 'swipers';

    private constructor(seqz: Sequelize, modelName: string) {
        super(seqz, modelName);
    }

    public static getInstance(seqz: Sequelize = SeqzDao.getInstance()) {
        if (!Dao.instance) Dao.instance = new Dao(seqz, this.tableName);
        return Dao.instance;
    }

    public async findSwiperList(opts: any) {
        let res = await this.model().findAndCount(opts);
        return res ? res : undefined;
    }

    public async creatPage(opts: any) {
        let res = await this.model().create(opts);
        return res ? res : undefined;
    }

    public async deleteSwiper(id: string | number) {
        let res = await this.model().update({ state: 'deleted' }, { where: { id: id } });
        return res && res[0] === 1 ? res[0] : undefined;
    }

    public async findSwiperByPrimary(id: string | number) {
        let res = await this.model().findByPrimary(id);
        return res ? res.get() : undefined;
    }

    public async updateSwiperLevel(id: string | number, level: string | number) {
        let res = await this.model().update({ level: level }, { where: { id: id } });
        return res && res[0] === 1 ? res[0] : undefined;
    }


}

export { Dao as SwipersDao }