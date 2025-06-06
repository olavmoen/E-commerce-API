const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

class MembershipService {
    constructor(db) {
        this.db = db;
        this.memberships = db.Membership
    }

    async getAll() {
        const memberships = await this.memberships.findAll();
        return memberships.length ? memberships.map(membership => membership.toJSON()) : null;
    }

    async getMembership(id) {
        const membership = await this.memberships.findByPk(id);
        return membership ? membership.toJSON() : null;
    }

    //Finds the fitting membership based on the amount of products given
    async getEarnedMembership(productCount) {
        const query = `SELECT * FROM memberships
               WHERE \`minValue\` <= :productCount
               AND (\`maxValue\` >= :productCount OR \`maxValue\` IS NULL)
               LIMIT 1;`;

        const [result] = await sequelize.query(query, {
            replacements: { productCount },
            type: QueryTypes.SELECT
        });
        return result || null;
    }
}

module.exports = MembershipService;