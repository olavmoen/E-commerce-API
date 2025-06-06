const express = require('express');
const router = express.Router();
const db = require('../models');
const OrderService = require('../services/orderService');
const orderService = new OrderService(db);
const { isAuth, isAdmin } = require('../middleware/authenticate');

router.get('/', isAuth, async (req, res, next) => {
    /*#swagger.tags = ['Orders']
    #swagger.description = 'Get all users orders'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Successfully fetched list of orders',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Orders found',
                orders: [
                    { $ref: '#/components/schemas/Order' }
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
        const orders = await orderService.getOrders(req.user.sub);
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Orders found', orders: orders}});
    } catch (error) {
        next(error)
    }
});

router.get('/admin', isAuth, isAdmin, async (req, res, next) => {
    /*#swagger.tags = ['Orders']
    #swagger.description = 'Get all orders. Admins only'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Successfully fetched list of orders',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Orders found',
                orders: [
                    { $ref: '#/components/schemas/Order' }
                ]
            }
        }
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
    try {
        const orders = await orderService.getAll();
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Orders found', orders: orders}});
    } catch (error) {
        next(error)
    }
});

router.put('/:id', isAuth, isAdmin, async (req, res, next) => {
    /*#swagger.tags = ['Orders']
    #swagger.description = 'Update status order by id'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the order to update',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Status of order to update',
        required: true,
        schema: { status: 'New status' }
    }
    #swagger.responses[200] = {
        description: 'Order updated successfully',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Status updated',
                product: { $ref: '#/components/schemas/Order' }
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
        description: 'Order not found',
        schema: { $ref: '#components/schemas/ResourceNotFound' }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }*/
    const orderId = req.params.id;
    const { status } = req.body;
    if(!orderId) {
            return next(createError(400, 'Id parameter is required'));
        }
    if(!status) {
        return next(createError(400, 'Status cannot be empty'));
    }
    try {
        const order = await orderService.updateStatus(orderId, status);
        if(!order) {
            return next(createError(404, 'Unable to update order status'));
        }
        res.status(201).json({
            status: 'success',
            statuscode: 201, 
            data: {result: 'Status updated', order: order}});
    } catch (error) {
        next(error)
    }
});

module.exports = router;

