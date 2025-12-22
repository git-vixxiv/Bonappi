import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock user for development
const MOCK_USER = {
  id: 'user_001',
  email: 'joe@launchstudios.com',
  name: 'Joe',
  photo: null,
  phoneNumber: '+1234567890',
  createdAt: '2024-01-01T00:00:00Z',
  location: {
    city: 'Austin',
    state: 'TX',
  },
  dietaryPreferences: [],
  level: 'Food Explorer',
  totalVisits: 47,
  totalReviews: 32,
  regularRestaurants: [],
  achievements: [],
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session (mock implementation)
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('bonappi_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    // Mock login - in production, this would call Firebase Auth
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock successful login
      const userData = { ...MOCK_USER, email };
      setUser(userData);
      localStorage.setItem('bonappi_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    // Mock registration
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const userData = {
        ...MOCK_USER,
        id: `user_${Date.now()}`,
        email,
        name,
        totalVisits: 0,
        totalReviews: 0,
        createdAt: new Date().toISOString(),
      };
      setUser(userData);
      localStorage.setItem('bonappi_user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('bonappi_user');
  };

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('bonappi_user', JSON.stringify(updatedUser));
    return { success: true };
  };

  // Development helper: auto-login for easier testing
  const devLogin = () => {
    setUser(MOCK_USER);
    localStorage.setItem('bonappi_user', JSON.stringify(MOCK_USER));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    devLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
