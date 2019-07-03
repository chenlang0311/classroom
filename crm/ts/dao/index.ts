import * as logger from 'winston';
import { SeqzDao } from './base';
import { CatalogsDao } from './catalogs';
import { CategoriesDao } from './categories';
import { ClassesDao } from './classes';
import { DetailsDao } from './details';
import { SwipersDao } from './swipers';
import { OrdersDao } from './orders';
import { AdministratorsDao } from './administrators';

function initInstance() {
    const seqz = SeqzDao.getInstance();

    /** init instance */

    CatalogsDao.getInstance(seqz);
    CategoriesDao.getInstance(seqz);
    ClassesDao.getInstance(seqz);
    DetailsDao.getInstance(seqz);

    SwipersDao.getInstance(seqz);
    OrdersDao.getInstance(seqz);
    AdministratorsDao.getInstance(seqz);
    /** end */

    logger.info('init instance OK.');
}

function initDao() {
    const seqz = SeqzDao.getInstance();

    /** init sequelize */
    seqz.import('../models/administrators');
    let Catalogs = seqz.import('../models/catalogs');
    seqz.import('../models/categories');
    let Classes = seqz.import('../models/classes');
    let Details = seqz.import('../models/details');
  
    seqz.import('../models/swipers');
    let Order = seqz.import('../models/orders');
    let Users = seqz.import('../models/users');

    Classes.hasMany(Catalogs, { foreignKey: 'class_id', as: 'catalogs' });
    Classes.hasOne(Details, { foreignKey: 'class_id', as: 'details' });
    Order.belongsTo(Users, { foreignKey: 'user_id', as: 'users' });
    Order.belongsTo(Classes, { foreignKey: 'class_id', as: 'classes' });
    // Catalogs.belongsTo(Classes, );
    // Details.belongsTo(Classes, { foreignKey: 'class_id', as: 'details' });
    /** end */

    logger.info('init sequelize OK.');
    return initInstance;
}

export {
    initDao,
    CatalogsDao,
    CategoriesDao,
    ClassesDao,
    DetailsDao,
    SwipersDao,
    OrdersDao,
    AdministratorsDao
}