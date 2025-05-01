import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateTokens = (payload: object) => {
  const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, type: 'access' | 'refresh') => {
  const secret = type === 'access' ? ACCESS_SECRET : REFRESH_SECRET;
  return jwt.verify(token, secret);
};
