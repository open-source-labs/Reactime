import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = (): JSX.Element => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        backgroundColor: theme.primaryColor,
        color: theme.backgroundColor,
        padding: '8px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        position: 'fixed',
        top: '10px',
        right: '10px',
      }}
    >
      Toggle Theme
    </button>
  );
};

export default ThemeToggle;
