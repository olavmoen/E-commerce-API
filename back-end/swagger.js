const swaggerAutogen = require('swagger-autogen')()
const doc = {
    info: {
        version: "1.0.0",
        title: "E-commerce API",
        description: `An API for users to register/login and view different products.
                    Registered users can add products to their cart and checkout to create 
                    their order. Registered users with admin role can add, edit and delete the products.`
    },
    host: "localhost:3000",
    basePath: '/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    components: {
        schemas: {
            Product: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Example name' },
                    description: { type: 'string', example: 'Example description' },
                    unitprice: { type: 'integer', example: 649 },
                    imgurl: { type: 'string', example: 'http://images.test.png' },
                    quantity: { type: 'integer', example: 10 },
                    isDeleted: { type: 'boolean', example: false },
                    brand_id: { type: 'integer', example: 1 },
                    category_id: { type: 'integer', example: 1 },
                    brand: { type: 'string', example: 'Example brand' },
                    category: { type: 'string', example: 'Example category' },
                    createdAt: { type: 'string', format: 'date-time', example: '2025-06-02T09:25:53Z' },
                    updatedAt: { type: 'string', format: 'date-time', example: '2025-06-02T09:25:53Z' }
                }
            },
            Brand: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Example name' },
                }
            },
            Category: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Example name' },
                }
            },
            Membership: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Example name' },
                    minValue: { type: 'integer', example: 0 },
                    maxValue: { type: 'integer', example: 14 },
                }
            },
            Order: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    ordernumber: { type: 'string', example: 'djeivwhf4' },
                    status: { type: 'string', example: 'In progress' },
                    discount: { type: 'integer', example: 0 },
                    user_id: { type: 'integer', example: 1 },
                    membership_id: { type: 'integer', example: 1 },
                    createdAt: { type: 'string', format: 'date-time', example: '2025-06-02T09:25:53Z' },
                    updatedAt: { type: 'string', format: 'date-time', example: '2025-06-02T09:25:53Z' }
                }
            },
            Role: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Example name' },
                }
            },
            User: {
                id: { type: 'integer', example: 1 },
                firstname: { type: 'string', example: 'Example firstname' },
                lastname: { type: 'string', example: 'Example lastname' },
                username: { type: 'string', example: 'Example username' },
                email: { type: 'string', example: 'example@gmail.com' },
                address: { type: 'string', example: 'Example address' },
                phone: { type: 'string', example: '12345678' },
                membership: { type: 'string', example: 'bronze' },
                role: { type: 'string', example: 'User' }
            },
            ServerError: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'error'},
                    statusCode: { type: 'integer', example: 500 },
                    message: { type: 'string', example: 'Internal server error' }
                }
            },
            FailedAuthentication: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'error'},
                    statusCode: { type: 'integer', example: 401 },
                    message: { type: 'string', example: 'Invalid token' }
                }
            },
            NotAdmin: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'error'},
                    statusCode: { type: 'integer', example: 403 },
                    message: { type: 'string', example: 'Must be admin to access' }
                }
            },
            ResourceNotFound: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'error'},
                    statusCode: { type: 'integer', example: 404 },
                    message: { type: 'string', example: '[resource] not found' }
                }
            },
            MissingParameters: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'error'},
                    statusCode: { type: 'integer', example: 400 },
                    message: { type: 'string', example: 'All fields are required' }
                }
            },
            ForeignKeyConstraint : {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'error'},
                    statusCode: { type: 'integer', example: 400 },
                    message: { type: 'string', example: 'Invalid foreign key' }
                }
            }
        }
    }

}

const outputFile = './swagger-output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./bin/www')
})