import { addQuote as _addQuote, getQuote as _getQuote, getAllQuote as _getAllQuote, deleteQuote as _deleteQuote } from './model.js';

const DEFAULT_BY = 'Unknown';

const cleanUpJsonQuote = (req, res) => {
  if (!req.body.quote || typeof req.body.quote !== 'string') {
    res.status(400).json({ message: 'Please enter a quote!' });
    return false;
  }

  req.body.quote = req.body.quote.trim();

  if (!req.body.quote) {
    res.status(400).json({ message: 'Please enter a quote!' });
    return false;
  }

  if (!req.body.by || typeof req.body.by !== 'string' || !req.body.by.trim()) {
    req.body.by = DEFAULT_BY;
  }

  return true;
};

export const createQuote = (req, res) => {
  if (!cleanUpJsonQuote(req, res)) {
    return;
  }
  const newQuote = { quote: req.body.quote, by: req.body.by };
  _addQuote(newQuote);
  res.status(201).json({ message: 'Quote added', data: newQuote });
};

export const getAllQuotes = (req, res) => {
  res.status(200).json({ message: 'Fetched all quotes', data: _getAllQuote() });
};

export const updateQuote = (req, res) => {
  const index = req.params.index;
  const quoteToUpdate = _getQuote(index);
  if (!quoteToUpdate) {
    res.status(400).json({ message: 'Nothing to update!' });
    return;
  }
  let isUpdated = false;
  if (typeof req.body.quote === 'string') {
    const newQuote = req.body.quote.trim();
    if (newQuote.length === 0) {
      res.status(400).json({ message: 'Please enter a quote!' });
      return;
    }
    quoteToUpdate.quote = newQuote;
    isUpdated = true;
  }
  if (typeof req.body.by === 'string') {
    let newBy = req.body.by.trim();
    if (newBy.length === 0) {
      newBy = DEFAULT_BY;
    }
    quoteToUpdate.by = newBy;
    isUpdated = true;
  }
  if (!isUpdated) {
    res.status(400).json({ message: 'Nothing to update!' });
    return;
  }
  res.status(200).json({ message: 'Quote updated', data: quoteToUpdate });
};

export const deleteQuote = (req, res) => {
  const index = req.params.index;
  const quoteToBeDeleted = _getQuote(index);
  if (!quoteToBeDeleted) {
    res.status(400).json({ message: 'Nothing to delete!' });
    return;
  }
  _deleteQuote(index);
  res.status(200).json({ message: 'Quote has been deleted', data: quoteToBeDeleted });
};
