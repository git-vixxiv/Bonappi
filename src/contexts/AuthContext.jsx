import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

// Until location and gamification are wired up, every diner starts in Austin
// with zeroed stats.
function toAppUser(authUser, profile) {
  if (!authUser) return null;
  return {
    id: authUser.id,
    email: authUser.email ?? null,
    phone: authUser.phone ?? null,
    name: profile?.display_name || '',
    photo: null,
    location: { city: 'Austin', state: 'TX' },
    totalVisits: 0,
    totalReviews: 0,
    regularRestaurants: [],
    achievements: [],
  };
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', userId)
      .maybeSingle();
    setProfile(data);
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setAuthUser(nextUser);
      // Defer the query so it doesn't run inside Supabase's auth callback
      setTimeout(() => {
        loadProfile(nextUser?.id).finally(() => setLoading(false));
      }, 0);
    });
    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  // Step 1: send a one-time code by text (phone) or email
  const sendCode = async ({ phone, email }) => {
    const { error } = phone
      ? await supabase.auth.signInWithOtp({ phone })
      : await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: window.location.origin },
        });
    return error ? { success: false, error: error.message } : { success: true };
  };

  // Step 2: verify the code
  const verifyCode = async ({ phone, email, token }) => {
    const { error } = phone
      ? await supabase.auth.verifyOtp({ phone, token, type: 'sms' })
      : await supabase.auth.verifyOtp({ email, token, type: 'email' });
    return error ? { success: false, error: error.message } : { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateProfile = async ({ name }) => {
    if (!authUser) return { success: false, error: 'Not signed in' };
    const { data, error } = await supabase
      .from('profiles')
      .update({ display_name: name, updated_at: new Date().toISOString() })
      .eq('id', authUser.id)
      .select('display_name')
      .single();
    if (error) return { success: false, error: error.message };
    setProfile(data);
    return { success: true };
  };

  const value = {
    user: toAppUser(authUser, profile),
    loading,
    isAuthenticated: !!authUser,
    needsName: !!authUser && !profile?.display_name,
    sendCode,
    verifyCode,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
