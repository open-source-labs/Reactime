import React, { createContext, useState, useContext } from 'react';

type Theme = {
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  secondaryColor: string;
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const defaultTheme: Theme = {
  backgroundColor: '#ffffff',
  textColor: '#330002',
  primaryColor: '#f00008',
  secondaryColor: '#62d6fb',
};

const darkTheme: Theme = {
  backgroundColor: '#222222',
  textColor: '#ffffff',
  primaryColor: '#ff6569',
  secondaryColor: '#6288fb',
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const value = {
    theme: isDark ? darkTheme : defaultTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
