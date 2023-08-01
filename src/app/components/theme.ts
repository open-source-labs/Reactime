import { createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    primary: {
      main: '#8Fb5f9',
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
    // MuiSelect: {
    //   styleOverrides: {
    //     root: {
    //       main: '#556cd4',
    //     },
    //   },
    // },
  },
});

export default theme;
