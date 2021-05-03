import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;
const vendorSchema =  new  mongoose.Schema({
    _id: ObjectId,
    name: String,
    contact: String,
    city: String,
    country: String,
 },
 {
    collection: 'vendor',
});

const VendorModel = mongoose.model('vendor', vendorSchema);
export default VendorModel;
