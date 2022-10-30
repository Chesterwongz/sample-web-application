import { getMockDataFromPostgres as _getMockDataFromDatabase, getMockDataFromRedis as _getMockDataFromRedis } from '../model/mockDataModel.js';

export const getMockDataFromDatabase = async (req, res) => {
  const data = await _getMockDataFromDatabase();
  return res.status(200).json(data);
};

export const getMockDataFromRedis = async (req, res) => {
  const data = await _getMockDataFromRedis();
  return res.status(200).json(data);
};

// export const loadDataIntoPostgres = async (req, res) => {
//   const data = await _loadDataIntoPostgres();
//   return res.status(200).json(data);
// };
