import client from './client';

export const driverService = {
    updateLocation: async (latitude, longitude) => {
        const response = await client.put('/drivers/location', { latitude, longitude });
        return response.data;
    },

    getProfile: async () => {
        const response = await client.get('/drivers/profile');
        return response.data;
    }
};
