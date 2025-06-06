let token = null;

async function getMemberships() {
    try {
        const res = await fetch('http://localhost:3000/memberships', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const json = await res.json();
        if(json.status === 'success') {
            renderMemberships(json.data.memberships);
        } else if(json.status === 'error') {
            throw new Error(json.data.result);
        }
        
    } catch (err) {
        console.error(err);
    }
}

function renderMemberships(memberships) {
    const tableBody = document.querySelector('#membershipsTable tbody');
    tableBody.innerHTML = '';

    memberships.forEach(membership => {
        const row = document.createElement('tr');
        let membershipColor = '';
        switch (membership.name) {
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
            <td>${membership.id}</td>
            <td><span class="btn ${membershipColor} btn-sm">${membership.name}</span></td>
            <td>${membership.discount}</td>`

        tableBody.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    token = localStorage.getItem('token', token);
    await getMemberships();
})