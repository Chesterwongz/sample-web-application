import { addQuote as _addQuote, getQuote as _getQuote, getAllQuote as _getAllQuote, deleteQuote as _deleteQuote } from '../model/quoteModel.js';
import { JWT_COOKIE_NAME, unwrapToken } from './userController.js';

const isPermitted = (username, quote, res) => {
  if (username !== quote.by.trim().toLowerCase()) {
    res.status(403).json({ msgs: ['You can only edit what you posted!'] });
    return false;
  }
  return true;
};

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

  return true;
};

export const createQuote = (req, res) => {
  const username = unwrapToken(req.cookies[JWT_COOKIE_NAME]);
  if (!cleanUpJsonQuote(req, res)) {
    return;
  }
  const newQuote = { quote: req.body.quote, by: username };
  _addQuote(newQuote);
  res.status(201).json({ message: 'Quote added', data: newQuote });
};

export const getAllQuotes = (req, res) => {
  res.status(200).json({ message: 'Fetched all quotes', data: _getAllQuote() });
};

export const updateQuote = (req, res) => {
  const username = unwrapToken(req.cookies[JWT_COOKIE_NAME]);
  const index = req.params.index;
  const quoteToUpdate = _getQuote(index);
  if (!isPermitted(username, quoteToUpdate, res)) {
    return;
  }
  if (!quoteToUpdate) {
    return res.status(400).json({ msgs: ['Nothing to update!'] });
  }
  if (typeof req.body.quote === 'string') {
    const newQuote = req.body.quote.trim();
    if (newQuote.length === 0) {
      res.status(400).json({ msgs: ['Please enter a quote!'] });
      return;
    }
    quoteToUpdate.quote = newQuote;
  } else {
    res.status(400).json({ msgs: ['Nothing to update!'] });
    return;
  }
  res.status(200).json({ msgs: ['Quote updated'], data: quoteToUpdate });
};

export const deleteQuote = (req, res) => {
  const username = unwrapToken(req.cookies[JWT_COOKIE_NAME]);
  const index = req.params.index;
  const quoteToBeDeleted = _getQuote(index);
  if (!isPermitted(username, quoteToBeDeleted, res)) {
    return;
  }
  if (!quoteToBeDeleted) {
    res.status(400).json({ message: 'Nothing to delete!' });
    return;
  }
  _deleteQuote(index);
  res.status(200).json({ message: 'Quote has been deleted', data: quoteToBeDeleted });
};
