import { Application } from 'express';
import AdministratorsRouterV1 from './v1/administrators';
import SwipersRouterV1 from './v1/swipers';
import ClassesRouterV1 from './v1/classes';
import OrdersRouterV1 from './v1/orders';
import CategoriesRouterV1 from './v1/categories';
import CatalogsRouterV1 from './v1/catalogs';
import UploadsRouterV1 from './v1/uploads';

export function routers(app: Application) {
	app.use('/crm/v1/administrators', AdministratorsRouterV1);
	app.use('/crm/v1/swipers', SwipersRouterV1);
	app.use('/crm/v1/classes', ClassesRouterV1);
	app.use('/crm/v1/orders', OrdersRouterV1);
	app.use('/crm/v1/categories', CategoriesRouterV1);
	app.use('/crm/v1/catalogs', CatalogsRouterV1);
	app.use('/crm/v1/uploads', UploadsRouterV1);

}