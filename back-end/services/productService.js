const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

class ProductService {
    constructor(db) {
        this.db = db;
        this.products = db.Product
    }

    async getAll() {
        const query = `SELECT products.id, products.name, description, unitprice, imgurl, quantity, isDeleted, brand_id, category_id, brands.name AS brand, categories.name AS category, products.createdAt, products.updatedAt 
                        FROM products
                        LEFT JOIN brands ON brand_id = brands.id
                        LEFT JOIN categories ON category_id = categories.id;`;
        
        return await sequelize.query(query, { type: QueryTypes.SELECT});
    }

    async getAllNotDeleted() {
        const query = `SELECT products.id, products.name, description, unitprice, imgurl, quantity, isDeleted, brand_id, category_id, brands.name AS brand, categories.name AS category, products.createdAt, products.updatedAt 
                        FROM products
                        LEFT JOIN brands ON brand_id = brands.id
                        LEFT JOIN categories ON category_id = categories.id
                        WHERE isDeleted = false;`;
        
        return await sequelize.query(query, { type: QueryTypes.SELECT});
    }

    async getProduct(id) {
        const query = `SELECT products.id, products.name, description, unitprice, imgurl, quantity, isDeleted, brand_id, category_id, brands.name AS brand, categories.name AS category, products.createdAt, products.updatedAt 
                        FROM products
                        LEFT JOIN brands ON brand_id = brands.id
                        LEFT JOIN categories ON category_id = categories.id
                        WHERE products.id = :id`;

        const [results] = await this.db.sequelize.query(query, {
            replacements: { id },
            type: QueryTypes.SELECT
        });
        return results || null;
    }

    async create(data) {
        const newProduct = await this.products.create({
            name: data.name,
            description: data.description,
            unitprice: data.unitprice,
            imgurl: data.imgurl,
            quantity: data.quantity,
            brand_id: data.brand_id,
            category_id: data.category_id
        });
        
        return newProduct ? newProduct.toJSON() : null;
    }

    async delete(id) {
        const product = await this.products.findByPk(id);
        if (!product) return null;

        product.isDeleted = true;
        await product.save();

        return product.toJSON();
    }

    async update(id, data) {
        const updateData = {};
        if (data.name) updateData.name = data.name;
        if (data.description) updateData.description = data.description;
        if (data.unitprice !== undefined) updateData.unitprice = data.unitprice;
        if (data.imgurl) updateData.imgurl = data.imgurl;
        if (data.quantity !== undefined) updateData.quantity = data.quantity;
        if (data.brand) updateData.brand_id = data.brand;
        if (data.category) updateData.category_id = data.category;
        if (data.isDeleted !== undefined) updateData.isDeleted = data.isDeleted;

        const [rowsAffected] = await this.products.update(updateData, { where: { id } });
        if (rowsAffected === 0) return null;

        const updatedProduct = await this.products.findByPk(id);
        
        return updatedProduct ? updatedProduct.toJSON() : null;
    }

    async search(keyword, brandId, categoryId, role) {
        // Base query
        let query = `SELECT products.id, products.name, description, unitprice, imgurl,
                    quantity, isDeleted, products.createdAt, brands.name AS brand, categories.name AS category
                    FROM products
                    LEFT JOIN brands ON brand_id = brands.id
                    LEFT JOIN categories ON category_id = categories.id
                    WHERE 1=1`;

        // Add optional filtering
        const replacements = {};
        if(keyword) {
            query += ` AND products.name LIKE :keyword`;
            replacements.keyword = `%${keyword}%`;
        }
        if (brandId) {
            query += ` AND brands.id = :brandId`;
            replacements.brandId = brandId;
        }
        if (categoryId) {
            query += ` AND categories.id = :categoryId`;
            replacements.categoryId = categoryId;
        }
        if(role !== 'Admin') { // Only admins can see deleted products
            query += ` AND isDeleted = :isDeleted`;
            replacements.isDeleted = false;
        }

        const result = await sequelize.query(query, {
            replacements,
            type: QueryTypes.SELECT
        });
        return result || null;
    }
}

module.exports = ProductService;