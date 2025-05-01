import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

const JWT_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_secret';

export const verifyTokenMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
 
  const token = req.cookies.refreshToken || req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
     res.status(401).json({ message: 'No token provided' });
     return
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    req.user = decoded; 
    next();
  } catch (error) {
    console.log("fhsdjfhjdshgjhjhghjhjg",error);
    
     res.status(403).json({ message: 'Invalid or expired token' });
     return
  }
};
