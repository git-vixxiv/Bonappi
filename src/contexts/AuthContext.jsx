import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

const AuthContext = createContext(null);

// Default user profile structure
const createUserProfile = (firebaseUser, additionalData = {}) => ({
  id: firebaseUser.uid,
  email: firebaseUser.email,
  name: firebaseUser.displayName || additionalData.name || 'Guest',
  photo: firebaseUser.photoURL,
  phoneNumber: firebaseUser.phoneNumber,
  createdAt: new Date().toISOString(),
  location: {
    city: '',
    state: '',
  },
  dietaryPreferences: [],
  level: 'Food Explorer',
  totalVisits: 0,
  totalReviews: 0,
  regularRestaurants: [],
  achievements: [],
  ...additionalData,
});

// Mock user for development (when Firebase is not configured)
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

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  try {
    return auth && !auth.app.options.apiKey?.includes('your-');
  } catch {
    return false;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseEnabled, setFirebaseEnabled] = useState(false);

  useEffect(() => {
    const configured = isFirebaseConfigured();
    setFirebaseEnabled(configured);

    if (configured) {
      // Listen for Firebase auth state changes
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          // Get additional user data from Firestore
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              setUser({ ...userDoc.data(), id: firebaseUser.uid });
            } else {
              // Create user profile if it doesn't exist
              const profile = createUserProfile(firebaseUser);
              await setDoc(doc(db, 'users', firebaseUser.uid), profile);
              setUser(profile);
            }
          } catch (error) {
            // Firestore might not be set up, use basic profile
            console.warn('Firestore not available, using basic profile');
            setUser(createUserProfile(firebaseUser));
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Fallback to localStorage for development
      const savedUser = localStorage.getItem('bonappi_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }
  }, []);

  // Email/Password login
  const login = async (email, password) => {
    setLoading(true);
    try {
      if (firebaseEnabled) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: result.user };
      } else {
        // Mock login for development
        await new Promise((resolve) => setTimeout(resolve, 500));
        const userData = { ...MOCK_USER, email };
        setUser(userData);
        localStorage.setItem('bonappi_user', JSON.stringify(userData));
        return { success: true };
      }
    } catch (error) {
      let message = 'Login failed. Please try again.';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      }
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Google sign-in
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      if (firebaseEnabled) {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;

        // Check if user exists in Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (!userDoc.exists()) {
            // Create new user profile
            const profile = createUserProfile(firebaseUser);
            await setDoc(doc(db, 'users', firebaseUser.uid), profile);
          }
        } catch (error) {
          console.warn('Firestore not available for user profile');
        }

        return { success: true, user: firebaseUser };
      } else {
        // Mock Google login for development
        await new Promise((resolve) => setTimeout(resolve, 500));
        const userData = {
          ...MOCK_USER,
          email: 'user@gmail.com',
          name: 'Google User',
          photo: 'https://lh3.googleusercontent.com/a/default-user',
        };
        setUser(userData);
        localStorage.setItem('bonappi_user', JSON.stringify(userData));
        return { success: true };
      }
    } catch (error) {
      let message = 'Google sign-in failed. Please try again.';
      if (error.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in was cancelled.';
      } else if (error.code === 'auth/popup-blocked') {
        message = 'Pop-up was blocked. Please allow pop-ups for this site.';
      }
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Email/Password registration
  const register = async (email, password, name) => {
    setLoading(true);
    try {
      if (firebaseEnabled) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = result.user;

        // Update display name
        await firebaseUpdateProfile(firebaseUser, { displayName: name });

        // Create user profile in Firestore
        try {
          const profile = createUserProfile(firebaseUser, { name });
          await setDoc(doc(db, 'users', firebaseUser.uid), profile);
        } catch (error) {
          console.warn('Firestore not available for user profile');
        }

        return { success: true, user: firebaseUser };
      } else {
        // Mock registration
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
      }
    } catch (error) {
      let message = 'Registration failed. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address.';
      }
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (firebaseEnabled) {
        await signOut(auth);
      }
      setUser(null);
      localStorage.removeItem('bonappi_user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Update profile
  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: 'Not authenticated' };

    try {
      if (firebaseEnabled) {
        // Update Firestore
        try {
          await updateDoc(doc(db, 'users', user.id), updates);
        } catch (error) {
          console.warn('Firestore update failed');
        }
      }

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('bonappi_user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
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
    firebaseEnabled,
    login,
    loginWithGoogle,
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
