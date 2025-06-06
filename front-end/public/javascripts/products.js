let token = null;
let products = [];
let brands = [];
let categories = [];

async function getProducts() {
    try {
        const res = await fetch('http://localhost:3000/products', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const json = await res.json();
        products = json.data.products;
        
        if(json.status === 'success') {
            renderProducts(json.data.products);
        } else if(json.status === 'error') {
            throw new Error(json.data.result);
        }
    } catch (err) {
        console.error(err);
    }
}

async function getBrands() {
    try {
        const res = await fetch('http://localhost:3000/brands', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const json = await res.json();
        if(json.status === 'error') {
            throw new Error(json.data.result);
        }

        brands = json.data.brands;

        const brandSearch = document.getElementById('brand-search');
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.id;
            option.text = brand.name;
            brandSearch.appendChild(option);
        });
        
    } catch (err) {
        console.error(err);
    }
}

async function getCategories() {
    try {
        const res = await fetch('http://localhost:3000/categories', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const json = await res.json();
        if(json.status === 'error') {
            throw new Error(json.data.result);
        }
        categories = json.data.categories;

        const categorySearch = document.getElementById('category-search');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.text = category.name;
            categorySearch.appendChild(option);
        });
        
    } catch (err) {
        console.error(err);
    }
}

function renderProducts(products) {
    const tableBody = document.querySelector('#productsTable tbody');
    tableBody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>${product.quantity}</td>
            <td>${product.unitprice}</td>
            <td>${product.brand}</td>
            <td>${product.category}</td>
            <td>${product.imgurl}</td>
            <td><img src="${product.imgurl}" alt="product image" style="max-width: 50px;"/></td>
            <td>
                <div class="form-check form-switch">
                    <input class="form-check-input delete-toggle" type="checkbox" role="switch"
                        ${product.isDeleted ? 'checked' : ''} data-id="${product.id}" id="switch${product.id}" disabled>
                </div>
            </td>
            <td>${product.createdAt}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})"><i class="bi bi-trash"></i></button>
                <button class="btn btn-warning edit-btn" onclick="updateProduct(${product.id})">
                    <i class="bi bi-pen"></i>
                </button>
            </td>`;

        tableBody.appendChild(row);
    });
}

function updateProduct(productId) {
    const product = products.find(p => p.id == productId);
    
    // Populate form fields
    document.getElementById('edit-id').value = product.id;
    document.getElementById('edit-name').value = product.name;
    document.getElementById('edit-description').value = product.description;
    document.getElementById('edit-quantity').value = product.quantity;
    document.getElementById('edit-price').value = product.unitprice;
    document.getElementById('edit-img').value = product.imgurl;
    document.getElementById('edit-isDeleted').checked = product.isDeleted;

    const categorySelect = document.getElementById('edit-category');
    categorySelect.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.text = category.name;
        categorySelect.appendChild(option);
    });
    const brandSelect = document.getElementById('edit-brand');
    brandSelect.innerHTML = '';
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand.id;
        option.text = brand.name;
        brandSelect.appendChild(option);
    });

    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    modal.show();
}

async function deleteProduct(productId) {
    try {
        const res = await fetch(`http://localhost:3000/products/${productId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const json = await res.json();
        if(json.status === 'success') {
            getProducts(); // Re render the table
        } else if(json.status === 'error') {
            throw new Error(json.data.result);
        }
    } catch (err) {
        console.error(err);
    }
}

async function searchProduct() {
    const keyword = document.getElementById('name-search').value;
    let brandId = document.getElementById('brand-search').value;
    let categoryId = document.getElementById('category-search').value;

    brandId = brandId === '' ? null : brandId;
    categoryId = categoryId === '' ? null : categoryId;

    try {
        const res = await fetch(`http://localhost:3000/search`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ keyword, brandId, categoryId })
        });
        const json = await res.json();
        if(json.status === 'success') {
            renderProducts(json.data.products);
        } else if(json.status === 'error') {
            throw new Error(json.data.result);
        }
    } catch (err) {
        console.error(err);
    }
}

function clearSearch() {
    document.getElementById('name-search').value = '';
    document.getElementById('brand-search').value = '';
    document.getElementById('category-search').value = '';

    renderProducts(products);
}

function addProduct() {
    const categorySelect = document.getElementById('add-category');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.text = category.name;
        categorySelect.appendChild(option);
    });
    const brandSelect = document.getElementById('add-brand');
    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand.id;
        option.text = brand.name;
        brandSelect.appendChild(option);
    });

    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
}

document.getElementById("editProductForm").addEventListener('submit', async function(e) {
     e.preventDefault();
     const productId = document.getElementById('edit-id').value;
     const productData = {
        id: productId,
        name: document.getElementById('edit-name').value,
        description: document.getElementById('edit-description').value,
        quantity: document.getElementById('edit-quantity').value,
        unitprice: document.getElementById('edit-price').value,
        imgurl: document.getElementById('edit-img').value,
        isDeleted: document.getElementById('edit-isDeleted').checked,
        brand: document.getElementById('edit-brand').value,
        category: document.getElementById('edit-category').value
     }

     try {
        const res = await fetch(`http://localhost:3000/products/${productId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        const json = await res.json();
        if(json.status === 'success') {
            getProducts(); // Re render the table
            const modalElement = document.getElementById('editProductModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

        } else if(json.status === 'error') {
            throw new Error(json.data.result);
        }

     } catch (err) {
        console.error(err);
    }
});

document.getElementById("addProductForm").addEventListener('submit', async function(e) {
     e.preventDefault();
     const productData = {
        name: document.getElementById('add-name').value,
        description: document.getElementById('add-description').value,
        quantity: document.getElementById('add-quantity').value,
        unitprice: document.getElementById('add-price').value,
        imgurl: document.getElementById('add-img').value,
        brand_id: document.getElementById('add-brand').value,
        category_id: document.getElementById('add-category').value
     }

     try {
        const res = await fetch(`http://localhost:3000/products`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });
        const json = await res.json();
        if(json.status === 'success') {
            getProducts(); // Re render the table
            const modalElement = document.getElementById('addProductModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

        } else if(json.status === 'error') {
            throw new Error(json.data.result);
        }
     } catch (err) {
        console.error(err);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    token = localStorage.getItem('token', token);
    await getBrands();
    await getCategories();
    await getProducts();
});