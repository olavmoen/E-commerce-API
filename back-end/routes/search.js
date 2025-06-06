const express = require('express');
const router = express.Router();
const db = require('../models');
const ProductService = require('../services/productService');
const productService = new ProductService(db);
const UserService = require('../services/userService');
const userService = new UserService(db);
const { checkTokenIfExists } = require('../middleware/authenticate');

router.post('/', checkTokenIfExists, async (req, res, next) => {
    /*#swagger.tags = ['Search']
    #swagger.description = 'Get list of products based on search parameters. All products if no arguments given'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['body'] = {
        in: 'body',
        required: false,
        description: 'Optional values to search and filter: Name of product, brand id and category id',
        schema: { 
            keyword: 'Example name',
            brandId: 1,
            categoryId: 1
        }
    }
    #swagger.responses[200] = {
        description: 'Successfully fetched list of products.',
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
    const { keyword, brandId, categoryId } = req.body;
    
    try {
        const role = await userService.getUserRole(req.user.sub);
        const products = await productService.search(keyword, brandId, categoryId, role);
        
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Products found', products: products}});

    } catch (error) {
        next(error)
    }
});

module.exports = router;