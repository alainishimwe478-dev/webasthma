import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { addManagedUser, getUsers } from '../utils/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('asthma_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = getUsers().find(
      (account) => account.email?.toLowerCase() === normalizedEmail,
    );

    if (matchedUser && (!matchedUser.password || matchedUser.password === password)) {
      const userData = matchedUser;
      localStorage.setItem('asthma_user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      toast.success('Login successful! Welcome to Asthma Shield.');
      return true;
    } else {
      toast.error('Invalid email or password.');
      return false;
    }
  };

  const signup = (userData) => {
    const newUser = addManagedUser({
      ...userData,
      role: userData.role || 'patient'
    });
    localStorage.setItem('asthma_user', JSON.stringify(newUser));
    setUser(newUser);
    setIsAuthenticated(true);
    toast.success('Account created successfully!');
    return true;
  };

  const logout = () => {
    localStorage.removeItem('asthma_user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const updateUser = (updates) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('asthma_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
