import client from './client';

export const authService = {
    login: async (username, password, role) => {
        const response = await client.post('/auth/login', { username, password, role });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({ username, role }));
        }
        return response.data;
    },

    register: async (username, password, role) => {
        const response = await client.post('/users/register', { username, password, role });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    },
};
