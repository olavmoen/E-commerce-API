const express = require('express');
const router = express.Router();
const db = require('../models');
const RoleService = require('../services/roleService');
const roleService = new RoleService(db);
const { isAuth, isAdmin } = require('../middleware/authenticate');

router.get('/', isAuth, isAdmin, async (req, res, next) => {
    /*#swagger.tags = ['Roles']
    #swagger.description = 'Get all roles. Admins only'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Successfully fetched list of roles',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Roles found',
                roles: [
                    { $ref: '#/components/schemas/Role' }
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
        const roles  = await roleService.getAll();
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Roles found', roles: roles}});
    } catch (error) {
        next(error)
    }
});

module.exports = router;