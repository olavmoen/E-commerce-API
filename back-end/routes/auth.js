const express = require('express');
const router = express.Router();
const db = require('../models');
const jwt = require('jsonwebtoken');
const UserService = require('../services/userService');
const userService = new UserService(db);
const { hashPassword, comparePassword } = require('../util/passwordHelper');
const createError = require('http-errors');
const { isAuth, isAdmin } = require('../middleware/authenticate');
require('dotenv').config()


router.post('/register', async (req, res, next) => {
    /*#swagger.tags = ['Authentication']
    #swagger.description = 'Create new user'
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'User data',
        schema: {
            firstname: 'Example firstname',
            lastname: 'Example lastname',
            username: 'Example username',
            email: 'example@gmail.com',
            password: 'examplePassword',
            address: 'Example address',
            phone: '12345678'
        }
    }
    #swagger.responses[201] = {
        description: 'User created successfully.',
        schema: {
            status: 'success',
            statuscode: 201,
            data: {
                result: 'New user registered',
                token: 'Exmaple token'
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Bad request — missing required fields.',
        schema: { $ref: '#components/schemas/MissingParameters' }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }*/
    const { firstname, lastname, username, email, password, address, phone } = req.body;

    if(!firstname || !lastname || !username || !email || !password || !address || !phone) {
        return next(createError(400, 'All user info is required to register'));
    }

    try {
        const { salt, encryptedPassword } = await hashPassword(password);

        const userData = {
            firstname,
            lastname,
            username,
            email,
            encryptedPassword,
            salt,
            address,
            phone
        }

        const user = await userService.create(userData);

        const token = jwt.sign({ sub: user.id }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '2h'})

        res.status(201).json({
            status: 'success',
            statuscode: 201, 
            data: {result: 'New user registered', token: token}
        })

    } catch (error) {
        return next(error)
    }
})

router.post('/login', async (req, res, next) => {
    /*#swagger.tags = ['Authentication']
    #swagger.description = 'Login user'
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        description: 'Username/email and password',
        schema: {
            username: 'Example username',
            email: 'example@gmail.com',
            password: 'examplePassword',
        }
    }
    #swagger.responses[200] = {
        description: 'Login successful',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Successfully logged in',
                token: 'Exmaple token'
            }
        }
    }
    #swagger.responses[400] = {
        description: 'Bad request — missing required fields.',
        schema: { $ref: '#components/schemas/MissingParameters' }
    }
    #swagger.responses[401] = {
        description: 'Provided invalid credentials',
        schema: { $ref: '#components/schemas/FailedAuthentication' }
    }
    #swagger.responses[404] = {
        description: 'User not found',
        schema: { $ref: '#components/schemas/ResourceNotFound' }
    }
    #swagger.responses[500] = {
        description: 'Internal server error.',
        schema: { $ref: '#components/schemas/ServerError' }
    }
    */
    const { username, email, password } = req.body;

    if((!username && !email) || !password) {
        return next(createError(400, 'Email/username and password is required'))
    }

    try {
        const user = await userService.getByUsernameOrEmail(username, email);

        if(!user) {
            return next(createError(404, 'User not found'))
        }

        if(!await comparePassword(password, user.encryptedPassword, user.salt)) {
			return next(createError(401, 'Invalid credentials'))
		}

        const token = jwt.sign(
            {
                sub: user.id,
                role: user.role_id
            },
            process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1h'})
        
        res.status(200).json({
            status: 'success',
            statuscode: 200, 
            data: {result: 'Successfully logged in', token: token}
        });

    } catch (error) {
        return next(error)
    }
});

router.get('/admin/access', isAuth, isAdmin, (req, res, next) => {
    /*#swagger.tags = ['Authentication']
    #swagger.description = 'Authenticate request from admin frontend'
    #swagger.security = [{
        "bearerAuth": []
    }]
    #swagger.responses[200] = {
        description: 'Successfully authenticated admin',
        schema: {
            status: 'success',
            statuscode: 200,
            data: {
                result: 'Admin access granted',
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
    res.status(200).json({
        status: 'success',
        statuscode: 200, 
        data: {result: 'Admin access granted' }
  });
})

module.exports = router;