import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { rideService } from '../api/rideService';
import { Navigation, CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DriverDashboard = () => {
    const { user } = useAuth();
    const [rideId, setRideId] = useState('');
    const [driverId, setDriverId] = useState('');
    const [actionResult, setActionResult] = useState(null);

    // Mutation to accept a ride
    const acceptRideMutation = useMutation({
        mutationFn: () => rideService.updateRideStatus(rideId, driverId, 'ACCEPT'),
        onSuccess: () => {
            setActionResult({ type: 'success', message: `Ride #${rideId} accepted successfully!` });
            setRideId('');
        },
        onError: (error) => {
            setActionResult({ type: 'error', message: error.response?.data?.message || 'Failed to accept ride' });
        }
    });

    // Mutation to start a ride
    const startRideMutation = useMutation({
        mutationFn: () => rideService.updateRideStatus(rideId, driverId, 'START'),
        onSuccess: () => {
            setActionResult({ type: 'success', message: `Ride #${rideId} started!` });
            setRideId('');
        },
        onError: (error) => {
            setActionResult({ type: 'error', message: error.response?.data?.message || 'Failed to start ride' });
        }
    });

    // Mutation to complete a ride
    const completeRideMutation = useMutation({
        mutationFn: () => rideService.updateRideStatus(rideId, driverId, 'COMPLETE'),
        onSuccess: () => {
            setActionResult({ type: 'success', message: `Ride #${rideId} completed!` });
            setRideId('');
        },
        onError: (error) => {
            setActionResult({ type: 'error', message: error.response?.data?.message || 'Failed to complete ride' });
        }
    });

    const handleAccept = (e) => {
        e.preventDefault();
        acceptRideMutation.mutate();
    };

    const handleStart = (e) => {
        e.preventDefault();
        startRideMutation.mutate();
    };

    const handleComplete = (e) => {
        e.preventDefault();
        completeRideMutation.mutate();
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Driver Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.username}</p>
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    Online
                </div>
            </header>

            {actionResult && (
                <div className={`mb-6 p-4 rounded-lg ${actionResult.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <div className="flex items-center gap-2">
                        {actionResult.type === 'success' && <CheckCircle size={20} />}
                        <p>{actionResult.message}</p>
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Ride Actions</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ride ID</label>
                            <input
                                type="number"
                                value={rideId}
                                onChange={(e) => setRideId(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="Enter ride ID"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Driver ID</label>
                            <input
                                type="number"
                                value={driverId}
                                onChange={(e) => setDriverId(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="Enter your driver ID"
                            />
                        </div>

                        <div className="space-y-2">
                            <button
                                onClick={handleAccept}
                                disabled={!rideId || !driverId || acceptRideMutation.isPending}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {acceptRideMutation.isPending ? <Loader className="animate-spin" size={20} /> : <Navigation size={20} />}
                                Accept Ride
                            </button>

                            <button
                                onClick={handleStart}
                                disabled={!rideId || !driverId || startRideMutation.isPending}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {startRideMutation.isPending ? <Loader className="animate-spin" size={20} /> : <Navigation size={20} />}
                                Start Ride
                            </button>

                            <button
                                onClick={handleComplete}
                                disabled={!rideId || !driverId || completeRideMutation.isPending}
                                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-semibold transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {completeRideMutation.isPending ? <Loader className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                Complete Ride
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                    <div className="space-y-3 text-sm text-gray-600">
                        <p><strong>1. Accept Ride:</strong> Enter the ride ID from a ride request notification and your driver ID, then click "Accept Ride"</p>
                        <p><strong>2. Start Ride:</strong> Once you've picked up the rider, enter the ride ID and click "Start Ride"</p>
                        <p><strong>3. Complete Ride:</strong> When you reach the destination, enter the ride ID and click "Complete Ride"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDashboard;
