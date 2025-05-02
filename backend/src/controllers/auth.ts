import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { createUser, getUserByEmail, getUserByGoogleId, getUserByAppleId, getUserById } from '../models/user';
import { logger } from '../utils/logger';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    // Validate inputs
    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ success: false, error: 'User already exists' });
      return;
    }

    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    });

    if (authError) {
      logger.error('Supabase auth error:', authError);
      res.status(500).json({ success: false, error: 'Registration failed' });
      return;
    }

    if (!authData.user) {
      res.status(500).json({ success: false, error: 'Registration failed' });
      return;
    }

    // Create user in our database
    const user = await createUser({
      email,
      name: name || email.split('@')[0],
      password: password, // Note: This is just for reference, actual password is handled by Supabase Auth
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
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

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      logger.error('Supabase auth error:', authError);
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    if (!authData.user) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }

    // Get user from our database
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      data: {
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

    // Sign in with Google using Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token,
    });

    if (authError) {
      logger.error('Supabase Google auth error:', authError);
      res.status(401).json({ success: false, error: 'Google authentication failed' });
      return;
    }

    if (!authData.user) {
      res.status(401).json({ success: false, error: 'Google authentication failed' });
      return;
    }

    // Get or create user in our database
    let user = await getUserByGoogleId(authData.user.id);
    if (!user) {
      user = await createUser({
        email: authData.user.email!,
        name: authData.user.user_metadata.name || authData.user.email!.split('@')[0],
        google_id: authData.user.id,
        avatar: authData.user.user_metadata.avatar_url,
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
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
    res.status(501).json({
      success: false,
      error: 'Apple authentication is not configured yet',
    });
  } catch (error) {
    logger.error('Apple auth error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const user = await getUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      },
    });
  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({ success: false, error: 'Failed to get user' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res.status(400).json({ success: false, error: 'Refresh token is required' });
      return;
    }

    // Refresh the session with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (authError) {
      logger.error('Token refresh error:', authError);
      res.status(401).json({ success: false, error: 'Invalid refresh token' });
      return;
    }

    if (!authData.session) {
      res.status(401).json({ success: false, error: 'Session refresh failed' });
      return;
    }

    res.json({
      success: true,
      data: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at,
      },
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(500).json({ success: false, error: 'Token refresh failed' });
  }
};

export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, error: 'Email is required' });
      return;
    }

    // Send password reset email
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL}/reset-password`,
    });

    if (resetError) {
      logger.error('Password reset request error:', resetError);
      res.status(500).json({ success: false, error: 'Failed to send reset email' });
      return;
    }

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent',
    });
  } catch (error) {
    logger.error('Password reset request error:', error);
    res.status(500).json({ success: false, error: 'Password reset request failed' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({ success: false, error: 'Token and new password are required' });
      return;
    }

    // Update password using the token
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      logger.error('Password reset error:', updateError);
      res.status(401).json({ success: false, error: 'Invalid or expired token' });
      return;
    }

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    logger.error('Password reset error:', error);
    res.status(500).json({ success: false, error: 'Failed to reset password' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Verification token is required'
      });
    }

    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    });

    if (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired verification token'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify email'
    });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Failed to resend verification email'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error('Resend verification email error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to resend verification email'
    });
  }
}; 