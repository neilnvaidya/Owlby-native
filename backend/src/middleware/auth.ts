import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { getUserById } from '../models/user';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface AuthRequest extends Request {
  userId?: string;
}

// Verify JWT token from Supabase
const verifyToken = async (token: string) => {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) throw error;
  return { userId: user?.id };
};

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'Authorization token required' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ success: false, error: 'Invalid token' });
      return;
    }
    
    // Verify token with Supabase
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
    
    if (error || !supabaseUser) {
      logger.error('Supabase auth error:', error);
      res.status(401).json({ success: false, error: 'Invalid token' });
      return;
    }
    
    // Get user from our database
    const user = await getUserById(supabaseUser.id);
    if (!user) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }
    
    // Attach user to request
    req.user = user;
    
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ success: false, error: 'Not authenticated' });
  }
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const decoded = await verifyToken(token);
    if (!decoded.userId) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    const user = await getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}; 