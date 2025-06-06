const express = require('express');
const router = express.Router();
const db = require('../models');
const MembershipService = require('../services/membershipService');
const membershipService = new MembershipService(db);
const { isAuth, isAdmin } = require('../middleware/authenticate');

router.get('/', isAuth, isAdmin, async (req, res, next) => {
    /*#swagger.tags = ['Memberships']
    #swagger.description = 'Get all memberships'
    #swagger.responses[200] = {
        description: 'Successfully fetched list of memberships',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Memberships found',
                brands: [
                    { $ref: '#/components/schemas/Membership' }
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
        const memberships  = await membershipService.getAll();
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Memberships found', memberships: memberships}});
    } catch (error) {
        next(error)
    }
});

module.exports = router;