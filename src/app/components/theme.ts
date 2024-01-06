import { createTheme } from '@mui/material/styles';
const theme = createTheme({
  // typography: {
  //   fontSize: 2,
  // },
  palette: {
    primary: {
      main: '#3c6e71',
    },
    secondary: {
      main: '#3c6e71',
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
