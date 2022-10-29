import axios from 'axios';
import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Modal, Fade, TextField } from '@mui/material';
import { QUOTES_API_URL } from '../routes';

export default function QuoteCard({ index, quote, author, deleteQuote, addQuote, newQuote, setErrorDialog }) {
  const [openModal, setOpenModal] = useState(false);
  const [cardQuoteValue, setCardQuoteValue] = useState(quote);
  const [modalQuoteValue, setModalQuoteValue] = useState(quote);
  const [cardAuthorValue, setCardAuthorValue] = useState(author);

  const handleSave = () => {
    if (modalQuoteValue.trim() === cardQuoteValue.trim()) return;
    if (newQuote) {
      addQuote && addQuote({ quote: modalQuoteValue.trim() });
      setModalQuoteValue('');
      setOpenModal(false);
    } else {
      axios
        .put(QUOTES_API_URL + index, { quote: modalQuoteValue.trim() }, { withCredentials: true })
        .then((res) => {
          console.log(res.data);
          setCardQuoteValue(modalQuoteValue.trim());
          setCardAuthorValue(author.trim());
          setOpenModal(false);
        })
        .catch((err) => {
          console.log(err);
          if (err.response.data) {
            setErrorDialog(err.response.data.msgs);
          } else {
            setErrorDialog(['Please try again later!']);
          }
        });
    }
  };

  const handleDelete = () => {
    if (newQuote) return;
    setOpenModal(false);
    deleteQuote(index);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalQuoteValue(cardQuoteValue);
  };

  return (
    <Card sx={{ minWidth: 275 }} variant="outlined" square={false}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {cardQuoteValue}
        </Typography>
        <Typography sx={{ fontSize: 14 }} gutterBottom>
          {cardAuthorValue}
        </Typography>
        {newQuote && (
          <Button fullWidth onClick={handleOpenModal} variant="contained">
            Add Quote
          </Button>
        )}
      </CardContent>
      {!newQuote && (
        <CardActions>
          <Button size="small" onClick={handleOpenModal}>
            Edit &nbsp; &nbsp;
          </Button>
        </CardActions>
      )}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
      >
        <Fade in={openModal}>
          <Card
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50%',
              minWidth: 400,
              border: '2px solid #eceff1',
              boxShadow: 4,
              p: 1,
            }}
          >
            <CardContent>
              <TextField
                label="Quote"
                color="primary"
                margin="normal"
                fullWidth
                focused
                multiline
                maxRows={10}
                value={modalQuoteValue}
                onChange={(event) => setModalQuoteValue(event.target.value)}
              />
              {author && <Typography>- {author}</Typography>}
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={modalQuoteValue.trim().length === 0 || modalQuoteValue.trim() === cardQuoteValue.trim()}
              >
                Save
              </Button>
              {!newQuote && (
                <Button variant="contained" color="secondary" onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </CardActions>
          </Card>
        </Fade>
      </Modal>
    </Card>
  );
}
