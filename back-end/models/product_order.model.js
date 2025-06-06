module.exports = (sequelize, DataTypes) => {
    const Product_Order = sequelize.define('Product_Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return Product_Order;
}