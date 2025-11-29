import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DriverDashboard from '../components/DriverDashboard';
import { AuthProvider } from '../context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rideService } from '../api/rideService';
import { driverService } from '../api/driverService';

// Mock dependencies
vi.mock('../api/rideService');
vi.mock('../api/driverService');
vi.mock('../context/AuthContext', async () => {
    const actual = await vi.importActual('../context/AuthContext');
    return {
        ...actual,
        useAuth: () => ({ user: { username: 'TestDriver', role: 'DRIVER' } }),
    };
});

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

describe('DriverDashboard', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        rideService.getAvailableRides.mockResolvedValue([]);
        driverService.updateLocation.mockResolvedValue({});
    });

    it('renders driver dashboard with welcome message', () => {
        renderWithProviders(<DriverDashboard />);
        expect(screen.getByText(/Welcome back, TestDriver/i)).toBeInTheDocument();
        expect(screen.getByText(/Online/i)).toBeInTheDocument();
    });

    it('displays available rides when fetched', async () => {
        const mockRides = [
            {
                id: 1,
                pickupLocation: { latitude: 40.71, longitude: -74.00 },
                dropoffLocation: { latitude: 40.75, longitude: -73.98 },
                status: 'REQUESTED',
            },
        ];
        rideService.getAvailableRides.mockResolvedValue(mockRides);

        renderWithProviders(<DriverDashboard />);

        await waitFor(() => {
            expect(screen.getByText(/RIDE #1/i)).toBeInTheDocument();
        });
        expect(screen.getByText(/Accept/i)).toBeInTheDocument();
    });

    it('calls acceptRide when accept button is clicked', async () => {
        const mockRides = [
            {
                id: 1,
                pickupLocation: { latitude: 40.71, longitude: -74.00 },
                dropoffLocation: { latitude: 40.75, longitude: -73.98 },
                status: 'REQUESTED',
            },
        ];
        const mockAcceptedRide = { ...mockRides[0], status: 'ASSIGNED' };

        rideService.getAvailableRides.mockResolvedValue(mockRides);
        rideService.acceptRide.mockResolvedValue(mockAcceptedRide);

        renderWithProviders(<DriverDashboard />);

        await waitFor(() => {
            expect(screen.getByText(/Accept/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText(/Accept/i));

        await waitFor(() => {
            expect(rideService.acceptRide).toHaveBeenCalledWith(1);
        });
    });

    it('shows active ride view when a ride is accepted', async () => {
        const mockActiveRide = {
            id: 1,
            pickupLocation: { latitude: 40.71, longitude: -74.00 },
            dropoffLocation: { latitude: 40.75, longitude: -73.98 },
            status: 'ASSIGNED',
            fare: { amount: 25.50 },
            riderId: 101
        };

        // Setup initial state with an active ride by mocking the mutation success
        // Or simpler: we can just test the rendering logic if we mock the state. 
        // But since we can't easily mock internal state, we'll simulate the flow.

        rideService.getAvailableRides.mockResolvedValue([{ id: 1, status: 'REQUESTED' }]);
        rideService.acceptRide.mockResolvedValue(mockActiveRide);

        renderWithProviders(<DriverDashboard />);

        await waitFor(() => screen.getByText('Accept'));
        fireEvent.click(screen.getByText('Accept'));

        await waitFor(() => {
            expect(rideService.acceptRide).toHaveBeenCalled();
        });

        await waitFor(() => {
            expect(screen.getByText('Current Ride')).toBeInTheDocument();
            expect(screen.getByText('Start Ride')).toBeInTheDocument();
        });
    });
});
