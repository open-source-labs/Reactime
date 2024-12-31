import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = (): JSX.Element => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme.backgroundColor === '#1a202c';

  return (
    <button
      onClick={toggleTheme}
      className='theme-toggle'
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        border: `2px solid ${theme.primaryColor}`,
      }}
    >
      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
};

export default ThemeToggle;
