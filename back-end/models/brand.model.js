module.exports = (sequelize, DataTypes) => {
    const Brand = sequelize.define('Brand', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
    })

    Brand.associate = function (models) {
        Brand.hasOne(models.Product, { foreignKey: { allowNull: false, name: 'brand_id' }, onDelete: 'RESTRICT'});
    }

    return Brand;
}