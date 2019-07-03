"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const administrators_1 = require("./v1/administrators");
const swipers_1 = require("./v1/swipers");
const classes_1 = require("./v1/classes");
const orders_1 = require("./v1/orders");
const categories_1 = require("./v1/categories");
const catalogs_1 = require("./v1/catalogs");
const uploads_1 = require("./v1/uploads");
function routers(app) {
    app.use('/crm/v1/administrators', administrators_1.default);
    app.use('/crm/v1/swipers', swipers_1.default);
    app.use('/crm/v1/classes', classes_1.default);
    app.use('/crm/v1/orders', orders_1.default);
    app.use('/crm/v1/categories', categories_1.default);
    app.use('/crm/v1/catalogs', catalogs_1.default);
    app.use('/crm/v1/uploads', uploads_1.default);
}
exports.routers = routers;

//# sourceMappingURL=../maps/routers/index.js.map
