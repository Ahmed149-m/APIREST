import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '../api/client';

type AuthContextValue = {
  token: string | null;
  username: string | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadSession() {
    try {
      const storedToken = await SecureStore.getItemAsync('jwt');
      const storedUsername = await SecureStore.getItemAsync('username');

      setToken(storedToken);
      setUsername(storedUsername);
    } catch (error) {
      console.log('Error loading session:', error);
      setToken(null);
      setUsername(null);
    } finally {
      setLoading(false);
    }
  }

  loadSession();
}, []);
  // log in token
  async function signIn(usernameValue: string, password: string) {
    const response = await api.post('/auth/login', { username: usernameValue, password });
    const newToken = response.data.token;
    await SecureStore.setItemAsync('jwt', newToken);
    await SecureStore.setItemAsync('username', response.data.username);
    setToken(newToken);
    setUsername(response.data.username);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync('jwt');
    await SecureStore.deleteItemAsync('username');
    setToken(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ token, username, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
