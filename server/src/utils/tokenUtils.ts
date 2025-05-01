import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret';

interface Payload {
  id: string;
  role: string;
}

export const generateTokens = (payload: Payload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, type: 'access' | 'refresh') => {
  const secret = type === 'access' ? JWT_SECRET : JWT_REFRESH_SECRET;
  return jwt.verify(token, secret);
};
