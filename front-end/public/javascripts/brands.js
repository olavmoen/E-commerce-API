let brands = [];
let token = null;

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
        if(json.status === 'success') {
            brands = json.data.brands;
            renderBrands(json.data.brands);
        } else if(json.status === 'error') {
            throw new Error(json.data.result);
        }
    } catch (err) {
        console.error(err);
    }
}

async function renderBrands(brands) {
    const tableBody = document.querySelector('#brandsTable tbody');
    tableBody.innerHTML = '';

    brands.forEach(brand => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${brand.id}</td>
            <td>${brand.name}</td>
           <td>
                <button class="btn btn-danger" onclick="deleteBrand(${brand.id})"><i class="bi bi-trash"></i></button>
                <button class="btn btn-warning edit-btn" onclick="updateBrand(${brand.id})">
                    <i class="bi bi-pen"></i>
                </button>
            </td>`;
        tableBody.appendChild(row);
    });
}

async function deleteBrand(brandId) {
    try {
        const res = await fetch(`http://localhost:3000/brands/${brandId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const json = await res.json();
        if(json.status === 'success') {
            getBrands(); // Re render the table
        } else if(json.status === 'error') {
            throw new Error(json.data.result);
        }
    } catch (err) {
        console.error(err);
    }
}

function updateBrand(brandId) {
    const brand = brands.find(b => b.id == brandId);

    // Populate form fields
    document.getElementById('edit-id').value = brand.id;
    document.getElementById('edit-name').value = brand.name;

    const modal = new bootstrap.Modal(document.getElementById('editBrandModal'));
    modal.show();
}

function addBrand() {
    const modal = new bootstrap.Modal(document.getElementById('addBrandModal'));
    modal.show();
}

document.getElementById("editBrandForm").addEventListener('submit', async function(e) {
    e.preventDefault();
    const brandId = document.getElementById('edit-id').value;
    const brandData = {
        name: document.getElementById('edit-name').value
    }
    try {
        const res = await fetch(`http://localhost:3000/brands/${brandId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(brandData)
        });
        const json = await res.json();
        if(json.status === 'success') {
            getBrands(); // Re render the table
            const modalElement = document.getElementById('editBrandModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

        } else if(json.status === 'error') {
            throw new Error(json.data.result);
        }
    } catch (err) {
        console.error(err);
    }
});

document.getElementById("addBrandForm").addEventListener('submit', async function(e) {
    e.preventDefault();
    const brandData = {
        name: document.getElementById('add-name').value
    }

    try {
        const res = await fetch(`http://localhost:3000/brands`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(brandData)
        });
        const json = await res.json();
        if(json.status === 'success') {
            getBrands(); // Re render the table
            const modalElement = document.getElementById('addBrandModal');
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
})