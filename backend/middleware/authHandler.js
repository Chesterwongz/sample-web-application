import { JWT_COOKIE_NAME, verifyToken } from '../controller/userController.js';

export const authenticate = (req, res, next) => {
  if (!req.cookies.jwt || !verifyToken(req.cookies[JWT_COOKIE_NAME])) {
    return res.status(401).json({ msgs: ['Please login!'] });
  }
  next();
};
