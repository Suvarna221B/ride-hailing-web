import client from './client';

export const rideService = {
    requestRide: async (pickup, destination) => {
        const response = await client.post('/rides', {
            pickupLocation: pickup,
            dropoffLocation: destination
        });
        return response.data;
    },

    getRide: async (rideId) => {
        const response = await client.get(`/rides/${rideId}`);
        return response.data;
    },

    updateRideStatus: async (rideId, driverId, updateType) => {
        const response = await client.post(`/rides/${rideId}/update`, null, {
            params: { driverId, updateType }
        });
        return response.data;
    },

    processPayment: async (rideId, amount, paymentMethod) => {
        const response = await client.post(`/rides/${rideId}/payment`, { amount, paymentMethod });
        return response.data;
    }
};
