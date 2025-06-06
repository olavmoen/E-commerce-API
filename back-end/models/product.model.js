module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        unitprice: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        imgurl: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onDelete: 'RESTRICT'
        },
    });

    Product.associate = function (models) {
        Product.belongsTo(models.Brand, { foreignKey: { allowNull: false, name: 'brand_id', }, onDelete: 'RESTRICT'});
        Product.belongsTo(models.Category, { foreignKey: { allowNull: false, name: 'category_id' }, onDelete: 'RESTRICT'});
        Product.belongsToMany(models.Cart, { through: {model: 'Product_Cart'}, foreignKey: 'product_id' });
        Product.belongsToMany(models.Order, { through: {model: 'Product_Order'}, foreignKey: 'product_id'})
    }

    return Product;
}