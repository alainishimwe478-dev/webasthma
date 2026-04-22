// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is logged in on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const userData = localStorage.getItem('userData');
            
            if (token && userData) {
                setUser(JSON.parse(userData));
            }
        } catch (err) {
            console.error('Auth check failed:', err);
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            
            // Replace with your actual API call
            const response = await mockLoginAPI(email, password);
            
            if (response.success) {
                const userData = response.user;
                const token = response.token;
                
                // Store in localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('userData', JSON.stringify(userData));
                
                setUser(userData);
                return { success: true };
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            
            // Replace with your actual API call
            const response = await mockRegisterAPI(userData);
            
            if (response.success) {
                const token = response.token;
                const newUser = response.user;
                
                localStorage.setItem('authToken', token);
                localStorage.setItem('userData', JSON.stringify(newUser));
                
                setUser(newUser);
                return { success: true };
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
        setError(null);
    };

    // Update user profile
    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
    };

    // Mock API functions (replace with real API calls)
    const mockLoginAPI = (email, password) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (email && password) {
                    resolve({
                        success: true,
                        user: {
                            id: '123',
                            name: 'John Doe',
                            email: email,
                            role: 'patient',
                            asthmaSeverity: 'moderate'
                        },
                        token: 'mock-jwt-token-12345'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Invalid credentials'
                    });
                }
            }, 1000);
        });
    };

    const mockRegisterAPI = (userData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    user: {
                        id: Date.now().toString(),
                        ...userData,
                        role: 'patient'
                    },
                    token: 'mock-jwt-token-' + Date.now()
                });
            }, 1000);
        });
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isPatient: user?.role === 'patient',
        isDoctor: user?.role === 'doctor'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Export context for direct use if needed
export default AuthContext;