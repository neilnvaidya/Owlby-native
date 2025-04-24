import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import jwt, { SignOptions } from 'jsonwebtoken';
import { createUser, getUserByEmail, getUserByGoogleId, getUserByAppleId } from '../models/user';
import { logger } from '../utils/logger';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Mock users for testing
const mockUsers = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: '$2a$10$J7CXQ3aD/eCDll1LVXFG5OtPMT.5gO9.u6mgPeK.LOUE0A7.ayEUW', // hashed 'password'
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Simple token generation for testing
const generateToken = (userId: string): string => {
  return `mock_token_${userId}_${Date.now()}`;
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Validate inputs
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email);
    if (existingUser) {
      res.status(400).json({ success: false, error: 'User already exists' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create mock user
    const newUser = {
      id: String(mockUsers.length + 1),
      email,
      name: name || email.split('@')[0],
      password: hashedPassword,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockUsers.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    // Find user
    const user = mockUsers.find(user => user.email === email);
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = user.password ? await bcrypt.compare(password, user.password) : false;
    if (!isMatch) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ success: false, error: 'Token is required' });
      return;
    }

    // Create a mock user for Google auth
    const googleUser = {
      id: 'google_1',
      email: 'google@example.com',
      name: 'Google User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      google_id: 'mock_google_id',
      avatar: 'https://via.placeholder.com/150'
    };

    // Generate JWT token
    const jwtToken = generateToken(googleUser.id);

    res.json({
      success: true,
      data: {
        token: jwtToken,
        user: {
          id: googleUser.id,
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.avatar,
        },
      },
    });
  } catch (error) {
    logger.error('Google auth error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
};

export const appleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({ success: false, error: 'Token is required' });
      return;
    }

    // Create a mock user for Apple auth
    const appleUser = {
      id: 'apple_1',
      email: 'apple@example.com',
      name: 'Apple User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      apple_id: 'mock_apple_id'
    };

    // Generate JWT token
    const jwtToken = generateToken(appleUser.id);

    res.json({
      success: true,
      data: {
        token: jwtToken,
        user: {
          id: appleUser.id,
          email: appleUser.email,
          name: appleUser.name,
        },
      },
    });
  } catch (error) {
    logger.error('Apple auth error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a real app, the user would be attached by auth middleware
    // For testing, we'll return a mock user
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      avatar: 'https://via.placeholder.com/150'
    };

    res.json({
      success: true,
      data: {
        user: mockUser
      },
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({ success: false, error: 'Failed to get user' });
  }
}; 