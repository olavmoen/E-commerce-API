module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('Category', {
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

    Category.associate = function (models) {
        Category.hasOne(models.Product, { foreignKey: { allowNull: false, name: 'category_id' }, onDelete: 'RESTRICT'});
    }

    return Category;
}