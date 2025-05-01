import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}


export const roleMiddleware = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
       res.status(401).json({ message: 'User not authenticated' });
       return
    }

    const { role } = req.user;
    if (!roles.includes(role)) {
       res.status(403).json({ message: 'You do not have permission to access this resource' });
       return
    }

    next(); 
  };
};


export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
       res.status(401).json({ message: 'User not authenticated' });
       return
    }

    const { role } = req.user;
    if (!roles.includes(role)) {
       res.status(403).json({ message: 'You do not have permission to access this resource' });
       return
    }

    next(); 
  };
};