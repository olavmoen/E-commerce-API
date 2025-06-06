class BrandService {
    constructor(db) {
        this.db = db
        this.brands = db.Brand
    }

    async create(data) {
        const newBrand = await this.brands.create(data);

        return newBrand ? newBrand.toJSON() : null;
    }

    async getAll() {
        const brands = await this.brands.findAll({
            attributes: ['id', 'name']
        });

        return brands.map(b => b.toJSON());
    }

    async delete(id) {
        const brand = await this.brands.findByPk(id);
        if (!brand) return null;
        
        await brand.destroy();

        return brand ? brand.toJSON() : null;
    }

    async update(id, data) {
        const [rowsAffected] = await this.brands.update(data, { where: { id } });
        if (rowsAffected === 0) return null;

        const updatedBrand = await this.brands.findByPk(id);
        return updatedBrand ? updatedBrand.toJSON() : null;
    }
}

module.exports = BrandService;