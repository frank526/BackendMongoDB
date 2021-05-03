import mongoose from 'mongoose';
import awaitToJs from 'await-to-js';
import config from './config';
const { DB_HOST, DB_PORT, DB_NAME } = config;

const connectDB = async() => {
    const dbUrl = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`;
    const conOptions = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
    const [conError] = await awaitToJs(mongoose.connect(dbUrl, conOptions ));
    if(conError) {
        console.log('Connection DB Error ', conError);
        throw conError;
    }
    console.log('Connection Success');
}
export default connectDB;
