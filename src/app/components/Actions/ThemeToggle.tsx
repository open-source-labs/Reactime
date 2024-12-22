import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../ThemeProvider';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle ${isDark ? 'dark' : ''}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? <Sun className='theme-toggle-icon' /> : <Moon className='theme-toggle-icon' />}
    </button>
  );
};

export default ThemeToggle;
