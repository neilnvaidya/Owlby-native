// This file is used by jest.mock() and should not use any variables
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockImplementation(() => ({
    from: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signInWithIdToken: jest.fn(),
    },
  })),
}));

// Set default test environment variables
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co';
process.env.SUPABASE_KEY = process.env.SUPABASE_KEY || 'test-key';

import { createChainableMock } from './mock-utils';

let mockClient: any;

export const getMockClient = () => {
  if (!mockClient) {
    const mockFrom = jest.fn().mockReturnThis();
    const mockInsert = createChainableMock();
    const mockSelect = createChainableMock();
    const mockEq = createChainableMock();
    const mockSingle = jest.fn();
    const mockUpdate = createChainableMock();
    const mockDelete = createChainableMock();

    mockClient = {
      from: mockFrom,
      insert: mockInsert,
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
      update: mockUpdate,
      delete: mockDelete,
      auth: {
        signUp: jest.fn(),
        signInWithPassword: jest.fn(),
        signInWithIdToken: jest.fn(),
      },
    };
  }
  return mockClient;
};

// Export individual mocks for testing
export const getMockFrom = () => mockClient.from;
export const getMockInsert = () => mockClient.insert;
export const getMockSelect = () => mockClient.select;
export const getMockEq = () => mockClient.eq;
export const getMockSingle = () => mockClient.single;
export const getMockUpdate = () => mockClient.update;
export const getMockDelete = () => mockClient.delete;
export const getMockAuth = () => mockClient.auth; 