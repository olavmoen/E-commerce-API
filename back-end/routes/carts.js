const express = require('express');
const router = express.Router();
const db = require('../models');
const ProductService = require('../services/productService');
const productService = new ProductService(db);
const CartService = require('../services/cartService');
const cartService = new CartService(db);
const UserService = require('../services/userService');
const userService = new UserService(db);
const OrderService = require('../services/orderService');
const orderService = new OrderService(db);
const MembershipService = require('../services/membershipService');
const membershipService = new MembershipService(db);
const { isAuth, isAdmin } = require('../middleware/authenticate');
const createError = require('http-errors');

router.post('/add', isAuth, async (req, res, next) => {
    /*#swagger.tags = ['Cart']
    #swagger.description = 'Add product to cart. Must be registered user'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Id and amount of product to add',
        required: true,
        schema: {
            productId: 1,
            amount: 5
        }
    }
    #swagger.responses[201] = {
        description: 'Product successfully added to cart',
        schema: {
            status: 'success',
            statuscode: 201,
            data: { result: 'Product added to cart' }
        }
    }
    #swagger.responses[400] = {
        description: 'Not enough stock of product',
        schema: {
            status: 'error',
            statuscode: 400,
            data: { result: 'Not enough of product in stock' }
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
        const { productId, quantity } = req.body;
        if(!productId || !quantity) {
            return next(createError(400, 'productId and quantity is required'));
        }
        const product = await productService.getProduct(productId);
        if(!product) {
            return next(createError(404, 'Product not found'));
        }

        if(product.quantity < quantity) {
            return next(createError(400, 'Not enough of product in stock'));
        }
        const cartProduct = await cartService.addProduct(req.user.sub, product, quantity);
        if(!cartProduct) {
            return next(createError(400, 'Could not add item to cart'));
        }

        res.status(201).json({
            status: 'success',
            statuscode: 201,
            data: {result: 'Product added to cart'}
        })
    } catch (error) {
        next(error)
    }
});

router.post('/remove', isAuth, async (req, res, next) => {
    /*#swagger.tags = ['Cart']
    #swagger.description = 'Remove product from cart. Must be registered user'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Id and amount of product to remove',
        required: true,
        schema: {
            productId: 1,
            amount: 5
        }
    }
    #swagger.responses[200] = {
        description: 'Product successfully removed from cart',
        schema: {
            status: 'success',
            statuscode: 201,
            data: { result: 'Product removed from cart' }
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
    #swagger.responses[404] = {
        description: 'Product not found',
        schema: { $ref: '#components/schemas/ResourceNotFound' }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }*/
    try {
        const { productId, quantity } = req.body;
        if(!productId || !quantity) {
            return next(createError(400, 'productId and quantity is required'));
        }
        const product = await productService.getProduct(productId);
        if(!product) {
            return next(createError(404, 'Product not found'));
        }
        
        const cartProduct = await cartService.removeProduct(req.user.sub, productId, quantity);
        if(!cartProduct) {
            return next(createError(404), 'Could not find product in cart');
        }

        res.status(200).json({
            status: 'success',
            statuscode: 200,
            data: {result: 'Product removed from cart'}
        })
    } catch (error) {
        next(error)
    }
})

router.post('/checkout/now', isAuth, async (req, res, next) => {
    /*#swagger.tags = ['Cart']
    #swagger.description = 'Checkout cart and create order. Must be registered user'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Succesfully checked out',
        schema: {
            status: 'success',
            statuscode: 200,
            data: { result: 'Checked out, order created' }
        }
    }
    #swagger.responses[400] = {
        description: 'Not enough stock of products in cart',
        schema: {
            status: 'error',
            statuscode: 400,
            data: { result: `Not enough in stock of [product-name]` }
        }
    }
    #swagger.responses[401] = {
        description: 'User provided invalid token',
        schema: { $ref: '#components/schemas/FailedAuthentication' }
    }
    #swagger.responses[404] = {
        description: 'No products in cart',
        schema: { $ref: '#components/schemas/ResourceNotFound' }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }*/
    try {
        //Find users cart
        const cart = await cartService.getCart(req.user.sub);
        if(!cart) {
            return next(createError(404, 'No products in cart'));
        }
        const cartProducts = await cartService.getCartProducts(cart.id);
        const user = await userService.getById(req.user.sub);

        //Check stock of all products in cart
        for (const cartProduct of cartProducts) {
            const product = await productService.getProduct(cartProduct.product_id);
            if(cartProduct.quantity > product.quantity) {
                return next(createError(400, `Not enough in stock of ${product.name}`))
            }
        }
        
        //Add order and orderProducts
        const membership = await membershipService.getMembership(user.membership_id);
        const order = await orderService.create(user.id, membership.id, membership.discount);

        //Update product quantity
        for (const cartProduct of cartProducts) {
            const product = await productService.getProduct(cartProduct.product_id);
            await productService.update(product.id, {quantity: product.quantity - cartProduct.quantity});
            await orderService.addOrderProduct(order.id, product.id, cartProduct.quantity);
        }

        //Delete cart and products in cart
        await cartService.deleteCart(cart.id);

        //Calculate user membership
        const productCount = await orderService.getProductCount(user.id);
        const newMembership = await membershipService.getEarnedMembership(productCount);
   
        await userService.updateMembership(user.id, newMembership);

        res.status(200).json({
            status: 'success',
            statuscode: 200,
            data: {result: 'Checked out, order created'}
        })

    } catch (error) {
        next(error)
    }
})

module.exports = router;