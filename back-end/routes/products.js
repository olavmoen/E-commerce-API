const express = require('express');
const router = express.Router();
const db = require('../models');
const ProductService = require('../services/productService');
const productService = new ProductService(db);
const UserService = require('../services/userService');
const userService = new UserService(db);
const { isAuth, isAdmin, checkTokenIfExists } = require('../middleware/authenticate');
const createError = require('http-errors');

router.get('/', checkTokenIfExists, async (req, res, next) => {
    /*#swagger.tags = ['Products']
    #swagger.description = 'Get all products. Admins receive all products, while other users or guests get only available products.'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Successfully fetched list of products (Only non-deleted products if not admin)',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Products found',
                products: [
                    { $ref: '#/components/schemas/Product' }
                ]
            }
        }
    }
    #swagger.responses[401] = {
        description: 'User provided invalid token',
        schema: { $ref: '#components/schemas/FailedAuthentication' }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }*/
    try {
        let products = null;
        if(req.user) { // If request comes from admin
            const role = await userService.getUserRole(req.user.sub);
            if(role === 'Admin') {
                products = await productService.getAll();
            }
        } else { // If user or guest user
            products = await productService.getAllNotDeleted();
        }
        
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Products found', products: products}});
    } catch (error) {
        next(error)
    }
});

router.get('/:id', checkTokenIfExists, async (req, res, next) => {
    /*#swagger.tags = ['Products']
    #swagger.description = 'Get all product by id'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Successfully fetched product',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Product found',
                product: { $ref: '#/components/schemas/Product' }
            }
        }
    }
    #swagger.responses[401] = {
        description: 'User provided invalid token',
        schema: { $ref: '#components/schemas/FailedAuthentication' }
    }
    #swagger.responses[404] = {
        description: 'Product not found',
        schema: { $ref: '#components/schemas/ResourceNotFound' }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }
    */
    try {
        const product = await productService.getProduct(req.params.id);
        if(!product) {
            return next(createError(404, 'Product not found'));
        }
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Product found', product: product}});

    } catch (error) {
        next(error)
    }
});

router.post('/', isAuth, isAdmin, async (req, res, next) => {
    /*#swagger.tags = ['Products']
    #swagger.description = 'Create a new product. Admins only.'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Product data to create',
        schema: {
            name: 'Example product',
            description: 'Product description',
            unitprice: 499,
            imgurl: 'http://images.test.png',
            quantity: 50,
            brand_id: 1,
            category_id: 1
        }
    }
    #swagger.responses[201] = {
        description: 'Product created successfully.',
        schema: {
            status: 'success',
            statuscode: 201,
            data: {
                result: 'Product created',
                product: { $ref: '#/components/schemas/Product' }
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Bad request — missing required fields.',
        schema: { $ref: '#components/schemas/MissingParameters' }
    }
    #swagger.responses[401] = {
        description: 'User provided invalid token',
        schema: { $ref: '#components/schemas/FailedAuthentication' }
    }
    #swagger.responses[403] = {
        description: 'User is not admin',
        schema: { $ref: '#components/schemas/NotAdmin' }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }*/
    const { name, description, unitprice, imgurl, quantity, brand_id, category_id } = req.body;

    if(!name || !description || !unitprice || !imgurl || !quantity || !brand_id || !category_id) {
        return next(createError(400, 'All product info is required'));
    }
    const productData = {
        name,
        description,
        unitprice,
        imgurl,
        quantity,
        brand_id,
        category_id
    }

    try {
        const product = await productService.create(productData);
        res.status(201).json({
            status: 'success',
            statuscode: 201, 
            data: {result: 'Product created', product: product}});
    } catch (error) {
        next(error)
    }
})

router.put('/:id', isAuth, isAdmin, async (req, res, next) => {
    /*#swagger.tags = ['Products']
    #swagger.description = 'Update a product by ID. Admins only'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the product to update',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Product fields to update',
        required: true,
        schema: {
            name: 'Updated product name',
            description: 'Updated description',
            unitprice: 999,
            imgurl: 'http://new.image.url.png',
            quantity: 100,
            brand: 'Updated brand',
            category: 'Updated category'
        }
    }
    #swagger.responses[200] = {
        description: 'Product updated successfully',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Product updated',
                product: { $ref: '#/components/schemas/Product' }
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Bad request — missing required fields.',
        schema: { $ref: '#components/schemas/MissingParameters' }
    }
    #swagger.responses[401] = {
            description: 'User provided invalid token',
            schema: { $ref: '#components/schemas/FailedAuthentication' }
    }
    #swagger.responses[403] = {
        description: 'User is not admin',
        schema: { $ref: '#components/schemas/NotAdmin' }
    }
    #swagger.responses[404] = {
        description: 'Product not found',
        schema: { $ref: '#components/schemas/ResourceNotFound' }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }*/
    const id = req.params.id;
    const data = req.body;
    
    if(!id) {
            return next(createError(400, 'Id parameter is required'));
    }
    try {
        const product = await productService.update(id, data);
        if(!product) {
            return next(createError(404, 'Product not found'));
        }
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Product updated', product: product}});
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', isAuth, isAdmin, async (req, res, next) => {
    /*#swagger.tags = ['Products']
    #swagger.description = 'Delete a product by ID. Admins only'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the product to update',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Product deleted successfully',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Product deleted',
                product: { $ref: '#/components/schemas/Product' }
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Bad request — missing required fields.',
        schema: { $ref: '#components/schemas/MissingParameters' }
    }
    #swagger.responses[401] = {
            description: 'User provided invalid token',
            schema: { $ref: '#components/schemas/FailedAuthentication' }
    }
    #swagger.responses[403] = {
        description: 'User is not admin',
        schema: { $ref: '#components/schemas/NotAdmin' }
    }
    #swagger.responses[404] = {
        description: 'Product not found',
        schema: { $ref: '#components/schemas/ResourceNotFound' }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }
    */
    const id = req.params.id;
    
    if(!id) {
        return next(createError(400, 'Id parameter is required'));
    }
    try {
        const product = await productService.delete(id);
        if(!product) {
            return next(createError(404, 'Product not found'));
        }
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Product deleted', deleted: product}});
    } catch (error) {
        next(error)
    }
})

module.exports = router;