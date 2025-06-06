module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false
        }
    },
    {
        timestamps: false,
    });

    Role.associate = function (models) {
        Role.hasOne(models.User, { foreignKey: { allowNull: false, name: 'role_id' }});
    }

    return Role;
}