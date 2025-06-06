let users = [];
let roles = [];
let token = null;

async function getUsers() {
    try {
        const res = await fetch('http://localhost:3000/users', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const json = await res.json();
        if(json.status === 'success') {
            users = json.data.users;
            renderUsers(json.data.users);
        } else if(json.status === 'error') {
            throw new Error(json.data.result);
        }
        
    } catch (err) {
        console.error(err);
    }
}

function renderUsers(users) {
    const tableBody = document.querySelector('#usersTable tbody');
    tableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');

        let membershipColor = '';
        switch (user.membership) {
            case 'Gold':
                membershipColor = 'btn-warning';
                break;
            case 'Silver':
                membershipColor = 'btn-secondary';
                break;
            case 'Bronze':
                membershipColor = 'btn-danger';
                break;
            default:
                membershipColor = 'btn-light';
                break;
        }

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.email}</td>
            <td>${user.address}</td>
            <td>${user.phone}</td>
            <td>${user.role}</td>
            <td><span class="btn ${membershipColor} btn-sm">${user.membership}</span></td>
           <td>
                <button class="btn btn-warning edit-btn" onclick="updateUser(${user.id})">
                    <i class="bi bi-pen"></i>
                </button>
            </td>`;
        tableBody.appendChild(row);
    });
}

function updateUser(userId) {
    const user = users.find(u => u.id == userId);
    
    // Populate form fields
    document.getElementById('edit-id').value = user.id;
    document.getElementById('edit-username').value = user.username;
    document.getElementById('edit-firstname').value = user.firstname;
    document.getElementById('edit-lastname').value = user.lastname;
    document.getElementById('edit-email').value = user.email;
    document.getElementById('edit-address').value = user.address;
    document.getElementById('edit-phone').value = user.phone;

    const roleSelect = document.getElementById('edit-role');
    roleSelect.innerHTML = '';
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.text = role.name;
        roleSelect.appendChild(option);
    });

    // The currently logged in admin can not change its own user role
    const currentUserId = getCurrentUserId();
    if(currentUserId == user.id) {
        roleSelect.disabled = true;
    } else {
        roleSelect.disabled = false;
    }

    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
}

async function getRoles() {
    try {
        const res = await fetch('http://localhost:3000/roles', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const json = await res.json();
        roles = json.data.roles;
    } catch (err) {
        console.error(err);
    }
}

function getCurrentUserId() {
    if(!token) return null;

    const decoded = jwt_decode(token);
    return decoded.sub;
}

document.getElementById("editUserForm").addEventListener('submit', async function(e) {
     e.preventDefault();
     const userId = document.getElementById('edit-id').value;
     const userData = {
        firstname: document.getElementById('edit-firstname').value,
        lastname: document.getElementById('edit-lastname').value,
        username: document.getElementById('edit-username').value,
        email: document.getElementById('edit-email').value,
        address: document.getElementById('edit-address').value,
        phone: document.getElementById('edit-phone').value,
        role_id: document.getElementById('edit-role').value
     };

     try {
        const res = await fetch(`http://localhost:3000/users/${userId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });
        const json = await res.json();
        
        if(json.status === 'success') {
            getUsers(); // Re render the table
            const modalElement = document.getElementById('editUserModal');
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
    await getUsers();
    await getRoles();
});