const express = require('express');
const router = express.Router();
const db = require('../models');
const BrandService = require('../services/brandService');
const brandService = new BrandService(db);
const { isAuth, isAdmin } = require('../middleware/authenticate');
const createError = require('http-errors');

router.get('/', async (req, res, next) => {
    /*#swagger.tags = ['Brands']
    #swagger.description = 'Get all brands'
    #swagger.responses[200] = {
        description: 'Successfully fetched list of brands',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Brands found',
                brands: [
                    { $ref: '#/components/schemas/Brand' }
                ]
            }
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }*/
    try {
        const brands = await brandService.getAll();
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Brands found', brands: brands}});
    } catch (error) {
        next(error)
    }
});

router.post('/', isAuth, isAdmin, async (req, res, next) => {
    /*#swagger.tags = ['Brands']
    #swagger.description = 'Create new brand'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Brand name to create',
        schema: { name: 'Example name' }
    }
    #swagger.responses[201] = {
        description: 'Brand created successfully.',
        schema: {
            status: 'success',
            statuscode: 201,
            data: {
                result: 'Brand created',
                brand: { $ref: '#/components/schemas/Brand' }
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
        return next(createError(400, 'Name of brand is required'));
    }
    try {
        const brand = await brandService.create({name});
        res.status(201).json({
            status: 'success',
            statuscode: 201, 
            data: {result: 'Brand created', brand: brand}});
    } catch (error) {
        next(error)
    }
});

router.delete('/:id', isAuth, isAdmin, async (req, res, next) => {
    /*#swagger.tags = ['Brands']
    #swagger.description = 'Delete brand by id'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the brand to update',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.responses[200] = {
        description: 'Brand deleted successfully',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Brand deleted',
                brand: { $ref: '#/components/schemas/Brand' }
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
        description: 'Brand not found',
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
        const brand = await brandService.delete(id);
        if(!brand) {
            return next(createError(404, 'Brand not found'));
        }
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Brand deleted', deleted: brand}});
    } catch (error) {
        next(error)
    }
})

router.put('/:id', isAuth, isAdmin, async (req, res, next) => {
    /*#swagger.tags = ['Brands']
    #swagger.description = 'Update brand by id'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.parameters['id'] = {
        in: 'path',
        description: 'ID of the brand to update',
        required: true,
        type: 'integer',
        example: 1
    }
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Product fields to update',
        required: true,
        schema: { name: 'New name' }
    }
    #swagger.responses[200] = {
        description: 'Brand updated successfully',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Brand updated',
                product: { $ref: '#/components/schemas/Brand' }
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
        description: 'Brand not found',
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
        const brand = await brandService.update(id, {name});
        if(!brand) {
            return next(createError(404, 'Brand not found'));
        }
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Brand updated', brand: brand}});
    } catch (error) {
        next(error);
    }
})

module.exports = router;