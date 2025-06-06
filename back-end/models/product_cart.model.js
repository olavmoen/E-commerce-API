module.exports = (sequelize, DataTypes) => {
    const Product_Cart = sequelize.define('Product_Cart', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });

    return Product_Cart;
}