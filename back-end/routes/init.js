const express = require('express');
const router = express.Router();
const db = require('../models');
const { initDb } = require('../util/initDb');

router.post('/', async (req, res, next) => {
    /*#swagger.tags = ['Initialization']
    #swagger.description = 'Initializes database and seed data'
    #swagger.responses[200] = {
        description: 'Successfully initialized database',
        schema: {
            status: 'success',
            statuscode: 200,
            data: { result: 'Database successfully initialized' }
        }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }*/
    const url = "http://backend.restapi.co.za/items/products";
    try {
        const response = await fetch(url);
        const products = await response.json();
        await initDb(db, products);

        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Database successfully initialized'}});
        } catch (error) {
            next(error);
        }
});

module.exports = router;