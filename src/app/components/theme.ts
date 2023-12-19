import { createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    primary: {
      main: '#b2f7a1',
    },
    secondary: {
      main: '#BF6DD2',
    },
  },
  components: {
    // Name of the component

    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          fontSize: '0.8rem',
          letterSpacing: '0.1rem',
          lineHeight: '0.8rem',
        },
      },
    },
  },
});

export default theme;
