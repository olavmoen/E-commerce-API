
class CategoryService {
    constructor(db) {
        this.db = db
        this.categories = db.Category
    }

    async create(data) {
        const newCategory = await this.categories.create(data);

        return newCategory ? newCategory.toJSON() : null;
    }

    async getAll() {
        const categories = await this.categories.findAll({
            attributes: ['id', 'name']
        });

        return categories.map(c => c.toJSON());
    }

    async delete(id) {
        const category = await this.categories.findByPk(id);
        if (!category) return null;

        await category.destroy();

        return category.toJSON();
    }

    async update(id, data) {
        const [rowsAffected] = await this.categories.update(data, { where: { id } });
        if (rowsAffected === 0) return null;

        const updatedCategory = await this.categories.findByPk(id);
        return updatedCategory ? updatedCategory.toJSON() : null;
    }
}

module.exports = CategoryService;