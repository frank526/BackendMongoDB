import mongoose from 'mongoose';
import { VendorModel } from '../models';
import config from '../config';
const { 
    BAD_REQUEST_CODE_400,
    CREATED_REQUEST_CODE,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND_CODE_404,
 } = config;

const getVendorById: Middleware = async (req, res) => {
    if(!req.query || !req.query.id) {
        const error = 'Vendor ID is required'
        return res.status(BAD_REQUEST_CODE_400).send(error);
    }
    const id = req.query.id;
    let  vendorFound: IVendor;
    try {
         vendorFound = await VendorModel.findById({_id: id });
    } catch(error) {
        return res.status(BAD_REQUEST_CODE_400).send(error);
    }

    if(!vendorFound) {
        return res.status(NOT_FOUND_CODE_404).send('Vendor not found');
    }
    return res.json({ vendor : vendorFound });
}

const getAllVendor: Middleware = async (req, res) => {
    let vendorList :IVendor[];
    try {
        vendorList = await VendorModel.find({});
    } catch(error) {
        return res.status(BAD_REQUEST_CODE_400).send(error);
    }
    const response = {
        count: vendorList.length,
        vendors: vendorList,
    };
    return res.json(response);
}

const validateVendorInfo: MiddlewareNext = async (req, res, next ) => {
    const errors: string[]  = [];
    const vendorData = req.body.vendor as IVendor;    
    if(!vendorData.name || typeof vendorData.name !== 'string' || !vendorData.name.trim()) {
        errors.push('Vendor name is invalid');
    }
    if(!vendorData.city || typeof vendorData.city  !== 'string' || !vendorData.city.trim()) {
        errors.push('City is invalid');
    }
    if(!vendorData.contact || typeof vendorData.contact  !== 'string' || !vendorData.contact.trim()) {
        errors.push('Contact is invalid');
    }
    if(!vendorData.country || typeof vendorData.country  !== 'string' || !vendorData.country.trim()) {
        errors.push('Country is invalid');
    }

    if(errors.length) {
        return res.status(BAD_REQUEST_CODE_400).send(errors.join('\n'));
    }
    return next();
} 

 const validateUpdateVendorInfo: MiddlewareNext = async (req, res, next ) => {
    const errors: string[]  = [];
    const vendorData = req.body.vendor as IVendor;

    if(!vendorData) {
        const error = 'Vendor Data is empty';
        return res.status(BAD_REQUEST_CODE_400).send(error);
    }

    const {name, city, contact, country} = vendorData;
    if(name &&( typeof name !== 'string' || !name.trim())) {
        errors.push('Vendor name is invalid');
    }
    if(city && (typeof city  !== 'string' || !city.trim())) {
        errors.push('City is invalid');
    }
    if(contact && (typeof contact  !== 'string' || !contact.trim())) {
        errors.push('Contact is invalid');
    }
    if(country && (typeof country  !== 'string' || !country.trim())) { 
        errors.push('Country is invalid');
    }
    if(errors.length) {
        return res.status(BAD_REQUEST_CODE_400).send(errors.join('\n'));
    }
    return next();
} 

const createVendor: Middleware = async (req, res) => {
    const vendorData = req.body.vendor;
    vendorData._id  = mongoose.Types.ObjectId();
    const newVendor = new VendorModel(vendorData);
    let vendor;
    try {
        vendor = await newVendor.save();
    } catch(error) {
        return res.status(BAD_REQUEST_CODE_400).send(error);
    }
    return res.status(CREATED_REQUEST_CODE).json({ vendor });
}

const updateVendor: Middleware = async(req, res) => {
    const { id } = req.body.vendor;
    if(!id) {
        const error = 'Vendor ID is required';
        return res.status(BAD_REQUEST_CODE_400).send(error);
    }
    const { vendor } = req.body;
    let updatedVendor: IVendor;
    try {
       updatedVendor = await VendorModel.findByIdAndUpdate({_id: id}, vendor, { new:true });
    }catch(error) {
        return res.status(INTERNAL_SERVER_ERROR).send(error);
    }
    if(!updatedVendor) {
        return res.status(NOT_FOUND_CODE_404).send(`Vendor ${id} not found`);
    }
    return res.json(updatedVendor);
}

export { 
    createVendor,
    validateVendorInfo,
    validateUpdateVendorInfo,
    getVendorById,
    getAllVendor,
    updateVendor,
};
