import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;
const productSchema =  new  mongoose.Schema({
    _id: ObjectId,
    name: String,
    sku: String,
    quantity: Number,
    price: String,
    vendor: { type: ObjectId, ref: "vendor" } 
 },
 {
    collection: 'product',
});

const ProductModel = mongoose.model('product', productSchema);
export default ProductModel;
