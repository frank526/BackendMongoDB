import express from 'express';
import * as bodyParser from 'body-parser';
import { 
    createVendor,
    validateVendorInfo,
    getAllVendor,
    getVendorById,
    updateVendor,
    validateUpdateVendorInfo,
} from './controller';

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/vendors', getAllVendor);
router.get('/vendor', getVendorById);
router.post('/vendor', jsonParser, validateVendorInfo, createVendor);
router.put('/vendor', jsonParser, validateUpdateVendorInfo, updateVendor);


export default router;
