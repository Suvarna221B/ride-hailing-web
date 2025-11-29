import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { rideService } from '../api/rideService';
import { MapPin, Clock, CreditCard, CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RiderDashboard = () => {
    const { user } = useAuth();
    const [pickup, setPickup] = useState({ lat: 40.7128, lng: -74.0060 });
    const [dropoff, setDropoff] = useState({ lat: 40.7589, lng: -73.9851 });
    const [activeRideId, setActiveRideId] = useState(null);

    // Mutation to request a ride
    const requestRideMutation = useMutation({
        mutationFn: () => rideService.requestRide(
            { latitude: pickup.lat, longitude: pickup.lng },
            { latitude: dropoff.lat, longitude: dropoff.lng }
        ),
        onSuccess: (data) => {
            setActiveRideId(data.rideId);
        },
    });

    // Poll for ride status every 3 seconds
    const { data: ride, isLoading } = useQuery({
        queryKey: ['ride', activeRideId],
        queryFn: () => rideService.getRide(activeRideId),
        enabled: !!activeRideId,
        refetchInterval: (data) => {
            if (data?.status === 'COMPLETED' || data?.status === 'CANCELLED') return false;
            return 3000; // Poll every 3 seconds
        },
    });

    const handleRequestRide = (e) => {
        e.preventDefault();
        requestRideMutation.mutate();
    };

    const handlePayment = () => {
        rideService.processPayment(activeRideId, ride.fare, 'CASH')
            .then(() => {
                // Polling will pick up the status change
            });
    };

    if (activeRideId && ride) {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Ride Status</h2>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold
              ${ride.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                ride.status === 'PAYMENT_PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-blue-100 text-blue-800'}`}>
                            {ride.status === 'IN_PROGRESS' && <Loader className="animate-spin" size={16} />}
                            {ride.status}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Destination</p>
                                <p className="font-medium">{ride.dropoffLocation?.latitude.toFixed(4)}, {ride.dropoffLocation?.longitude.toFixed(4)}</p>
                            </div>
                        </div>

                        {ride.driverId && (
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white">
                                    D
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Driver Assigned</p>
                                    <p className="font-medium">Driver #{ride.driverId}</p>
                                </div>
                            </div>
                        )}

                        {ride.status === 'PAYMENT_PENDING' && (
                            <div className="mt-6">
                                <div className="text-center mb-4">
                                    <p className="text-gray-600">Total Fare</p>
                                    <p className="text-4xl font-bold text-gray-900">${ride.fare?.toFixed(2)}</p>
                                </div>
                                <button
                                    onClick={handlePayment}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <CreditCard size={24} />
                                    Pay Now
                                </button>
                            </div>
                        )}

                        {ride.status === 'COMPLETED' && (
                            <div className="text-center py-6">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-800">Ride Completed</h3>
                                <p className="text-gray-600 mb-6">Thank you for riding with us!</p>
                                <button
                                    onClick={() => setActiveRideId(null)}
                                    className="text-blue-600 font-medium hover:underline"
                                >
                                    Book Another Ride
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Where to?</h1>
                <p className="text-gray-600">Request a ride to get started</p>
            </header>

            <div className="bg-white rounded-xl shadow-lg p-8">
                <form onSubmit={handleRequestRide} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pickup Location</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                step="any"
                                value={pickup.lat}
                                onChange={(e) => setPickup({ ...pickup, lat: parseFloat(e.target.value) })}
                                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="Latitude"
                                required
                            />
                            <input
                                type="number"
                                step="any"
                                value={pickup.lng}
                                onChange={(e) => setPickup({ ...pickup, lng: parseFloat(e.target.value) })}
                                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="Longitude"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                step="any"
                                value={dropoff.lat}
                                onChange={(e) => setDropoff({ ...dropoff, lat: parseFloat(e.target.value) })}
                                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="Latitude"
                                required
                            />
                            <input
                                type="number"
                                step="any"
                                value={dropoff.lng}
                                onChange={(e) => setDropoff({ ...dropoff, lng: parseFloat(e.target.value) })}
                                className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="Longitude"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={requestRideMutation.isPending}
                        className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {requestRideMutation.isPending ? (
                            <Loader className="animate-spin" />
                        ) : (
                            'Request Ride'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RiderDashboard;
