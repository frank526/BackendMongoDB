import express from 'express';
import * as bodyParser from 'body-parser';

import { 
    getAllProduct,
    validateProductInfo,
    createProduct,
    getProductById,
    getProductByParams,
    updateProduct,
    deleteProduct,
    getProductWithVendor,
    validateUpdateProductInfo,
} from './controller';

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/product', getProductById);
router.get('/products', getAllProduct);
router.get('/productByParam', getProductByParams);
router.get('/productsVendor', getProductWithVendor);
router.post('/product', jsonParser, validateProductInfo, createProduct);
router.put('/product',jsonParser, validateUpdateProductInfo, updateProduct);
router.delete('/product', jsonParser, deleteProduct);


export default router;

