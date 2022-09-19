const quotes = [
  { quote: "You're breathtaking!", by: 'Keanu Reeves' },
  { quote: 'Do or do not. There is no try.', by: 'Yoda' },
  {
    quote: 'With great power there must also come -- great responsibility!',
    by: 'Uncle Ben',
  },
];

export const addQuote = (quote) => {
  quotes.unshift(quote);
};

export const getQuote = (index) => {
  return quotes[index];
};

export const getAllQuote = () => {
  return quotes;
};

export const deleteQuote = (index) => {
  quotes.splice(index, 1);
};
