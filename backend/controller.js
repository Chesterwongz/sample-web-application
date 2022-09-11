const quotes = [
  { quote: "You're breathtaking!", by: 'Keanu Reeves' },
  { quote: 'Do or do not. There is no try.', by: 'Yoda' },
  {
    quote: 'With great power there must also come -- great responsibility!',
    by: 'Uncle Ben',
  },
];

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
    req.body.by = 'Unknown';
  }

  return true;
};

export const createQuote = (req, res) => {
  if (!cleanUpJsonQuote(req, res)) {
    return;
  }
  const newQuote = { quote: req.body.quote, by: req.body.by };
  quotes.unshift(newQuote);
  res.status(201).json({ message: 'Quote added', data: newQuote });
};

export const getAllQuotes = (req, res) => {
  res.status(200).json({ message: 'Fetched all quotes', data: quotes });
};

export const updateQuote = (req, res) => {
  const index = req.params.index;
  if (!quotes[index]) {
    res.status(400).json({ message: 'Nothing to update!' });
    return;
  }
  let isUpdated = false;
  const quoteToUpdate = quotes[index];
  if (req.body.quote && typeof req.body.quote === 'string') {
    quoteToUpdate.quote = req.body.quote.trim();
    isUpdated = true;
  }
  if (req.body.by && typeof req.body.by === 'string') {
    quoteToUpdate.by = req.body.by.trim();
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
  if (!quotes[index]) {
    res.status(400).json({ message: 'Nothing to delete!' });
    return;
  }
  const quoteToBeDeleted = quotes[index];
  quotes.splice(index, 1);
  res.status(200).json({ message: 'Quote has been deleted', data: quoteToBeDeleted });
};
