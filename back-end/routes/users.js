const express = require('express');
const router = express.Router();
const db = require('../models');
const UserService = require('../services/userService');
const userService = new UserService(db);
const { isAuth, isAdmin } = require('../middleware/authenticate');

router.get('/', isAuth, isAdmin, async (req, res, next) => {
    /*#swagger.tags = ['Users']
    #swagger.description = 'Get all products. Admins only'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Successfully fetched list of users',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Users found',
                users: [
                    { $ref: '#/components/schemas/User' }
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
        const users = await userService.getAll();
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Users found', users: users}});
    } catch (error) {
        next(error)
    }
});

router.put('/:id', isAuth, isAdmin, async (req, res, next) => {
    /*#swagger.tags = ['Users']
    #swagger.description = 'Update user by id. Admins only'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the user to update',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'User fields to update',
        required: true,
        schema: {
            username: 'Updated username',
            firstname: 'Updated firstname',
            lastname: 'Updated lastname',
            email: 'Updated email',
            address: 'Updated address',
            phone: 'Updated phone',
            role_id: 'Updated role_id'
        }
    }
    #swagger.responses[200] = {
        description: 'User updated successfully',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'User updated',
                user: { $ref: '#/components/schemas/User' }
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
        description: 'User not found',
        schema: { $ref: '#components/schemas/ResourceNotFound' }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }*/
    const id = req.params.id;
    const payload = req.body;
    if(!id) {
            return next(createError(400, 'Id parameter is required'));
    }
    try {
        const user = await userService.update(id, payload);
        if(!user) {
            return next(createError(404, 'User not found'));
        }
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'User updated', user: user}});
    } catch (error) {
        next(error);
    }
})

module.exports = router;
