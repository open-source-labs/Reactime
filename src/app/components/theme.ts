import { createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd4',
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
          letterSpacing: '0.2rem',
          lineHeight: '0.8rem',
        },
      },
    },
  },
});

export default theme;
