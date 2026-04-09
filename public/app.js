const log = (status, data) => {
    document.getElementById('response-status').innerText = status;
    document.getElementById('response-output').innerText = JSON.stringify(data, null, 2);
};

const callApi = async (url, method = 'GET', body = null) => {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        };
        if (body) options.body = JSON.stringify(body);
        
        const response = await fetch('/api' + url, options);
        const data = await response.json().catch(() => ({}));
        
        log(`${method} /api${url} - ${response.status}`, data);
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
    } else {
        document.getElementById('user-info').innerText = 'Не авторизован';
    }
}

// Groups
async function getMyGroups() {
    await callApi('/groups');
}

async function getGroupById() {
    const id = document.getElementById('group-id-input').value;
    if (!id) return alert('Введите ID группы');
    await callApi(`/groups/${id}`);
}

async function createGroup() {
    const name = document.getElementById('group-name').value;
    const isLostListEnabled = document.getElementById('group-lost-enabled').checked;
    const rotationType = document.getElementById('group-rotation').value;
    const startDate = document.getElementById('group-start-date').value || undefined;
    await callApi('/groups', 'POST', { name, isLostListEnabled, rotationType, startDate });
}

async function updateGroup() {
    const id = document.getElementById('group-id-input').value;
    if (!id) return alert('Введите ID группы');
    const name = document.getElementById('group-name').value || undefined;
    const isLostListEnabled = document.getElementById('group-lost-enabled').checked;
    const rotationType = document.getElementById('group-rotation').value;
    const startDate = document.getElementById('group-start-date').value || undefined;
    await callApi(`/groups/${id}`, 'PATCH', { name, isLostListEnabled, rotationType, startDate });
}

async function getTodayKathisma() {
    const id = document.getElementById('group-id-input').value;
    if (!id) return alert('Введите ID группы');
    await callApi(`/assignments/${id}/today`);
}

async function getSchedule() {
    const id = document.getElementById('group-id-input').value;
    if (!id) return alert('Введите ID группы');
    await callApi(`/assignments/${id}/schedule?days=30`);
}

async function getFullSchedule() {
    const id = document.getElementById('group-id-input').value;
    if (!id) return alert('Введите ID группы');
    await callApi(`/assignments/${id}/debug-full-schedule?days=7`);
}

// Names
async function getGroupNames() {
    const id = document.getElementById('group-id-input').value;
    if (!id) return alert('Введите ID группы');
    await callApi(`/groups/${id}/names`);
}

async function getMyNamesInGroup() {
    const id = document.getElementById('group-id-input').value;
    if (!id) return alert('Введите ID группы');
    const data = await callApi(`/groups/${id}/my-names`);
    if (data) {
        document.getElementById('my-health-names').value = (data.healthNames || []).join(', ');
        document.getElementById('my-repose-names').value = (data.reposeNames || []).join(', ');
        document.getElementById('my-lost-names').value = (data.lostNames || []).join(', ');
    }
}

async function updateMyNames() {
    const id = document.getElementById('group-id-input').value;
    if (!id) return alert('Введите ID группы');
    
    const healthNames = document.getElementById('my-health-names').value.split(',').map(s => s.trim()).filter(s => s);
    const reposeNames = document.getElementById('my-repose-names').value.split(',').map(s => s.trim()).filter(s => s);
    const lostNames = document.getElementById('my-lost-names').value.split(',').map(s => s.trim()).filter(s => s);
    
    await callApi(`/groups/${id}/my-names`, 'PATCH', { healthNames, reposeNames, lostNames });
}

// Admin
async function addUser() {
    const groupId = document.getElementById('group-id-input').value;
    const userId = document.getElementById('target-user-id').value;
    if (!groupId || !userId) return alert('Нужны ID группы и ID пользователя');
    await callApi(`/groups/${groupId}/admin/add-user`, 'POST', { userId });
}

async function getGroupMembers() {
    const groupId = document.getElementById('group-id-input').value;
    if (!groupId) return alert('Введите ID группы');
    await callApi(`/groups/${groupId}/admin/members`);
}

// Assignments
async function getAssignments() {
    await callApi('/assignments');
}

// Init
getMe();
