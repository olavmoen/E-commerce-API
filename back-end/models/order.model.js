module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ordernumber: {
            type: DataTypes.STRING(8),
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            defaultValue: 'In Progress'
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        membership_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    })

    Order.associate = function (models) {
        Order.belongsTo(models.User, { foreignKey: { allowNull: false, name: 'user_id' }});
        Order.belongsTo(models.Membership, { foreignKey: { allowNull: false, name: 'membership_id' }});
        Order.belongsToMany(models.Product, { through: { model: 'Product_Order' }, foreignKey: 'order_id' });
    }

    return Order;
}