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
      }}
    >
      <h2>REACTIME - DEMO APP</h2>

      {user ? (
        <div>
          <p>Welcome, {user.username}!</p>
          <button
            onClick={logout}
            style={{
              backgroundColor: theme.primaryColor,
              color: theme.backgroundColor,
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
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
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Login as Test User
          </button>
          <button
            onClick={() => login('admin')}
            style={{
              backgroundColor: theme.secondaryColor,
              color: theme.backgroundColor,
              padding: '8px 16px',
              border: 'none',
              borderRadius: '4px',
              marginLeft: '8px',
              cursor: 'pointer',
            }}
          >
            Login as Admin
          </button>
        </div>
      )}

      <p>
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua..."
      </p>
    </div>
  );
}

export default Home;
