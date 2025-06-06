const { hashPassword } = require('./passwordHelper')

async function initDb(db, products) {
    await db.sequelize.sync({ force: true });

    await db.Role.bulkCreate([
        {
            id: 1,
            name: 'Admin'
        },
        {
            id: 2,
            name: 'User'
        }
    ]);

    await db.Membership.bulkCreate([
        {
            id: 1,
            name: 'Bronze',
            minValue: 0,
            maxValue: 14,
            discount: 0
        },
        {
            id: 2,
            name: 'Silver',
            minValue: 15,
            maxValue: 29,
            discount: 15
        },
        {
            id: 3,
            name: 'Gold',
            minValue: 30,
            maxValue: null,
            discount: 30
        }
    ]);

    const admin = await hashPassword('P@ssword2023');
    const test = await hashPassword('pass');

    await db.User.create({
        id: 1,
        firstname: 'Admin',
        lastname: 'Support',
        username: 'Admin',
        email: 'admin@noroff.no',
        encryptedPassword: (await admin).encryptedPassword,
        salt: (await admin).salt,
        address: 'Online',
        phone: '911',
        membership_id: 1,
        role_id: 1
    });
    await db.User.create({
        id: 2,
        firstname: 'test',
        lastname: 'testesen',
        username: 'test',
        email: 'test@noroff.no',
        encryptedPassword: (await test).encryptedPassword,
        salt: (await test).salt,
        address: 'Online',
        phone: '911',
        membership_id: 1,
        role_id: 2
    });
    
    for (const product of products.data) {
        const [category] = await db.Category.findOrCreate({
            where: {name: product.category}
        });
        const [brand] = await db.Brand.findOrCreate({
            where: {name: product.brand}
        });
        await db.Product.create({
            name: product.name,
            description: product.description,
            unitprice: product.price,
            imgurl: product.imgurl,
            quantity: product.quantity,
            brand_id: brand.id,
            category_id: category.id
        })
    }

}

module.exports = { initDb }