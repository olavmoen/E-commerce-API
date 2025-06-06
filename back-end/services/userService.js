const { Op } = require('sequelize');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

class UserService  {
    constructor(db) {
        this.db = db
        this.users = db.User
    }

    async getAll() {
        const query = `SELECT users.id, firstname, lastname, username, email, address, phone, memberships.name AS membership, roles.name AS role
                    FROM users
                    LEFT JOIN memberships ON membership_id = memberships.id
                    LEFT JOIN roles ON role_id = roles.id;`;
        
        const result = await sequelize.query(query, {
            type: QueryTypes.SELECT
        });
        return result.length ? result : null;
    }

    async create(data) {
        const newUser = await this.users.create(data);
        return newUser ? newUser.toJSON() : null;
    }

    async getByUsernameOrEmail(username="", email="") {
        const user = await this.users.findOne({
            where: {
                [Op.or]: [{username}, {email}]
            }
        });

        return user ? user.toJSON() : null;
    }

    async getById(id) {
        const user = await this.users.findByPk(id);
        return user ? user.toJSON() : null;
    }

    async getUserRole(id) {
        const user = await this.users.findOne({
            where: {id},
            include: [
                {
                    model: this.db.Role,
                    attributes: ['name']
                }
            ]
        })

        return user ? user.Role.name : null;
    }

    async update(id, data) {
        const updateData = {};

        //Optional fields that can be updated
        const fields = ['firstname', 'lastname', 'username', 'email', 'address', 'phone', 'role_id'];
        fields.forEach(field => {
            if (data[field]) updateData[field] = data[field];
        });

        const [rowsAffected] = await this.users.update(updateData, { where: { id } });
        if (rowsAffected === 0) return null;

        const updatedUser = await this.users.findByPk(id);
        return updatedUser ? updatedUser.toJSON() : null;
    }

    //Seperate function to update membership as this will only be done by backend 
    async updateMembership(user_id, membership) {
        const user = await this.users.findByPk(user_id);
        if(!user) return null;
        
        user.membership_id = membership.id;
        user.save();

        return user;
    }
}

module.exports = UserService;