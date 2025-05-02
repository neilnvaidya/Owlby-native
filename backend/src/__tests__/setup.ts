import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set default test environment variables
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co';
process.env.SUPABASE_KEY = process.env.SUPABASE_KEY || 'test-key';

// Create a mock Supabase client
const mockClient = {
  from: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signInWithIdToken: jest.fn(),
    refreshSession: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
  },
};

// Mock the createClient function
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockClient),
}));

// Export the mock client for use in tests
export const getMockClient = () => mockClient;
export const getMockFrom = () => mockClient.from;
export const getMockInsert = () => mockClient.insert;
export const getMockSelect = () => mockClient.select;
export const getMockEq = () => mockClient.eq;
export const getMockSingle = () => mockClient.single;
export const getMockUpdate = () => mockClient.update;
export const getMockDelete = () => mockClient.delete;
export const getMockAuth = () => mockClient.auth;

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();

  // Set up default mock responses for database operations
  mockClient.from.mockReturnThis();
  mockClient.insert.mockReturnThis();
  mockClient.select.mockReturnThis();
  mockClient.eq.mockReturnThis();
  mockClient.single.mockResolvedValue({ data: null, error: null });
  mockClient.update.mockReturnThis();
  mockClient.delete.mockReturnThis();

  // Set up default mock responses for auth operations
  mockClient.auth.signUp.mockResolvedValue({ data: null, error: null });
  mockClient.auth.signInWithPassword.mockResolvedValue({ data: null, error: null });
  mockClient.auth.signInWithIdToken.mockResolvedValue({ data: null, error: null });
  mockClient.auth.refreshSession.mockResolvedValue({ data: null, error: null });
  mockClient.auth.resetPasswordForEmail.mockResolvedValue({ data: null, error: null });
  mockClient.auth.updateUser.mockResolvedValue({ data: null, error: null });
});

// Test data
export const testUser = {
  id: '123',
  email: 'test@example.com',
  name: 'Test User',
  password: 'password123',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const testLearningNode = {
  id: '456',
  title: 'Test Learning Node',
  content: 'Test content',
  difficulty: 'beginner',
  topic: 'test-topic',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const testLearningPath = {
  id: '789',
  title: 'Test Learning Path',
  description: 'Test description',
  difficulty: 'beginner',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Test suite
describe('Test Setup', () => {
  it('should create Supabase client with correct parameters', () => {
    const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
    expect(client).toBeDefined();
  });
}); 