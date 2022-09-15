import HomePage from './pages/HomePage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      default: '#102027',
      paper: '#37474f',
    },
    text: {
      primary: '#eceff1',
      secondary: '#fff',
    },
    primary: {
      light: '#b4ffff',
      main: '#80deea',
      dark: '#4bacb8',
      contrastText: '#000',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#fff',
    },
    action: {
      disabledBackground: '#4bacb8',
      disabled: '#37474f',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
