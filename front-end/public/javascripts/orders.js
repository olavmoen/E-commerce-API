let token = null;

async function getOrders() {
    try {
        const res = await fetch('http://localhost:3000/orders/admin', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const json = await res.json();
        if(json.status === 'success') {
            renderOrders(json.data.orders);
        } else if(json.status === 'error') {
            throw new Error(json.data.result);
        }
        
    } catch (err) {
        console.error(err);
    }
}

function renderOrders(orders) {
    const tableBody = document.querySelector('#ordersTable tbody');
    tableBody.innerHTML = '';

    if (orders.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="7" class="text-center">No records found</td>`;
        tableBody.appendChild(row);
        return;
    }

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.ordernumber}</td>
            <td>${order.createdAt}</td>
            <td>${order.updatedAt}</td>
            <td>${order.user_id}</td>
            <td>${order.status}</td>
            <td>
                <button class="btn btn-warning edit-btn" onclick="updateOrder(${order.id})">
                    <i class="bi bi-pen"></i>
                </button>
            </td>`

        tableBody.appendChild(row);
    });
}

function updateOrder(orderId) {
    document.getElementById('edit-id').value = orderId;
    const modal = new bootstrap.Modal(document.getElementById('editOrderModal'));
    modal.show();
}

document.getElementById("editOrderForm").addEventListener('submit', async function(e) {
     e.preventDefault();
     const orderId = document.getElementById('edit-id').value;
     const orderData = {
        status: document.getElementById('edit-status').value
     }

     try {
        const res = await fetch(`http://localhost:3000/orders/${orderId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        const json = await res.json();
        
        if(json.status === 'success') {
            getOrders(); // Re render the table
            const modalElement = document.getElementById('editOrderModal');
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
    await getOrders();
});