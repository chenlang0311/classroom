"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require("winston");
const base_1 = require("./base");
const catalogs_1 = require("./catalogs");
exports.CatalogsDao = catalogs_1.CatalogsDao;
const categories_1 = require("./categories");
exports.CategoriesDao = categories_1.CategoriesDao;
const classes_1 = require("./classes");
exports.ClassesDao = classes_1.ClassesDao;
const details_1 = require("./details");
exports.DetailsDao = details_1.DetailsDao;
const swipers_1 = require("./swipers");
exports.SwipersDao = swipers_1.SwipersDao;
const orders_1 = require("./orders");
exports.OrdersDao = orders_1.OrdersDao;
const administrators_1 = require("./administrators");
exports.AdministratorsDao = administrators_1.AdministratorsDao;
function initInstance() {
    const seqz = base_1.SeqzDao.getInstance();
    /** init instance */
    catalogs_1.CatalogsDao.getInstance(seqz);
    categories_1.CategoriesDao.getInstance(seqz);
    classes_1.ClassesDao.getInstance(seqz);
    details_1.DetailsDao.getInstance(seqz);
    swipers_1.SwipersDao.getInstance(seqz);
    orders_1.OrdersDao.getInstance(seqz);
    administrators_1.AdministratorsDao.getInstance(seqz);
    /** end */
    logger.info('init instance OK.');
}
function initDao() {
    const seqz = base_1.SeqzDao.getInstance();
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
exports.initDao = initDao;

//# sourceMappingURL=../maps/dao/index.js.map
