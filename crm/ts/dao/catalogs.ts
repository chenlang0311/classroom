import { Sequelize } from 'sequelize';
import { DaoBase, SeqzDao } from './base';

class Dao extends DaoBase {
    private static instance: Dao;
    private static tableName: string = 'catalogs';

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

    public async findClassIdByFileid(fileid: string | number) {
        let res = await this.model().findOne({ where: { fileid: fileid } });
        return res ? res.get() : undefined;
    }

    public async findCatalogList(opt: any) {
        let res = await this.model().findAndCount(opt);
        return res ? res : undefined;
    }

    public async create(opt: any) {
        let res = await this.model().create(opt);
        return res ? res : undefined;
    }
    public async updateCatalog(id: string | number, opt: any) {
        let res = await this.model().update(opt, { where: { id: id } });
        return res ? res : undefined;
    }
    public async deleteCatalog(id: string | number) {
        let res = await this.model().update({ state: 'deleted' }, { where: { id: id } });
        return res ? res : undefined;
    }

    public async updateByFileid(opt: any, fileid: string | number) {
        let res = await this.model().update(opt, { where: { fileid: fileid } });
        return res ? res : undefined;
    }
    
    public async findByfileid(fileid: string | number) {
        let res = await this.model().findOne({ where: { fileid: fileid } });
        return res ? res : undefined;
    }
}

export { Dao as CatalogsDao }