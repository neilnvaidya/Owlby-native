import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';

interface GoogleSignInButtonProps {
  disabled?: boolean;
}

export default function GoogleSignInButton({ disabled }: GoogleSignInButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { signInWithGoogle } = useAuth();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.tint },
        disabled && styles.disabled
      ]}
      onPress={signInWithGoogle}
      disabled={disabled}
    >
      {disabled ? (
        <ActivityIndicator color={colors.background} />
      ) : (
        <Text style={[styles.text, { color: colors.background }]}>
          Sign in with Google
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 