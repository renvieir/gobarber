import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/authConfig';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decodedToken = await promisify(jwt.verify)(token, authConfig.secret);
    req.userId = decodedToken.id;
  } catch (error) {
    return res.status(401).json({ error: 'Invalid auth token' });
  }

  return next();
};
