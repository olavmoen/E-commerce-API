let token = null;
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
        if(json.status === 'success') {
            renderRoles(json.data.roles);
        } else if(json.status === 'error') {
            throw new Error(json.data.result);
        }
        
    } catch (err) {
        console.error(err);
    }
}

function renderRoles(roles) {
    const tableBody = document.querySelector('#rolesTable tbody');
    tableBody.innerHTML = '';

    roles.forEach(role => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${role.id}</td>
            <td>${role.name}</td>`
        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    token = localStorage.getItem('token', token);
    await getRoles();
})