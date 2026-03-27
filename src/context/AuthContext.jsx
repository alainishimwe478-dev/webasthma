import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

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
    // Demo authentication - accept any password for demo
    const demoUsers = {
      'patient@asthmashield.com': { 
        id: 1, 
        name: 'John Doe', 
        email: 'patient@asthmashield.com', 
        role: 'patient', 
        triggerProfile: ['pollen', 'dust'], 
        medicationRegimen: [
          { name: 'Albuterol', dosage: '2 puffs', frequency: 'As needed' },
          { name: 'Fluticasone', dosage: '1 puff', frequency: 'Twice daily' }
        ] 
      },
      'doctor@asthmashield.com': { 
        id: 2, 
        name: 'Dr. Sarah Johnson', 
        email: 'doctor@asthmashield.com', 
        role: 'doctor', 
        specialty: 'Pulmonology' 
      },
      'admin@asthmashield.com': { 
        id: 3, 
        name: 'Admin User', 
        email: 'admin@asthmashield.com', 
        role: 'admin' 
      }
    };

    if (demoUsers[email]) {
      const userData = demoUsers[email];
      localStorage.setItem('asthma_user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      toast.success('Login successful! Welcome to Asthma Shield.');
      return true;
    } else {
      toast.error('Invalid email. Use demo accounts shown below.');
      return false;
    }
  };

  const signup = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      role: userData.role || 'patient'
    };
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
