import { Request, Response } from 'express';
import { register, login, googleAuth, refreshToken, requestPasswordReset, resetPassword } from '../../controllers/auth';
import { supabase } from '../../config/supabase';
import { getMockAuth, getMockFrom, getMockInsert, getMockSelect, getMockEq, getMockSingle } from '../setup';
import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

jest.mock('../../config/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signInWithIdToken: jest.fn(),
      getUser: jest.fn(),
      refreshSession: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      verifyOtp: jest.fn(),
      resend: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe('Auth Controller', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockSelect: jest.Mock;
  let mockInsert: jest.Mock;
  let mockEq: jest.Mock;
  let mockSingle: jest.Mock;

  const mockUser = {
    id: '123',
    email: 'test@example.com',
    name: 'Test User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockSession = {
    access_token: 'new_access_token',
    refresh_token: 'new_refresh_token',
    expires_at: 1745576868287,
  };

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockRes = {
      json: mockJson,
      status: mockStatus,
    };
    mockReq = {
      body: {},
    };

    // Set up database operation mocks
    mockSelect = jest.fn().mockReturnThis();
    mockInsert = jest.fn().mockReturnThis();
    mockEq = jest.fn().mockReturnThis();
    mockSingle = jest.fn();

    (supabase.from as jest.Mock).mockReturnValue({
      select: mockSelect,
      insert: mockInsert,
      eq: mockEq,
      single: mockSingle,
    });

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      // Mock user check
      mockSelect.mockReturnThis();
      mockEq.mockReturnThis();
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116' },
      });

      // Mock Supabase auth
      (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null,
      });

      // Mock user creation
      mockInsert.mockReturnThis();
      mockSelect.mockReturnThis();
      mockSingle.mockResolvedValueOnce({
        data: mockUser,
        error: null,
      });

      await register(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          user: {
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name,
          },
        },
      });
    });

    it('should handle existing user', async () => {
      mockReq.body = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
      };

      // Mock existing user check
      mockSelect.mockReturnThis();
      mockEq.mockReturnThis();
      mockSingle.mockResolvedValueOnce({
        data: mockUser,
        error: null,
      });

      await register(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'User already exists',
      });
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock Supabase auth
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
        data: { user: { id: '123', email: 'test@example.com' } },
        error: null,
      });

      // Mock user fetch
      mockSelect.mockReturnThis();
      mockEq.mockReturnThis();
      mockSingle.mockResolvedValueOnce({
        data: mockUser,
        error: null,
      });

      await login(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          user: {
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name,
          },
        },
      });
    });

    it('should handle invalid credentials', async () => {
      mockReq.body = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid credentials' },
      });

      await login(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid credentials',
      });
    });
  });

  describe('googleAuth', () => {
    it('should authenticate with Google successfully', async () => {
      mockReq.body = {
        token: 'valid_google_token',
      };

      const mockGoogleUser = {
        id: '123',
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg',
        },
      };

      // Mock Google auth
      (supabase.auth.signInWithIdToken as jest.Mock).mockResolvedValueOnce({
        data: { user: mockGoogleUser },
        error: null,
      });

      // Mock user check
      mockSelect.mockReturnThis();
      mockEq.mockReturnThis();
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: { code: 'PGRST116' },
      });

      // Mock user creation
      mockInsert.mockReturnThis();
      mockSelect.mockReturnThis();
      mockSingle.mockResolvedValueOnce({
        data: { ...mockUser, avatar: 'https://example.com/avatar.jpg' },
        error: null,
      });

      await googleAuth(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          user: {
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name,
            avatar: 'https://example.com/avatar.jpg',
          },
        },
      });
    });

    it('should handle invalid Google token', async () => {
      mockReq.body = {
        token: 'invalid_token',
      };

      (supabase.auth.signInWithIdToken as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Google authentication failed' },
      });

      await googleAuth(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Google authentication failed',
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      mockReq.body = {
        refresh_token: 'valid_refresh_token',
      };

      (supabase.auth.refreshSession as jest.Mock).mockResolvedValueOnce({
        data: { session: mockSession },
        error: null,
      });

      await refreshToken(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: {
          access_token: mockSession.access_token,
          refresh_token: mockSession.refresh_token,
          expires_at: mockSession.expires_at,
        },
      });
    });

    it('should handle invalid refresh token', async () => {
      mockReq.body = {
        refresh_token: 'invalid_token',
      };

      (supabase.auth.refreshSession as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid refresh token' },
      });

      await refreshToken(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid refresh token',
      });
    });
  });

  describe('requestPasswordReset', () => {
    it('should send password reset email successfully', async () => {
      mockReq.body = {
        email: 'test@example.com',
      };

      (supabase.auth.resetPasswordForEmail as jest.Mock).mockResolvedValueOnce({
        data: {},
        error: null,
      });

      await requestPasswordReset(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent',
      });
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      mockReq.body = {
        token: 'valid_reset_token',
        password: 'newpassword123',
      };

      (supabase.auth.updateUser as jest.Mock).mockResolvedValueOnce({
        data: {},
        error: null,
      });

      await resetPassword(mockReq as Request, mockRes as Response);

      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        message: 'Password reset successful',
      });
    });

    it('should handle invalid token', async () => {
      mockReq.body = {
        token: 'invalid_token',
        password: 'newpassword123',
      };

      (supabase.auth.updateUser as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid or expired token' },
      });

      await resetPassword(mockReq as Request, mockRes as Response);

      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid or expired token',
      });
    });
  });

  describe('verifyEmail', () => {
    it('should verify email with valid token', async () => {
      const mockResponse = {
        data: { user: { id: '123' } },
        error: null
      };

      (supabase.auth.verifyOtp as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/auth/verify-email')
        .send({ token: 'valid-token' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Email verified successfully'
      });
    });

    it('should return error for missing token', async () => {
      const response = await request(app)
        .post('/api/auth/verify-email')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Verification token is required'
      });
    });

    it('should return error for invalid token', async () => {
      const mockResponse = {
        data: null,
        error: { message: 'Invalid token' }
      };

      (supabase.auth.verifyOtp as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/auth/verify-email')
        .send({ token: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        success: false,
        error: 'Invalid or expired verification token'
      });
    });
  });

  describe('resendVerificationEmail', () => {
    it('should resend verification email', async () => {
      const mockResponse = {
        error: null
      };

      (supabase.auth.resend as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Verification email sent successfully'
      });
    });

    it('should return error for missing email', async () => {
      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Email is required'
      });
    });

    it('should return error for failed resend', async () => {
      const mockResponse = {
        error: { message: 'Failed to send email' }
      };

      (supabase.auth.resend as jest.Mock).mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/auth/resend-verification')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        success: false,
        error: 'Failed to resend verification email'
      });
    });
  });
}); 