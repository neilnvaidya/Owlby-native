import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GoogleSignInButton from '../GoogleSignInButton';

describe('GoogleSignInButton', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <GoogleSignInButton onPress={() => {}} />
    );

    expect(getByText('Sign in with Google')).toBeTruthy();
  });

  it('shows loading state when isLoading is true', () => {
    const { getByText } = render(
      <GoogleSignInButton onPress={() => {}} isLoading={true} />
    );

    expect(getByText('Signing in...')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <GoogleSignInButton onPress={onPress} />
    );

    fireEvent.press(getByText('Sign in with Google'));
    expect(onPress).toHaveBeenCalled();
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <GoogleSignInButton onPress={onPress} disabled={true} />
    );

    fireEvent.press(getByText('Sign in with Google'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <GoogleSignInButton onPress={onPress} isLoading={true} />
    );

    fireEvent.press(getByText('Signing in...'));
    expect(onPress).not.toHaveBeenCalled();
  });
}); 