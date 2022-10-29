import { Avatar, Box, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import useAuth from '../hooks/useAuth';

import UsernamePasswordModal from './UsernamePasswordModal';
import { isEmpty } from 'lodash';
import { UserContext } from '../hooks/UserContext';

function UserDashboard({ setErrorDialog }) {
  const { user } = useContext(UserContext);
  const { registerUser, loginUser, logoutUser, error } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const [openSignUp, setOpenSignUp] = useState(false);
  const handleSignUp = async (user) => {
    await registerUser(user);
  };

  const [openSignIn, setOpenSignIn] = useState(false);
  const handleSignIn = async (user) => {
    await loginUser(user);
  };

  useEffect(() => {
    if (!isEmpty(error)) {
      setErrorDialog(error);
    }
  }, [error]);

  return (
    <Box sx={{ flexGrow: 0 }}>
      <Tooltip title="User Dashboard">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {user ? (
          <MenuItem
            onClick={() => {
              logoutUser();
              handleCloseUserMenu();
            }}
          >
            Logout
          </MenuItem>
        ) : (
          [
            <MenuItem
              key={1}
              onClick={() => {
                setOpenSignIn(true);
                handleCloseUserMenu();
              }}
            >
              Login
            </MenuItem>,
            <MenuItem
              key={2}
              onClick={() => {
                setOpenSignUp(true);
                handleCloseUserMenu();
              }}
            >
              Sign Up
            </MenuItem>,
          ]
        )}
      </Menu>
      <UsernamePasswordModal headerText="Login" onSubmit={handleSignIn} onClose={() => setOpenSignIn(false)} open={openSignIn} submitText="Sign In" />
      <UsernamePasswordModal headerText="Sign Up" onSubmit={handleSignUp} onClose={() => setOpenSignUp(false)} open={openSignUp} submitText="Sign Up" />
    </Box>
  );
}

export default UserDashboard;
