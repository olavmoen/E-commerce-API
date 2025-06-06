module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstname: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        encryptedPassword: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        salt: {
            type: DataTypes.BLOB,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        membership_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 2,
        }
    });

    User.associate = function (models) {
        User.belongsTo(models.Role, { foreignKey: { allowNull: false, name: 'role_id' }});
        User.belongsTo(models.Membership, { foreignKey: { allowNull: false, name: 'membership_id' }});
        User.hasOne(models.Cart, { foreignKey: { allowNull: false, name: 'user_id' }});
        User.hasMany(models.Order, { foreignKey: { allowNull: false, name: 'user_id' }});
    }

    return User;
}