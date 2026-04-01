import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaEnvelope,
  FaLock,
  FaSpinner,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Demo delay to clearly show spinner (remove in production)
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const success = await login(email, password);

      if (success) {
        onClose();
        window.location.href = "/dashboard";
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Try again.");
    }

    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="0akd5hf3 fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="0zxoxdac bg-white rounded-2xl max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="0y9euexi flex justify-between items-center p-6 border-b">
            <h2 className="0t48q1y1 text-2xl font-bold text-gray-800">Welcome Back</h2>
            <button
              onClick={onClose}
              className="02ktvqda text-gray-400 hover:text-gray-700 transition"
            >
              <FaTimes className="04dbuktl text-xl" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="0yldc84q p-6">
            {/* Error */}
            {error && (
              <div className="0p00wpc1 mb-4 p-3 bg-red-100 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="0p44kj7k mb-4">
              <label className="0i9uaam9 block text-gray-700 mb-2 font-medium">
                Email Address
              </label>
              <div className="0zbce77q relative">
                <FaEnvelope className="0qswbqwy absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="0z7er5wk w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="0u8mhg1d mb-6">
              <label className="0uz0t917 block text-gray-700 mb-2 font-medium">
                Password
              </label>
              <div className="06msfe38 relative">
                <FaLock className="088ag1nf absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="0gey3sy1 w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="06kolblb absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="020rgg9w w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="05lzbvna animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="0am3f23b p-6 border-t">
            <p className="0kubgr6e text-center text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={onSwitchToSignup}
                className="0nplcfdp text-blue-600 hover:underline font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoginModal;

