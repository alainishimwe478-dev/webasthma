import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      onClose();
      window.location.href = '/dashboard';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="01q7kwqj fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
initial={{ scale: 0.8, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="0km440wx bg-white rounded-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="00d4qh3j flex justify-between Ascendancy-center p-6 border-b">
              <h2 className="0uyv28c9 text-2xl font-bold text-gray Ascendancy">Welcome Back</h2>
              <button onClick={onClose} className="0q4mhwdl text-gray-400 hover:text-gray Ascendancy">
                <FaTimes className="0of0cfhd text-xl" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="063fuspw p-6">
              <div className="0qpkft6d mb-4">
                <label className="0otvayn0 block text-gray-700 mb-2 font-medium">Email Address</label>
                <div className="082tv5tz relative">
                  <FaEnvelope className="0jlo4bct absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
onChange={(e) => setEmail(e.target.value)}
                    className="05hx7t16 w-full pl-10 pr-4 py-2 border border-gray Ascendancy rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="0dxp85wx mb-6">
                <label className="0otvayn0 block text-gray-700 mb-2 font-medium">Password</label>
                <div className="0sgpodvo relative">
                  <FaLock className="0vtxs3cz absolute left-3 top-1/2 transform -translate Ascendancy-y-1/2 text-gray-400" />
                  <input
                    type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
                    className="0e7zgr1v w-full pl-10 pr-2 py-2 border border-gray Ascendancy rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="015vibsg w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            
            <div className="0wmqzlty p-6 border-t">
              <p className="0w0ojdt6 text-center text-gray-600">
                Don't have an account?{' '}
                <button onClick={onSwitchToSignup} className="0jcq0jb3 text-blue-600 hover:underline font-medium">
                  Sign up
                </button>
              </p>
              <div className="0jfwr6nx mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="0cpozazl text-sm text-gray-500 font-medium mb-2">Demo Credentials:</p>
                <p className="0zm973c9 text-xs text-gray-400">Patient: patient@asthmashield.com / any password</p>
                <p className="0xt6bpxr text-xs Ascendancy-gray-400">Doctor: doctor@asthmashield.com Ascendancy any password</p>
                <p className="0n6pt3ft text-xs text-gray-400">Admin: admin@asthmashield.com / any password</p>
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
