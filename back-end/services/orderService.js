const crypto = require('crypto');

class OrderService {
    constructor(db) {
        this.db = db;
        this.orders = db.Order;
        this.orderProducts = db.Product_Order;
    }

    async getAll() {
        const orders = await this.orders.findAll();

        return orders.map(o => o.toJSON());
    }

    async getOrders(userId) {
        const orders = await this.orders.findAll({
            where: { user_id: userId}
        });
        return orders.map(order => order.toJSON());
    }

    async create(userId, membershipId, discount) {
        const ordernumber = this.generateCode();
        
        const order = await this.orders.create({
            ordernumber,
            discount,
            user_id: userId,
            membership_id: membershipId
        });
        return order ? order.toJSON() : null;
    }

    async addOrderProduct(orderId, productId, quantity) {
        const orderProduct = await this.orderProducts.create({
            quantity,
            order_id: orderId,
            product_id: productId
        });
        return orderProduct ? orderProduct.toJSON() : null;
    }

    //Count number of product that user has in orders
    async getProductCount(userId) {
        let productCount = 0;
        const orders = await this.orders.findAll({
            where: { user_id: userId }
        });
        for (const order of orders) {
            const orderProducts = await this.getOrderProducts(order.id);
            for (const product of orderProducts) {
                productCount += product.quantity;
            }
        }
        
        return productCount;
    }

    async getOrderProducts(orderId) {
        const orderProducts = await this.orderProducts.findAll({
            where: { order_id: orderId}
        });

        return orderProducts.length ? orderProducts.map(product => product.toJSON()) : null;
    }

    async updateStatus(orderId, status) {
        if(status !== 'In Progress' && status !== 'Ordered' && status !== 'Completed') return null;

        const order = await this.orders.findByPk(orderId);
        if(!order) return null;

        order.status = status;
        await order.save();
        return order;
    }

    generateCode(length = 8) {
        return crypto.randomBytes(length)
          .toString('base64')
          .replace(/[^a-zA-Z0-9]/g, '')
          .slice(0, length);
      }
}

module.exports = OrderService;