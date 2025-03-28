import React from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Login: React.FC = () => {
    const { login } = useAuth();
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center"
            >
                <h1 className="text-2xl font-bold text-gray-700 mb-4">Welcome to Kali</h1>
                <p className="text-gray-600 mb-6">Log in to continue</p>

                <button
                    onClick={login}
                    className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
                >
                    Login with Microsoft
                </button>
            </motion.div>
        </div>
    );
};

export default Login;