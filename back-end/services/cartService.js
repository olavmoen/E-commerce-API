
class CartService {
    constructor(db) {
        this.db = db;
        this.carts = db.Cart;
        this.cartProducts = db.Product_Cart;
    }

    async getCart(userId) {
        const cart = await this.carts.findOne({
            where: {
                user_id: userId
            }});
        return cart ? cart.toJSON() : null;
    }

    async getCartProducts(cartId) {
        const cartProducts = await this.cartProducts.findAll({
            where: { cart_id: cartId }
        });

        return cartProducts.length ? cartProducts.map(product => product.toJSON()) : null;
    }

    async addProduct(userId, product, quantity) {
        //Find users cart, if it is the first product added, then one is created
        const [cart] = await this.carts.findOrCreate({
            where: { user_id: userId }
        });

        let cartProduct = await this.cartProducts.findOne({
            where: {
                product_id: product.id,
                cart_id: cart.id
            }
        });

        if(cartProduct) { //If product is already in cart, update the quantity
            if(cartProduct.quantity + quantity > product.quantity) return null; // Check for amount already in cart
            cartProduct.quantity += quantity;
            await cartProduct.save();
        }
        else { // If not, add it
            cartProduct = await this.cartProducts.create({
                quantity,
                cart_id: cart.id,
                product_id: product.id
            });
        }
        return cartProduct ? cartProduct.toJSON() : null;
    }

    async removeProduct(userId, productId, quantity) {
        const cart = await this.carts.findOne({
            where: { user_id: userId }
        });
        if(!cart) return null;

        let cartProduct = await this.cartProducts.findOne({
            where: {
                product_id: productId,
                cart_id: cart.id
            }
        });
        if(!cartProduct) return null;

        if(quantity >= cartProduct.quantity) {
            await cartProduct.destroy();
        }
        else {
            cartProduct.quantity -= quantity;
            await cartProduct.save();
        }
        return cartProduct;
    }

    async deleteCart(cartId) {
        const cartProducts = await this.cartProducts.findAll({
            where: { cart_id: cartId }
        });
        for (const cartProduct of cartProducts) {
            await cartProduct.destroy();
        }
        const cart = await this.carts.findByPk(cartId);
        await cart.destroy();
    }
}

module.exports = CartService;