// src/services/authService.js
export const authService = {
    login: async (email, password) => {
        const response = await fetch('http://localhost:8082/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        // 🔥 Stockage correct du token et rôle
        if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role);
        }

        return data;
    },

    register: async (userData) => {
        const response = await fetch('http://localhost:8082/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        return await response.json();
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
    },

    getToken: () => localStorage.getItem('token'),
    isAuthenticated: () => !!localStorage.getItem('token')
};
