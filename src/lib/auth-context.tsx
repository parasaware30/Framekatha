import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: { email: string } | null;
  profile: { fullName: string; photoUrl?: string } | null;
  isAdmin: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string } | null>(() => {
    const saved = localStorage.getItem('fk_user');
    return saved ? JSON.parse(saved) : { email: 'client@framekatha.com' };
  });

  const [profile, setProfile] = useState<{ fullName: string; photoUrl?: string } | null>(() => {
    const saved = localStorage.getItem('fk_profile');
    return saved ? JSON.parse(saved) : { fullName: 'Paras Sharma', photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' };
  });

  const isAdmin = Boolean(user?.email && (user.email.includes('admin') || user.email.includes('paras')));

  useEffect(() => {
    if (user) localStorage.setItem('fk_user', JSON.stringify(user));
    else localStorage.removeItem('fk_user');
  }, [user]);

  useEffect(() => {
    if (profile) localStorage.setItem('fk_profile', JSON.stringify(profile));
    else localStorage.removeItem('fk_profile');
  }, [profile]);

  const loginWithEmail = async (email: string) => {
    setUser({ email });
    setProfile({ fullName: email.split('@')[0], photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' });
  };

  const registerWithEmail = async (email: string, _pass: string, name: string) => {
    setUser({ email });
    setProfile({ fullName: name, photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' });
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, isAdmin, loginWithEmail, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
