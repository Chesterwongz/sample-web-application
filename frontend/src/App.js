import HomePage from './pages/HomePage';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import useTokenLogin from './hooks/useTokenLogin';
import { UserContext } from './hooks/UserContext';
import UserDashboard from './components/UserDashboard';
import { useState } from 'react';

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
  const { user, setUser } = useTokenLogin();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState([]);
  const setErrorDialog = (msgs) => {
    setIsDialogOpen(true);
    setDialogMsg(msgs);
  };

  const closeDialog = () => setIsDialogOpen(false);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserDashboard setErrorDialog={setErrorDialog} />
        <HomePage setErrorDialog={setErrorDialog} />
        <Dialog open={isDialogOpen} onClose={closeDialog}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            {dialogMsg.map((msg, index) => {
              return <DialogContentText key={index}>{msg}</DialogContentText>;
            })}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </UserContext.Provider>
  );
}

export default App;
