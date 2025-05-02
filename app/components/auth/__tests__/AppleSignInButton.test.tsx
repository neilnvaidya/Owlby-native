import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AppleSignInButton from '../AppleSignInButton';

describe('AppleSignInButton', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <AppleSignInButton onPress={() => {}} />
    );

    expect(getByText('Sign in with Apple')).toBeTruthy();
  });

  it('shows loading state when isLoading is true', () => {
    const { getByText } = render(
      <AppleSignInButton onPress={() => {}} isLoading={true} />
    );

    expect(getByText('Signing in...')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AppleSignInButton onPress={onPress} />
    );

    fireEvent.press(getByText('Sign in with Apple'));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AppleSignInButton onPress={onPress} disabled={true} />
    );

    fireEvent.press(getByText('Sign in with Apple'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AppleSignInButton onPress={onPress} isLoading={true} />
    );

    fireEvent.press(getByText('Signing in...'));
    expect(onPress).not.toHaveBeenCalled();
  });
}); 