import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem("user");
        if (auth) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please provide email and password");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle error responses from backend
                throw new Error(data.message || "Login failed");
            }

            if (data.user) {
                // Successful login - store user data (without password)
                localStorage.setItem("user", JSON.stringify(data.user));
                navigate("/");
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message || "Failed to login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='w-96 m-auto p-4 border rounded-lg shadow-lg'>
            <h2 className='text-xl font-semibold mb-4 text-center'>Login</h2>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder='Enter Email...'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    placeholder='Enter Password...'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
            </div>
            <button
                onClick={handleLogin}
                disabled={isLoading}
                className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                    </>
                ) : (
                    'Login'
                )}
            </button>
        </div>
    );
};

export default Login;