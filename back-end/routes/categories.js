const express = require('express');
const router = express.Router();
const db = require('../models');
const CategoryService = require('../services/categoryService');
const categoryService = new CategoryService(db);
const { isAuth, isAdmin } = require('../middleware/authenticate');
const createError = require('http-errors');

router.get('/', async (req, res, next) => {
    /*#swagger.tags = ['Categories']
    #swagger.description = 'Get all categories'
    #swagger.responses[200] = {
        description: 'Successfully fetched list of categories',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Categories found',
                categories: [
                    { $ref: '#/components/schemas/Category' }
                ]
            }
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }*/
    try {
        const categories = await categoryService.getAll();
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Categories found', categories: categories}});
    } catch (error) {
        next(error)
    }
});

router.post('/', isAuth, isAdmin, async (req, res, next) => {
    /*#swagger.tags = ['Categories']
    #swagger.description = 'Create new category'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Name of category to create',
        schema: { name: 'Example name' }
    }
    #swagger.responses[201] = {
        description: 'Category created successfully.',
        schema: {
            status: 'success',
            statuscode: 201,
            data: {
                result: 'Category created',
                brand: { $ref: '#/components/schemas/Category' }
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
    const {name} = req.body;
    if(!name) {
        return next(createError(400, 'Name of category is required'));
    }
    try {
        const category = await categoryService.create({name});
        res.status(201).json({
            status: 'success',
            statuscode: 201, 
            data: {result: 'Category created', category: category}});
    } catch (error) {
        next(error)
    }
});

router.delete('/:id', isAuth, isAdmin, async (req, res, next) => {
    /*#swagger.tags = ['Categories']
    #swagger.description = 'Delete category by id'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the category to update',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Category deleted successfully',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Category deleted',
                brand: { $ref: '#/components/schemas/Category' }
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
        description: 'Category not found',
        schema: { $ref: '#components/schemas/ResourceNotFound' }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }*/
    const id = req.params.id;
    
    if(!id) {
        return next(createError(400, 'Id parameter is required'));
    }
    try {
        const category = await categoryService.delete(id);
        if(!category) {
            return next(createError(404, 'Category not found'));
        }
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Category deleted', deleted: category}});
    } catch (error) {
        next(error)
    }
})

router.put('/:id', isAuth, isAdmin, async (req, res, next) => {
    /*#swagger.tags = ['Categories']
    #swagger.description = 'Update category by id'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the category to update',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Category fields to update',
        required: true,
        schema: { name: 'New name' }
    }
    #swagger.responses[200] = {
        description: 'Category updated successfully',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Category updated',
                product: { $ref: '#/components/schemas/Category' }
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
        description: 'Category not found',
        schema: { $ref: '#components/schemas/ResourceNotFound' }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }
    */
    const id = req.params.id;
    const {name} = req.body
    if(!id) {
        return next(createError(400, 'Id parameter is required'));
    }
    if(!name) {
            return next(createError(400, 'Name cannot be empty'));
    }
    try {
        const category = await categoryService.update(id, {name});
        if(!category) {
            return next(createError(404, 'Category not found'));
        }
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Category updated', category: category}});
    } catch (error) {
        next(error);
    }
})

module.exports = router;