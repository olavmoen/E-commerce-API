let token = null;

async function init() {
    try {
        const res = await fetch('http://localhost:3000/init', {
            method: "POST"
        });
        const json = await res.json();
        if(json.status === 'error') {
            throw new Error(json.data.result);
        }
        console.log(json.data.result);

    } catch (err) {
        console.error('Failed to initalize db:', err);
    }
}

async function isAdmin(token) {
    try {
        const res = await fetch('http://localhost:3000/auth/admin/access', {
        method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if(res.status != 200) {
            console.log('Access denied. Admins only');
            return false;
        }
        return true;

    } catch(err) {
        console.log(err);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    await init();

    document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById("email-input").value;
    const password = document.getElementById("password-input").value;
    
    try {
        const res = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const json = await res.json();
        if(json.status === 'error') {
            throw new Error(json.data.result);
        }
        token = json.data.token;
        localStorage.setItem('token', token);
        if(!await isAdmin(token)) {
            alert("Access denied");
            window.location.href = 'http://localhost:5000/admin/';
            return;
        }
        console.log(json.data.result);

        window.location.href = 'http://localhost:5000/admin/products';

    } catch (err) {
        console.error(err);
    }
    });
})