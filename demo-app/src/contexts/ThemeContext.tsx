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
  textColor: '#1a202c',
  primaryColor: '#3182ce',
  secondaryColor: '#805ad5',
};

const darkTheme: Theme = {
  backgroundColor: '#1a202c',
  textColor: '#f7fafc',
  primaryColor: '#63b3ed',
  secondaryColor: '#b794f4',
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.setAttribute('data-theme', !isDark ? 'dark' : 'light');
  };

  // Set initial theme
  React.useEffect(() => {
    document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  const value = {
    theme: isDark ? darkTheme : defaultTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
