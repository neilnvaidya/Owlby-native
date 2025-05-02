import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EmailSignInForm from '../EmailSignInForm';
import { api } from '../../../utils/api';

// Mock the API
jest.mock('../../../utils/api', () => ({
  api: {
    login: jest.fn(),
    register: jest.fn(),
    setToken: jest.fn(),
  },
}));

// Mock the router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

describe('EmailSignInForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <EmailSignInForm isLogin={true} />
    );

    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
  });

  it('renders registration form correctly', () => {
    const { getByPlaceholderText, getByText } = render(
      <EmailSignInForm isLogin={false} />
    );

    expect(getByPlaceholderText('Full Name')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Sign Up')).toBeTruthy();
  });

  it('shows error when submitting without email and password', async () => {
    const { getByText, getByTestId } = render(
      <EmailSignInForm isLogin={true} />
    );

    fireEvent.press(getByTestId('submit-button'));

    await waitFor(() => {
      expect(getByText('Email and password are required')).toBeTruthy();
    });
  });

  it('shows error when registering without name', async () => {
    const { getByText, getByTestId } = render(
      <EmailSignInForm isLogin={false} />
    );

    fireEvent.press(getByTestId('submit-button'));

    await waitFor(() => {
      expect(getByText('Name is required for registration')).toBeTruthy();
    });
  });

  it('handles successful login', async () => {
    const mockToken = 'test-token';
    (api.login as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { token: mockToken },
    });

    const { getByPlaceholderText, getByTestId } = render(
      <EmailSignInForm isLogin={true} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByTestId('submit-button'));

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(api.setToken).toHaveBeenCalledWith(mockToken);
    });
  });

  it('handles failed login', async () => {
    (api.login as jest.Mock).mockResolvedValueOnce({
      success: false,
      error: 'Invalid credentials',
    });

    const { getByPlaceholderText, getByTestId, getByText } = render(
      <EmailSignInForm isLogin={true} />
    );

    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByTestId('submit-button'));

    await waitFor(() => {
      expect(getByText('Invalid credentials')).toBeTruthy();
    });
  });
}); 