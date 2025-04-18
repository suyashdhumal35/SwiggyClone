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

    const handleLogin = async (e) => {
        e.preventDefault();
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
                throw new Error(data.message || "Login failed");
            }

            if (data.user) {
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
        <div className="flex justify-center items-center min-h-screen bg-[#1f293a] font-['Poppins']">
            {/* Animated background circles */}
            <div className="relative w-80 h-80 flex justify-center items-center">
                {[...Array(50)].map((_, i) => (
                    <span
                        key={i}
                        className="absolute left-[-40px] w-9 h-2 bg-[#2c4766] rounded-lg origin-[215px] scale-[2.8]"
                        style={{
                            transform: `translateX(-50%) rotate(calc(${i} * (360deg/50)))`,
                            animation: `blink 3s linear infinite`,
                            animationDelay: `calc(${i} * (3s/50))`,
                        }}
                    ></span>
                ))}
            </div>

            {/* Login form */}
            <div className="absolute w-[400px]">
                <form onSubmit={handleLogin} className="w-full px-12">
                    <h2 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#0ef] to-[#0af] text-center mb-4">
                        Login
                    </h2>

                    {error && (
                        <div className="mb-4 p-2 text-red-500 text-center bg-red-100 rounded">
                            {error}
                        </div>
                    )}

                    {/* Email input */}
                    <div className="relative my-4 group">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 bg-transparent border-0 border-b-2 border-[#2c4766] outline-none text-white px-0 text-base transition-all duration-300 focus:border-b-2 focus:border-transparent peer"
                            required
                        />
                        <label className="absolute left-0 top-3 text-[#2c4766] text-base pointer-events-none transition-all duration-300 
                            peer-valid:-top-2 peer-valid:text-sm peer-valid:text-[#0ef]
                            peer-focus:-top-2 peer-focus:text-sm peer-focus:text-transparent peer-focus:bg-clip-text peer-focus:bg-gradient-to-r peer-focus:from-[#0ef] peer-focus:to-[#0af]">
                            Email
                        </label>
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#0ef] to-[#0af] transition-all duration-300 peer-focus:w-full"></span>
                    </div>

                    {/* Password input */}
                    <div className="relative group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 bg-transparent border-0 border-b-2 border-[#2c4766] outline-none text-white px-0 text-base transition-all duration-300 focus:border-b-2 focus:border-transparent peer"
                            required
                        />
                        <label className="absolute left-0 top-3 text-[#2c4766] text-base pointer-events-none transition-all duration-300 
                            peer-valid:-top-2 peer-valid:text-sm peer-valid:text-[#0ef]
                            peer-focus:-top-2 peer-focus:text-sm peer-focus:text-transparent peer-focus:bg-clip-text peer-focus:bg-gradient-to-r peer-focus:from-[#0ef] peer-focus:to-[#0af]">
                            Password
                        </label>
                        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-[#0ef] to-[#0af] transition-all duration-300 peer-focus:w-full"></span>
                    </div>

                    {/* Login button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-8 w-full h-11 bg-gradient-to-r from-[#0ef] to-[#0af] border-none rounded-full cursor-pointer text-lg font-semibold text-[#1f293a] hover:opacity-90 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#0ef]/30 hover:shadow-[#0ef]/50"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>

                    {/* Signup link */}
                    <div className="text-center mt-4">
                        <a
                            href="/signup"
                            className="text-[#0af] no-underline font-semibold hover:opacity-80 transition-all duration-200"
                        >
                            Don't have an account? Sign Up
                        </a>
                    </div>
                </form>
            </div>

            {/* Add the animation keyframes to the document */}
            <style jsx global>{`
                @keyframes blink {
                    0% {
                        background: #0ef;
                    }
                    25% {
                        background: #2c4766;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;