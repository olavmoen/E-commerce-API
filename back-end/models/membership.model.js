module.exports = (sequelize, DataTypes) => {
    const Membership = sequelize.define('Membership', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        minValue: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maxValue: {
            type: DataTypes.INTEGER
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        timestamps: false,
    });

    Membership.associate = function (models) {
        Membership.hasOne(models.User, { foreignKey: { allowNull: false, name: 'membership_id' }});
        Membership.hasMany(models.Order, { foreignKey: { allowNull: false, name: 'membership_id' }});
    }

    return Membership;
}