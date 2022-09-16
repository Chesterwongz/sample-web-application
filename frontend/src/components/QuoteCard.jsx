import axios from 'axios';
import React, { useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Modal, Fade, TextField } from '@mui/material';

export default function QuoteCard({ index, quote, author, deleteQuote, addQuote, newQuote }) {
  const [openModal, setOpenModal] = useState(false);
  const [cardQuoteValue, setCardQuoteValue] = useState(quote);
  const [modalQuoteValue, setModalQuoteValue] = useState(quote);
  const [cardAuthorValue, setCardAuthorValue] = useState(author);
  const [modalAuthorValue, setModalAuthorValue] = useState(author);

  const handleSave = () => {
    if (modalQuoteValue.trim() === cardQuoteValue.trim() && modalAuthorValue.trim() === cardAuthorValue.trim()) return;
    if (newQuote) {
      addQuote && addQuote({ quote: modalQuoteValue.trim(), by: modalAuthorValue.trim() });
      setModalQuoteValue('');
      setModalAuthorValue('');
      setOpenModal(false);
    } else {
      axios
        .put(`/backend/api/${index}`, { quote: modalQuoteValue.trim(), by: modalAuthorValue.trim() })
        .then((res) => {
          console.log(res.data);
          setCardQuoteValue(modalQuoteValue.trim());
          setCardAuthorValue(modalAuthorValue.trim());
          setOpenModal(false);
        })
        .catch((err) => console.log(err));
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
    setModalAuthorValue(cardAuthorValue);
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
              <TextField
                label="by"
                color="primary"
                fullWidth
                focused
                margin="normal"
                multiline
                maxRows={10}
                value={modalAuthorValue}
                onChange={(event) => setModalAuthorValue(event.target.value)}
              />
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={modalQuoteValue.trim() === cardQuoteValue.trim() && modalAuthorValue.trim() === cardAuthorValue.trim()}
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
