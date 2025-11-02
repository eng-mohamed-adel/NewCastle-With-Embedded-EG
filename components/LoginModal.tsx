
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LoginModalProps {
  onSubmit: (password: string) => void;
  error: string;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onSubmit, error, onClose }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(password);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <motion.div
                initial={{ y: -50, scale: 0.9 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 50, scale: 0.9 }}
                transition={{ type: 'spring', damping: 15 }}
                className="bg-gradient-to-br from-[#0e2a57] to-[#030b19] border border-white/10 rounded-xl shadow-2xl p-8 max-w-sm w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-center text-sky-300 mb-4">Admin Access</h2>
                <p className="text-center text-sky-200/80 mb-6">Please enter the password to manage the leaderboard.</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="admin-password" className="sr-only">Admin Password</label>
                    <input
                        id="admin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        autoFocus
                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-gray-400 transition-all text-white"
                    />
                    {error && <p className="text-red-400 text-sm mt-2 text-center" role="alert">{error}</p>}
                    <button
                        type="submit"
                        className="mt-6 w-full relative inline-flex items-center justify-center px-6 py-3 overflow-hidden font-medium tracking-tighter text-white bg-sky-600 rounded-lg group transition-all duration-300 ease-out transform active:scale-95 disabled:opacity-50"
                    >
                        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-sky-400 rounded-full group-hover:w-full group-hover:h-full"></span>
                        <span className="relative">Login</span>
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default LoginModal;
