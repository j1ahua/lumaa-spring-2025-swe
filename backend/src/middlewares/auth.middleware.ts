import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers['authorization'];
    if (!header) return res.status(401).json({ message: 'No token provided' });

    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Invalid token format' });

    const payload = jwt.verify(token, JWT_SECRET) as any;
    (req as any).userId = payload.userId; // store userId in req object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};