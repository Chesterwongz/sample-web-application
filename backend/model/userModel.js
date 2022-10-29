import bcrypt from 'bcrypt';

const users = {};

export const addUser = async ({ username, password }) => {
  username = username.trim().toLowerCase();
  if (username.length == 0 || users[username]) {
    return null;
  }
  users[username] = await bcrypt.hash(password, 10);
  return username;
};

export const verifyUsernamePassword = async ({ username, password }) => {
  username = username.trim().toLowerCase();
  try {
    const isCorrect = await bcrypt.compare(password, users[username]);
    return isCorrect ? username : null;
  } catch (err) {
    return null;
  }
};

export const existByUsername = (username) => {
  console.log('Current users:', users);
  return users[username] != null;
};
