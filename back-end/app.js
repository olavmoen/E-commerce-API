var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
const {errorHandler} = require('./middleware/errorHandler');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

const initRouter = require('./routes/init');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const categoriesRouter = require('./routes/categories');
const brandsRouter = require('./routes/brands');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const searchRouter = require('./routes/search');
const rolesRouter = require('./routes/roles');
const orderRouter = require('./routes/orders');
const membershipRouter = require('./routes/memberships');
const db = require('./models');

db.sequelize.sync({ force: true });

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/init', initRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/categories', categoriesRouter);
app.use('/brands', brandsRouter);
app.use('/products', productsRouter);
app.use('/cart', cartsRouter);
app.use('/search', searchRouter);
app.use('/roles', rolesRouter);
app.use('/orders', orderRouter);
app.use('/memberships', membershipRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) { 
    next(createError(404));
});

app.use(errorHandler);

module.exports = app;
