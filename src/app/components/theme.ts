import { createTheme } from '@mui/material/styles';
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd4',
    },
    secondary: {
      main: '#32a852',
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
