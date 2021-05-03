import supertest from 'supertest';
import awaitToJs from 'await-to-js';
import app from '../src/app';
import { VendorModel } from '../src/models';
import connectDB from '../src/connectDB';
import { vendorData } from './data';
import assert from 'assert';

describe('Test API', ()=>{
  before(async() => {
    await connectDB();
  });

  afterEach(async() => {
    await VendorModel.deleteMany({});
  });
    it('Create Vendor', async() => {
      const [error, resp] = await awaitToJs(supertest(app)
        .post('/api/vendor')
        .send({ vendor: vendorData })
        .expect(201));
        assert.deepEqual(error, null);
        assert.notDeepEqual(resp, null);
        assert.notDeepEqual(resp.body, null);
        const vendor = resp.body.vendor as IVendor;
        assert.deepEqual(vendor.city , vendorData.city);
        assert.deepEqual(vendor.contact, vendorData.contact);
        assert.deepEqual(vendor.country, vendorData.country);
        assert.deepEqual(vendor.name, vendorData.name);
    });

    it('Create Vendor, with invalid data', async() => {
      const errors = [
        'Vendor name is invalid',
        'City is invalid',
        'Contact is invalid',
        'Country is invalid',
      ];
      const vendorInvalidData = {
        "name" : "", 
        "contact" : 12333, 
        "city" : undefined, 
        "country" : null,
      };

      const [error, resp] = await awaitToJs(supertest(app)
        .post('/api/vendor')
        .send({ vendor: vendorInvalidData })
        .expect(400));

        assert.deepEqual(error, null);
        assert.deepEqual(resp.text , errors.join('\n'));
    });

    it('Get All Vendor', async() => {
      await awaitToJs(supertest(app)
        .post('/api/vendor')
        .send({ vendor: vendorData })
        .expect(201));

       const vendorData2 = {
        "name" : "Nike", 
        "contact" : "Adam", 
        "city" : "Washington", 
        "country" : "USA",
       } 

      await awaitToJs(supertest(app)
        .post('/api/vendor')
        .send({ vendor: vendorData2 })
        .expect(201));

      
        
      const [error, resp] = await awaitToJs(supertest(app)
        .get('/api/vendors')
        .expect(200));

        assert.deepEqual(error, null);
        assert.notDeepEqual(resp, null);
        assert.notDeepEqual(resp.body, null);

        const count = resp.body.count;
        const vendors = resp.body.vendors as IVendor[];

        assert.deepEqual(vendors.length, count);
        assert.deepEqual(vendors[0].city , vendorData.city);
        assert.deepEqual(vendors[0].contact, vendorData.contact);
        assert.deepEqual(vendors[0].country, vendorData.country);
        assert.deepEqual(vendors[0].name, vendorData.name);
        assert.deepEqual(vendors[1].city , vendorData2.city);
        assert.deepEqual(vendors[1].contact, vendorData2.contact);
        assert.deepEqual(vendors[1].country, vendorData2.country);
        assert.deepEqual(vendors[1].name, vendorData2.name);
    });

    it('Get Vendor By ID', async() => {
      const [error1, resp1] =  await awaitToJs(supertest(app)
        .post('/api/vendor')
        .send({ vendor: vendorData })
        .expect(201));

       const vendorData2 = {
        "name" : "Nike", 
        "contact" : "Adam", 
        "city" : "Washington", 
        "country" : "USA",
       };
       
       assert.deepEqual(error1, null);
       const vendor1Id =  resp1.body.vendor._id;
       
       const [error2, resp2] = await awaitToJs(supertest(app)
        .post('/api/vendor')
        .send({ vendor: vendorData2 })
        .expect(201));
        
        assert.deepEqual(error2, null);
        const vendor2Id =  resp2.body.vendor._id;
  
      const [error, resp] = await awaitToJs(supertest(app)
        .get('/api/vendor')
        .query({id: vendor1Id })
        .expect(200));

        assert.deepEqual(error, null);
        assert.notDeepEqual(resp, null);
        assert.notDeepEqual(resp.body, null);

        const vendor = resp.body.vendor as IVendor;
        assert.deepEqual(vendor._id, vendor1Id);
        assert.deepEqual(vendor.contact, vendorData.contact);
        assert.deepEqual(vendor.country, vendorData.country);
        assert.deepEqual(vendor.name, vendorData.name);

      const [error3, resp3] = await awaitToJs(supertest(app)
        .get('/api/vendor')
        .query({id: vendor2Id })
        .expect(200));

        assert.deepEqual(error3, null);
        assert.notDeepEqual(resp3, null);
        assert.notDeepEqual(resp3.body, null);

        const vendor2 = resp3.body.vendor as IVendor;
        assert.deepEqual(vendor2._id, vendor2Id);
        assert.deepEqual(vendor2.contact, vendorData2.contact);
        assert.deepEqual(vendor2.country, vendorData2.country);
        assert.deepEqual(vendor2.name, vendorData2.name);
    });

    it('Get Vendor By ID, vendor not found ', async() => {
      const [error, resp] = await awaitToJs(supertest(app)
        .get('/api/vendor')
        .query({id: '608dc9be38e01e494fc2656c'})
        .expect(404));

        assert.deepEqual(error, null);
        assert.deepEqual(resp.text , 'Vendor not found');
    });
});


