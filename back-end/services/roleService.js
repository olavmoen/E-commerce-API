
class RoleService {
    constructor(db) {
        this.db = db
        this.roles = db.Role
    }

    async getAll() {
        const roles = await this.roles.findAll({
            attributes: ['id', 'name']
        });

        return roles.map(r => r.toJSON());
    }
}

module.exports = RoleService;