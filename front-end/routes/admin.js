var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

router.get('/products', function(req, res, next) {
    res.render('products', { title: 'Products' });
});

router.get('/brands', function(req, res, next) {
    res.render('brands', { title: 'Brands' });
});

router.get('/categories', function(req, res, next) {
    res.render('categories', { title: 'Categories' });
});

router.get('/roles', function(req, res, next) {
    res.render('roles', { title: 'Roles' });
});

router.get('/users', function(req, res, next) {
    res.render('users', { title: 'Users' });
});

router.get('/orders', function(req, res, next) {
    res.render('orders', { title: 'Orders' });
});

router.get('/memberships', function(req, res, next) {
    res.render('memberships', { title: 'Memberships' });
});

module.exports = router;