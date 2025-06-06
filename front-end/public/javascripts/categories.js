let categories = [];
let token = null;

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
        if(json.status === 'success') {
            categories = json.data.categories;
            renderCategories(json.data.categories);
        } else if(json.status === 'error') {
            throw new Error(json.data.result);
        }
        
    } catch (err) {
        console.error(err);
    }
}

function renderCategories(categories) {
    const tableBody = document.querySelector('#categoriesTable tbody');
    tableBody.innerHTML = '';

    categories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
           <td>
                <button class="btn btn-danger" onclick="deleteCategory(${category.id})"><i class="bi bi-trash"></i></button>
                <button class="btn btn-warning edit-btn" onclick="updateCategory(${category.id})">
                    <i class="bi bi-pen"></i>
                </button>
            </td>`;
        tableBody.appendChild(row);
    });
}

async function deleteCategory(categoryId) {
    try {
        const res = await fetch(`http://localhost:3000/categories/${categoryId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const json = await res.json();
        if(json.status === 'success') {
            getCategories(); // Re render the table
        } else if(json.status === 'error') {
            throw new Error(json.data.result);
        }
    } catch (err) {
        console.error(err);
    }
}

function updateCategory(categoryId) {
    const category = categories.find(c => c.id == categoryId);

    // Populate form fields
    document.getElementById('edit-id').value = category.id;
    document.getElementById('edit-name').value = category.name;

    const modal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
    modal.show();
}

function addCategory() {
    const modal = new bootstrap.Modal(document.getElementById('addCategoryModal'));
    modal.show();
}

document.getElementById("editCategoryForm").addEventListener('submit', async function(e) {
    e.preventDefault();
    const categoryId = document.getElementById('edit-id').value;
    const categoryData = {
        name: document.getElementById('edit-name').value
    }
    try {
        const res = await fetch(`http://localhost:3000/categories/${categoryId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(categoryData)
        });
        const json = await res.json();
        if(json.status === 'success') {
            getCategories(); // Re render the table
            const modalElement = document.getElementById('editCategoryModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

        } else if(json.status === 'error') {
            throw new Error(json.data.result);
        }
    } catch (err) {
        console.error(err);
    }
});

document.getElementById("addCategoryForm").addEventListener('submit', async function(e) {
    e.preventDefault();
    const categoryData = {
        name: document.getElementById('add-name').value
    }

    try {
        const res = await fetch(`http://localhost:3000/categories`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(categoryData)
        });
        const json = await res.json();
        if(json.status === 'success') {
            getCategories(); // Re render the table
            const modalElement = document.getElementById('addCategoryModal');
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
    await getCategories();
})