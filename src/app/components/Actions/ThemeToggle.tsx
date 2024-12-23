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
      <div className='theme-toggle-icons'>
        <Moon className='theme-toggle-icon moon' />
        <Sun className='theme-toggle-icon sun' />
      </div>
      <div className='theme-toggle-slider' />
    </button>
  );
};

export default ThemeToggle;
