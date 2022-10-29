import jwt from 'jsonwebtoken';
import { jwtSecret } from '../server.js';
import { addUser, existByUsername, verifyUsernamePassword } from '../model/userModel.js';

const JWT_DURATION = 1;
const EXPIRES_IN = JWT_DURATION + 'd';
export const JWT_COOKIE_NAME = 'jwt';

//create token for authenticated user
const signToken = (username) => {
  return jwt.sign({ username }, jwtSecret, {
    expiresIn: EXPIRES_IN,
  });
};

export const unwrapToken = (token) => {
  return jwt.verify(token, jwtSecret).username;
};

export const verifyToken = (token) => {
  const decodedUsername = unwrapToken(token);
  return existByUsername(decodedUsername) ? decodedUsername : null;
};

const createUserToken = async (username, res) => {
  if (username == null) {
    res.status(404).json({ msg: 'Username already taken!' });
    return;
  }
  console.log('-- Creating User Token --');
  const token = signToken(username);

  //set expiry to 1 day
  const d = new Date();
  d.setDate(d.getDate() + JWT_DURATION);

  //cookie settings
  // Read https://medium.com/swlh/7-keys-to-the-mystery-of-a-missing-cookie-fdf22b012f09
  // If your cookie is missing.
  res.cookie(JWT_COOKIE_NAME, token, {
    expires: d,
    httpOnly: true, // prevents client-side scripts from accessing data, avoiding cross-site scripting (XSS) attacks.
    // secure=true and samesite=none is required for cross site cookie.
    // sameSite: 'none',
    // secure: true,
    secure: false,
  });

  res.status(201).json({
    data: {
      currentUser: username,
    },
    message: `Authentication Token for ${username} generated successfully!`,
  });
};

export const createUser = async (req, res, next) => {
  console.log('-- Creating New User --');
  try {
    const { username, password } = req.body;
    const addedUsername = await addUser({ username: username, password: password });
    createUserToken(addedUsername, res);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msgs: ['Could not create new user at this time, please try again later.'] });
  }
};

//log user in
export const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  //check if email & password exist
  if (!username || !password) {
    return res.status(400).json({ msgs: ['Please provide a username and password!'] });
  }
  console.log(`-- User ${username} Attemping to Login --`);

  //check if user & password are correct
  const verifiedUsername = await verifyUsernamePassword({ username: username, password: password });
  if (!verifiedUsername) {
    return res.status(400).json({ msgs: ['Incorrect username or password!'] });
  }

  createUserToken(verifiedUsername, 200, req, res);
  console.log(`-- User ${verifiedUsername} Logged In --`);
};

//log user out
export const logoutUser = (req, res, next) => {
  console.log(`-- User Logged Out --`);
  res.cookie(JWT_COOKIE_NAME, 'loggedout', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
    secure: false,
  });
  res.status(200).send();
};

//check if user is logged in
export const getCurrentUser = (req, res, next) => {
  console.log(`-- Verifying JWT Token --`);
  let currentUser = null;
  if (req.cookies[JWT_COOKIE_NAME]) {
    currentUser = verifyToken(req.cookies[JWT_COOKIE_NAME]);
  } else {
    console.log('No JWT stored in cookie');
  }

  if (currentUser) {
    console.log(`-- JWT Token Was Valid --`);
  } else {
    console.log(`-- JWT Token Was Not Valid --`);
  }

  res.status(200).send({ currentUser });
};
