import type { Request, Response, NextFunction } from 'express';

import { verifyToken } from '../utils/jwt.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = header.replace('Bearer ', '');
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.userId, role: payload.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireRole = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

export const optionalAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (header) {
    try {
      const payload = verifyToken(header.replace('Bearer ', ''));
      req.user = { id: payload.userId, role: payload.role };
    } catch (error) {
      console.warn('Invalid optional token', error);
    }
  }
  next();
};
