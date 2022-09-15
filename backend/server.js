import express from 'express';
import { createQuote, deleteQuote, getAllQuotes, updateQuote } from './controller.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const router = express.Router();

app.use('/api', router);

router.get('/', getAllQuotes);

router.post('/', createQuote);

router.put('/:index', updateQuote);
router.delete('/:index', deleteQuote);

app.listen(8000, '0.0.0.0', () => console.log('Listening on port 8000'));

export default app;
