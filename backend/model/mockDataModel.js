import pkg from 'pg';
import { createClient } from 'redis';
import { mockdata } from './mockdata.js';
const { Pool } = pkg;

const pgClient = new Pool({
  user: 'chester',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

const redisClient = createClient();
await redisClient.connect();

export const getMockDataFromPostgres = async () => {
  let res = null;
  await pgClient
    .query('SELECT JSON FROM MOCK_DATA')
    .then((result) => (res = result.rows.map((row) => row.json)))
    .catch((err) => console.log(err));
  return res;
};

export const getMockDataFromRedis = async () => {
  let data = null;
  await redisClient.get('MOCK_DATA').then(async (mockdata) => {
    if (mockdata) {
      data = JSON.parse(mockdata);
    } else {
      data = await getMockDataFromPostgres();
      redisClient.setEx('MOCK_DATA', 3600, JSON.stringify(data));
    }
  });
  return data;
};

// export const loadDataIntoPostgres = async () => {
//   mockdata.map((data) => {
//     pgClient.query('INSERT INTO MOCK_DATA(JSON) VALUES ($1)', [data]);
//   });
// };
