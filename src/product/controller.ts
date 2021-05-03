import mongoose from 'mongoose';
import { ProductModel, VendorModel } from '../models';
import config from '../config';
const { 
    BAD_REQUEST_CODE_400,
    CREATED_REQUEST_CODE,
    NOT_FOUND_CODE_404,
    INTERNAL_SERVER_ERROR,
 } = config;

const getAllProduct: Middleware = async (req, res) => {
    let productList: IProduct[];
    try {
        productList = await ProductModel.find({});
    } catch(error) {
        return res.status(INTERNAL_SERVER_ERROR).send(error);
    }
    const response = {
        count: productList.length,
        products: productList,
    };
    return res.json(response);
}

const getProductWithVendor: Middleware = async(req, res) => {
    let products: IProduct[];
    try {
        products = await ProductModel.find({});
    } catch(error) {
        return res.status(INTERNAL_SERVER_ERROR).send(error);
    }

    let productVendors;
    try {
        productVendors = await VendorModel.populate(products, { path: 'vendor', select:['name'] });
    }catch(error) {
        return res.status(INTERNAL_SERVER_ERROR).send(error);
    }
    return res.json({ products: productVendors });
}

const getProductById: Middleware = async (req, res) => {
    if(!req.query || !req.query.id) {
        const error = 'Product ID is required'
        return res.status(BAD_REQUEST_CODE_400).send(error);
    }
    const { id } = req.query;
    let foundProduct: IProduct;
    try {
        foundProduct = await ProductModel.findById({_id: id });
    } catch(error) {
        return res.status(INTERNAL_SERVER_ERROR).send(error);
    }
    return res.json({ product:foundProduct });
}

const getProductByParams: Middleware = async(req, res) => {
    if(!req.query) {
        const error = 'Request query by params is invalid';
        return res.status(BAD_REQUEST_CODE_400).send(error);
    }
     const params = Object.keys(req.query);
     const possibleParams = ['name', 'sku'];
     const filter = {};
     params.forEach((param) => {
         if(possibleParams.indexOf(param)!==-1) {
             filter[param] = req.query[param];
         }
     });
     
     if(!Object.keys(filter).length) {
        const error = 'Invalid Request Params'; 
        return res.status(BAD_REQUEST_CODE_400).send(error);
     }

    let foundProduct: IProduct[];
    try {
        foundProduct = await ProductModel.find(filter);
    } catch(error) {
        return res.status(INTERNAL_SERVER_ERROR).send(error);
    }
    return res.json({ product:foundProduct });
}

const updateProduct: Middleware = async(req, res) => {
    const { id } = req.body.product;
    if(!id) {
        const error = 'Product ID is required';
        return res.status(BAD_REQUEST_CODE_400).send(error);
    }
    const { product } = req.body;
    let updatedProduct;
    try {
       updatedProduct = await ProductModel.findByIdAndUpdate({_id: id}, product, { new:true });
    }catch(error) {
        return res.status(INTERNAL_SERVER_ERROR).send(error);
    }
    if(!updatedProduct) {
        return res.status(NOT_FOUND_CODE_404).send(`Product ${id} not found`);
    }
    return res.json(updatedProduct);
}

const deleteProduct: Middleware = async(req, res) => {
    if(!req.body || !req.body.product || !req.body.product.id) {
        const error = 'Product ID is required';
        return res.status(BAD_REQUEST_CODE_400).send(error);
    }
    const { id } = req.body.product;
    let deletedProduct: IProduct;
    try {
        deletedProduct = await ProductModel.findByIdAndDelete({_id: id });
    }catch(error) {
        return res.status(INTERNAL_SERVER_ERROR).send(error);
    }
    if(!deleteProduct) {
        return res.status(NOT_FOUND_CODE_404).send(`Product ${id} not found`);
    }
    return res.json({product: deletedProduct});
}

const validateProductInfo: MiddlewareNext = async(req, res, next ) => {
    const errors: string[]  = [];
    const productData = req.body.product as IProduct;

    if(!productData) {
        const error = 'Product Data is empty';
        return res.status(BAD_REQUEST_CODE_400).send(error);
    }
    const { name, sku, quantity, price } = productData;
    if(!name || typeof name !== 'string' || !name.trim()) {
        errors.push('ProductName is invalid');
    }
    if(typeof sku !== 'string' || !sku.trim()) {
        errors.push('Sku is invalid');
    }
    if(typeof quantity !== 'number') {
        errors.push('Quantity is invalid');
    }
    if(typeof price !== 'number') {
        errors.push('Price is invalid');
    }

    if(errors.length) {
        return res.status(BAD_REQUEST_CODE_400).send(errors.join('\n'));
    }
    return next();
}

const validateUpdateProductInfo: MiddlewareNext = async(req, res, next ) => {
    const errors: string[]  = [];
    const productData = req.body.product as IProduct;

    if(!productData) {
        const error = 'Product Data is empty';
        return res.status(BAD_REQUEST_CODE_400).send(error);
    }
    const { name, sku, quantity, price } = productData;
    if(name && (typeof name !== 'string' || !name.trim())) {
        errors.push('ProductName is invalid');
    }
    if(sku && (typeof sku !== 'string' || !sku.trim())) {
        errors.push('Sku is invalid');
    }
    if(quantity && (typeof quantity !== 'number')) {
        errors.push('Quantity is invalid');
    }
    if(price && (typeof price !== 'number')) {
        errors.push('Price is invalid');
    }

    if(errors.length) {
        return res.status(BAD_REQUEST_CODE_400).send(errors.join('\n'));
    }
    return next();
}

const createProduct: Middleware = async (req, res) => {
    const productData = req.body.product;
    const { vendor } = productData;
    let  vendorFound: IVendor;
    try {
         vendorFound = await VendorModel.findById({_id: vendor });
    } catch(error) {
        return res.status(INTERNAL_SERVER_ERROR).send(error);
    }
    if(!vendorFound) {
        const error = 'Vendor not found';
        return res.status(NOT_FOUND_CODE_404).send(error);
    }
    productData._id  = mongoose.Types.ObjectId();
    const newProduct = new ProductModel(productData);
    let product: IProduct;
    try {
        product = await newProduct.save();
    } catch(error) {
        return res.status(INTERNAL_SERVER_ERROR).send(error);
    }
    return res.status(CREATED_REQUEST_CODE).json({ product });
}

export {
    getAllProduct,
    validateProductInfo,
    validateUpdateProductInfo,
    createProduct,
    getProductById,
    getProductByParams,
    updateProduct,
    deleteProduct,
    getProductWithVendor,
};
