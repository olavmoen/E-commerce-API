const jwt = require('jsonwebtoken');
const db = require('../models');
const UserService = require('../services/userService');
const userService = new UserService(db);
const createError = require('http-errors');

// Middleware function to determine request comes from registerd user
function isAuth(req, res, next) {
	const authHeader = req.headers['authorization']
	let token;
	if(authHeader) {
		token = authHeader.split(' ')[1]
	}

	if(!token) {
		return res.status(401).jsend.fail('No token attached')
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if(err) {
			if(err.name === 'TokenExpiredError') {
				return res.status(401).jsend.fail('Token has expired')
			}
			if(err.name === 'JsonWebTokenError' && err.message === 'invalid signature') {
				return res.status(401).jsend.fail('Invalid signature')
			}
			if (err.name === 'JsonWebTokenError' && err.message === 'jwt malformed') {
                return res.status(401).jsend.fail('Malformed token')
            }
			return res.status(401).jsend.fail('Invalid token');
		}
		req.user = decoded;
        next()
	})
}
// Same as isAuth, but will allow guest users without token through
async function checkTokenIfExists(req, res, next) {
	const authHeader = req.headers['authorization']
	let token;
	if(authHeader) {
		token = authHeader.split(' ')[1]
	}

	if(!token) {
		return next();
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
		if(err) {
			if(err.name === 'TokenExpiredError') {
				return res.status(401).jsend.fail('Token has expired')
			}
			if(err.name === 'JsonWebTokenError' && err.message === 'invalid signature') {
				return res.status(401).jsend.fail('Invalid signature')
			}
			if (err.name === 'JsonWebTokenError' && err.message === 'jwt malformed') {
                return res.status(401).jsend.fail('Malformed token')
            }
			return res.status(401).jsend.fail('Invalid token');
		}
		req.user = decoded;
        next()
	})
}
//Determine if the user has role of admin
async function isAdmin(req, res, next) {
	const role = await userService.getUserRole(req.user.sub);
	if(role !== 'Admin') {
		return next(createError(403, 'Must be admin to access'));
	}
	next();
}

module.exports = { isAuth, isAdmin, checkTokenIfExists };