import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RiderDashboard from '../components/RiderDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rideService } from '../api/rideService';

// Mock dependencies
vi.mock('../api/rideService');
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({ user: { username: 'TestRider', role: 'RIDER' } }),
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const renderWithProviders = (ui) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

describe('RiderDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders request ride form initially', () => {
        renderWithProviders(<RiderDashboard />);
        expect(screen.getByText(/Where to\?/i)).toBeInTheDocument();
        expect(screen.getByText(/Request Ride/i)).toBeInTheDocument();
    });

    it('submits ride request and shows status', async () => {
        const mockRide = {
            id: 123,
            status: 'REQUESTED',
            pickupLocation: { latitude: 40.71, longitude: -74.00 },
            dropoffLocation: { latitude: 40.75, longitude: -73.98 },
        };

        rideService.requestRide.mockResolvedValue(mockRide);
        rideService.getRide.mockResolvedValue(mockRide);

        renderWithProviders(<RiderDashboard />);

        fireEvent.click(screen.getByText(/Request Ride/i));

        await waitFor(() => {
            expect(screen.getByText(/Ride Status/i)).toBeInTheDocument();
            expect(screen.getByText(/REQUESTED/i)).toBeInTheDocument();
        });
    });

    it('shows payment button when status is PAYMENT_PENDING', async () => {
        const mockRide = {
            id: 123,
            status: 'PAYMENT_PENDING',
            pickupLocation: { latitude: 40.71, longitude: -74.00 },
            dropoffLocation: { latitude: 40.75, longitude: -73.98 },
            fare: { amount: 25.00 }
        };

        rideService.requestRide.mockResolvedValue(mockRide);
        rideService.getRide.mockResolvedValue(mockRide);

        renderWithProviders(<RiderDashboard />);

        // Simulate already having requested a ride by triggering the mutation
        fireEvent.click(screen.getByText(/Request Ride/i));

        await waitFor(() => {
            expect(screen.getByText(/\$25.00/i)).toBeInTheDocument();
            expect(screen.getByText(/Pay Now/i)).toBeInTheDocument();
        });
    });
});
