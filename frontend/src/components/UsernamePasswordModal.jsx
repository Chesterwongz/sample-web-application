import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';

const StyledTextField = styled(TextField)({
  '& ::placeholder': {
    fontSize: '12px',
  },
});

const UsernamePasswordModal = ({ headerText, onClose, onSubmit, open, submitText }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const clear = () => {
    setUsername?.('');
    setPassword?.('');
  };

  const onCancel = () => {
    onClose();
    clear();
  };

  const onPrimarySubmit = (e) => {
    e.preventDefault();
    onSubmit({ username, password });
    onCancel();
  };

  return (
    <Dialog open={open}>
      <DialogTitle>{headerText}</DialogTitle>
      <DialogContent>
        <StyledTextField
          label="Username"
          variant="standard"
          fullWidth
          value={username}
          onChange={(e) => setUsername?.(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <StyledTextField
          label="Password"
          variant="standard"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword?.(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onPrimarySubmit}>
          {submitText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsernamePasswordModal;
