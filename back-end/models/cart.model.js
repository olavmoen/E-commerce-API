module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        }
    })

    Cart.associate = function (models) {
        Cart.belongsTo(models.User, { foreignKey: { allowNull: false, name: 'user_id' }});
        Cart.belongsToMany(models.Product, { through: { model: 'Product_Cart' }, foreignKey: 'cart_id' });
    }

    return Cart;
}