import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, User, Shield } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('RIDER');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password, role);
            navigate('/');
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="bg-black p-8 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Ride Hailing</h1>
                    <p className="text-gray-400">Enter your details to continue</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setRole('RIDER')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all
                    ${role === 'RIDER'
                                            ? 'border-black bg-gray-50 text-black'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                >
                                    <User size={24} />
                                    <span className="font-medium">Rider</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole('DRIVER')}
                                    className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all
                    ${role === 'DRIVER'
                                            ? 'border-black bg-gray-50 text-black'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                >
                                    <Car size={24} />
                                    <span className="font-medium">Driver</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="Enter username"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="Enter password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-xl font-bold text-lg transition-colors"
                        >
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
