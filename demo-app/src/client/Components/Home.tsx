import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

function Home(): JSX.Element {
  const { theme } = useTheme();
  const { user, login, logout } = useAuth();

  return (
    <div
      className='about'
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        boxShadow: `0 4px 6px ${theme.backgroundColor === '#1a202c' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
      }}
    >
      <h2 style={{ color: theme.textColor }}>REACTIME - DEMO APP</h2>

      {user ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <button
            onClick={logout}
            style={{
              backgroundColor: theme.primaryColor,
              color: theme.backgroundColor,
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div>
          <p>Please log in:</p>
          <button
            onClick={() => login('testUser')}
            style={{
              backgroundColor: theme.primaryColor,
              color: theme.backgroundColor,
            }}
          >
            Login as Test User
          </button>
          <button
            onClick={() => login('admin')}
            style={{
              backgroundColor: theme.secondaryColor,
              color: theme.backgroundColor,
              marginLeft: '8px',
            }}
          >
            Login as Admin
          </button>
        </div>
      )}
    </div>
  );
}
export default Home;
