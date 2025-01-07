import React, { createContext, useState, useContext } from 'react';

type User = {
  username: string;
  isAdmin: boolean;
} | null;

type AuthContextType = {
  user: User;
  login: (username: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  const login = (username: string) => {
    setUser({
      username,
      isAdmin: username === 'admin',
    });
  };

  const logout = () => {
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
