import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { v4 } from 'uuid';
import { Box, CircularProgress, Typography } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import QuoteCard from '../components/QuoteCard';
import { BACKEND_URL } from '../routes';

export default function HomePage() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [temperature, setTemperature] = useState();
  const [humidity, setHumidity] = useState();
  const [rainLocations, setRainLocations] = useState();

  const addQuote = (quote) => {
    axios
      .post(BACKEND_URL, quote)
      .then((res) => {
        console.log(res.data);
        setQuotes((currQuotes) => [quote, ...currQuotes]);
      })
      .catch((err) => console.log(err));
  };

  const deleteQuote = (index) => {
    axios
      .delete(BACKEND_URL + index)
      .then((res) => {
        console.log(res.data);
        setQuotes((currQuotes) =>
          currQuotes.filter((_, i) => {
            return i !== index;
          })
        );
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get(BACKEND_URL)
      .then((res) => {
        console.log(res.data);
        setQuotes(res.data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .get('https://szxs4i2k0m.execute-api.ap-southeast-1.amazonaws.com/weather')
      .then((res) => {
        console.log(res);
        setTemperature(res.data.data.temperature);
        setHumidity(res.data.data.humidity);
        setRainLocations(res.data.data.rainfall);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box mx={10} mt={5}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Box display="flex" justifyContent="left" alignItems="center" flexDirection="column">
              <Typography variant="h4">Singapore Weather:</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Typography variant="h6">
                  Temp: {temperature ? temperature + '°C' : 'NA'}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Humidity: {humidity ? humidity + '%' : 'NA'}
                </Typography>
              </Box>
              <Typography variant="h5">
                {rainLocations == null ? 'Rain at: NA' : rainLocations.length === 0 ? 'No rain anywhere :D' : 'Rain at ' + rainLocations.join(' ,')}
              </Typography>
            </Box>
          </Box>
          <Masonry columns={3} spacing={2}>
            <QuoteCard quote="" author="" newQuote addQuote={addQuote} />
            {quotes.map((quote, index) => (
              // Key needs to be uniquely generated on re-render to force React to re-render child components.
              // Else deleting from the front of the list will look like deleting from the back.
              <QuoteCard key={v4()} index={index} quote={quote.quote} author={quote.by} deleteQuote={deleteQuote} />
            ))}
          </Masonry>
        </>
      )}
    </Box>
  );
}
