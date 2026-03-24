const log = (status, data) => {
    document.getElementById('response-status').innerText = status;
    document.getElementById('response-output').innerText = JSON.stringify(data, null, 2);
};

const callApi = async (url, method = 'GET', body = null) => {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include' // Important for cookies!
        };
        if (body) options.body = JSON.stringify(body);
        
        const response = await fetch(url, options);
        const data = await response.json().catch(() => ({}));
        
        log(`${method} ${url} - ${response.status}`, data);
        return data;
    } catch (err) {
        log('Error', err.message);
    }
};

// Auth
async function register() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    await callApi('/auth/register', 'POST', { name, email, password });
    getMe();
}

async function login() {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    await callApi('/auth/login', 'POST', { email, password });
    getMe();
}

async function logout() {
    await callApi('/auth/logout', 'POST');
    document.getElementById('user-info').innerText = 'Не авторизован';
}

async function getMe() {
    const data = await callApi('/auth/me');
    if (data && data.name) {
        document.getElementById('user-info').innerHTML = `
            <strong>${data.name}</strong> (${data.email})<br>
            <small>ID: ${data._id}</small>
        `;
    }
}

// Groups
async function getMyGroups() {
    await callApi('/groups/my');
}

async function createGroup() {
    const name = document.getElementById('group-name').value;
    const description = document.getElementById('group-desc').value;
    await callApi('/groups', 'POST', { name, description });
}

async function addUser() {
    const groupId = document.getElementById('target-group-id').value;
    const userId = document.getElementById('target-user-id').value;
    await callApi(`/groups/${groupId}/add-user`, 'POST', { userId });
}

// Schedule
async function getMySchedule() {
    await callApi('/schedule/my');
}

async function autoDistribute() {
    const groupId = document.getElementById('target-group-id').value;
    await callApi('/schedule/auto-distribute', 'POST', { groupId });
}

// Psalter
async function getPsalter() {
    const id = document.getElementById('psalter-id').value;
    await callApi(`/psalter/${id}?lang=ru`);
}

// Init
getMe();
