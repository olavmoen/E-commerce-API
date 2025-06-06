const request = require('supertest')
const express = require('express')
const { errorHandler } = require('../middleware/errorHandler')
const app = express()
const db = require('../models')
require('dotenv').config()

const initRouter = require('../routes/init');
const usersRouter = require('../routes/users');
const authRouter = require('../routes/auth');
const categoriesRouter = require('../routes/categories');
const brandsRouter = require('../routes/brands');
const productsRouter = require('../routes/products');
const cartsRouter = require('../routes/carts');
const searchRouter = require('../routes/search');

app.use(express.json())

app.use('/init', initRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/categories', categoriesRouter);
app.use('/brands', brandsRouter);
app.use('/products', productsRouter);
app.use('/cart', cartsRouter);
app.use('/search', searchRouter);

app.use(errorHandler)

let userToken = null;
let adminToken = null;

beforeAll(async () => {
    await request(app).post('/init');
})

test('Log in as admin and accuire token', async () => {
    const adminCred = {
        username: 'Admin',
        password: 'P@ssword2023'
    }
    const response = await request(app)
        .post('/auth/login')
        .send(adminCred);

    adminToken = response.body.data.token;
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('status', 'success')
    expect(response.body.data).toHaveProperty('token')
});

test('Register user and accuire token', async () => {
    const userCred = {
        "firstname" : "John",
	    "lastname" : "Doe",
        "username" : "user123",
        "email" : "johndoe@email.com",
        "password" : "password",
        "address" : "123 Street, City",
        "phone" : "123456789"
    }

    const response = await request(app)
        .post('/auth/register')
        .send(userCred);

    userToken = response.body.data.token;

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('status', 'success')
    expect(response.body.data).toHaveProperty('token')
})

describe('Test category endpoint', () => {
    test('get all categories', async () => {
        const response = await request(app)
            .get('/categories')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.categories).toBeInstanceOf(Array)
        expect(response.body.data.categories.length).toBeGreaterThan(1);
        
    });
    test('add category', async () => {
        const response = await request(app)
            .post('/categories')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({name: "testCategory"})
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.result).toEqual('Category created');
        expect(response.body.data.category.name).toEqual('testCategory');
    })
    test('update category', async () => {
        const response = await request(app)
            .put('/categories/7')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({name: "testCategory2"});
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.result).toEqual('Category updated');
        expect(response.body.data.category.name).toEqual('testCategory2');
    })
    test('delete category', async () => {
        const response = await request(app)
            .delete('/categories/7')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.result).toEqual('Category deleted');
    })
})
describe('Test brand endpoint', () => {
    test('get all brands', async () => {
        const response = await request(app)
            .get('/brands')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.brands).toBeInstanceOf(Array)
        expect(response.body.data.brands.length).toBeGreaterThan(1);
        
    });
    test('add brand', async () => {
        const response = await request(app)
            .post('/brands')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({name: "testBrand"})
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.result).toEqual('Brand created');
        expect(response.body.data.brand.name).toEqual('testBrand');
    })
    test('update brand', async () => {
        const response = await request(app)
            .put('/brands/5')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({name: "testBrand2"});
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.result).toEqual('Brand updated');
        expect(response.body.data.brand.name).toEqual('testBrand2');
    })
    test('delete brand', async () => {
        const response = await request(app)
            .delete('/brands/5')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.result).toEqual('Brand deleted');
    })
})

describe('Test products endpoint', () => {
    test('get all products', async () => {
        const response = await request(app)
            .get('/products')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.products).toBeInstanceOf(Array)
        expect(response.body.data.products.length).toBeGreaterThan(1);
    });
    test('Add product', async () => {
        const data = {
            name: "testProduct",
            description: "A test product",
            unitprice: 100,
            imgurl: "kjhafkjsdhfshkf",
            quantity: 10,
            brand_id: 1,
            category_id: 1
        }
        const response = await request(app)
            .post('/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(data)

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.product.name).toEqual('testProduct');      
    })
    test('Update product', async () => {
        const response = await request(app)
            .put('/products/15')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({name: "testProduct2"});
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data');
        expect(response.body.data.product.name).toEqual('testProduct2');
    })
    test('delete product', async () => {
        const response = await request(app)
            .delete('/products/15')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.result).toEqual('Product deleted');
        expect(response.body.data.deleted.isDeleted).toEqual(true);
    })
});

describe('Test cart endpoint', () => {
    test('Add item to cart', async () => {
        const response = await request(app)
            .post('/cart/add')
            .set('Authorization', `Bearer ${userToken}`)
            .send({productId: 9, quantity: 31});

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.data.result).toEqual('Product added to cart');
    })
    test('Remove item from cart', async () => {
        const response = await request(app)
            .post('/cart/remove')
            .set('Authorization', `Bearer ${userToken}`)
            .send({productId: 9, quantity: 1});
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.data.result).toEqual('Product removed from cart');
        
    })
    test('Add item with too high quantity', async () => {
        const response = await request(app)
            .post('/cart/add')
            .set('Authorization', `Bearer ${userToken}`)
            .send({productId: 1, quantity: 20});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body.data.result).toEqual('Not enough of product in stock');
    })
    test('checkout', async () => {
        const response = await request(app)
            .post('/cart/checkout/now')
            .set('Authorization', `Bearer ${userToken}`)
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.data.result).toEqual('Checked out, order created');
    })
    test('Add item multiple times with too high quantity', async () => {
        await request(app)
            .post('/cart/add')
            .set('Authorization', `Bearer ${userToken}`)
            .send({productId: 1, quantity: 2});

        const response = await request(app)
            .post('/cart/add')
            .set('Authorization', `Bearer ${userToken}`)
            .send({productId: 1, quantity: 2});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body.data.result).toEqual('Could not add item to cart');
    })
    test('user has updated membership after checkout', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${adminToken}`);
 
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.data.result).toEqual('Users found');
        expect(response.body.data.users[2].membership).toEqual('Gold');
    })
})

describe('Test search endpoint', () => {
    test('search', async () => {
        const response = await request(app)
            .post('/search')
            .set('Authorization', `Bearer ${userToken}`)
            .send({keyword: "phone", brandId: 1, categoryId: 1});

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.data.result).toEqual('Products found');
        expect(response.body.data.products.length).toBe(2);
    })
    test('search for deleted product as user', async () => {
        const response = await request(app)
            .post('/search')
            .set('Authorization', `Bearer ${userToken}`)
            .send({keyword: "test"});

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.data.products.length).toBe(0);
    })
    test('search for all products of brand', async () => {
        const response = await request(app)
            .post('/search')
            .set('Authorization', `Bearer ${userToken}`)
            .send({brandId: 1});

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.data.products.length).toBeGreaterThan(1);
    })
});

describe('Assignment tests', () => {
    test('Add category', async () => {
        const response = await request(app)
            .post('/categories')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({name: "TEST_CATEGORY"});
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.result).toEqual('Category created');
        expect(response.body.data.category.name).toEqual('TEST_CATEGORY');
    });
    test('Add brand', async () => {
        const response = await request(app)
            .post('/brands')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({name: "TEST_BRAND"});
        
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.result).toEqual('Brand created');
        expect(response.body.data.brand.name).toEqual('TEST_BRAND');
    })
    test('Add product', async () => {
        const data = {
            name: "TEST_PRODUCT",
            description: "A test product",
            unitprice: 99.99,
            imgurl: "testImage",
            quantity: 10,
            brand_id: 6,
            category_id: 8
        }
        const response = await request(app)
            .post('/products')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(data)

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.product.name).toEqual('TEST_PRODUCT');
    });
    test('Get new product', async () => {
        const response = await request(app)
            .get('/products/16')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.result).toEqual('Product found');
        expect(response.body.data.product.name).toEqual('TEST_PRODUCT');
        expect(response.body.data.product.brand).toEqual('TEST_BRAND');
        expect(response.body.data.product.category).toEqual('TEST_CATEGORY');
    });
    test('Change category name', async () => {
        const response = await request(app)
            .put('/categories/8')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({name: "TEST_CATEGORY2"});
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.result).toEqual('Category updated');
        expect(response.body.data.category.name).toEqual('TEST_CATEGORY2');
    });
    test('Change brand name', async () => {
        const response = await request(app)
            .put('/brands/6')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({name: "TEST_BRAND2"});
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.result).toEqual('Brand updated');
        expect(response.body.data.brand.name).toEqual('TEST_BRAND2');
    });
    test('Get product with updated values', async () => {
        const response = await request(app)
            .get('/products/16')
            .set('Authorization', `Bearer ${adminToken}`);
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.result).toEqual('Product found');
        expect(response.body.data.product.name).toEqual('TEST_PRODUCT');
        expect(response.body.data.product.brand).toEqual('TEST_BRAND2');
        expect(response.body.data.product.category).toEqual('TEST_CATEGORY2');
    });
    test('Delete product', async () => {
        const response = await request(app)
            .delete('/products/16')
            .set('Authorization', `Bearer ${adminToken}`);

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('status', 'success')
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.result).toEqual('Product deleted');
        expect(response.body.data.deleted.isDeleted).toEqual(true);
    })
});

afterAll(async () => {
    await db.sequelize.close();
});