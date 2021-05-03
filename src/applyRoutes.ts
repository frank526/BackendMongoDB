import { Express } from 'express';
import routerProduct from './product/routes';
import routerVendor from './vendor/routes';

export default (app: Express) => {
    app.use('/api', routerProduct);
    app.use('/api', routerVendor);
}
