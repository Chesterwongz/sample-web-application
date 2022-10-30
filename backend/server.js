import express from 'express';
import { createQuote, deleteQuote, getAllQuotes, updateQuote } from './controller/quoteController.js';
import cors from 'cors';
import { authenticate } from './middleware/authHandler.js';
import { getCurrentUser, createUser, loginUser, logoutUser } from './controller/userController.js';
import cookieParser from 'cookie-parser';
import { getMockDataFromDatabase, getMockDataFromRedis } from './controller/mockDataController.js';

export const jwtSecret = 'd71cdb02424d2d88be43a8e205d38948439aa2622c464ba522263233f847005b08d19b8e22dd924ae118de7d93c1961ef7fa37115baa063d3bee3d86e0d37092';

const app = express();
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(jwtSecret));

const router = express.Router();

app.use('/api', router);

router.get('/', getAllQuotes);
router.post('/', authenticate, createQuote);
router.put('/:index', authenticate, updateQuote);
router.delete('/:index', authenticate, deleteQuote);

router.get('/user/auth', getCurrentUser);
router.post('/user/register', createUser);
router.post('/user/login', loginUser);
router.get('/user/logout', logoutUser);

router.get('/mockdata/db', getMockDataFromDatabase);
router.get('/mockdata/redis', getMockDataFromRedis);

// router.post('/mockdata/db', loadDataIntoPostgres);

app.listen(8000, '0.0.0.0', () => console.log('Listening on port 8000'));

export default app;
