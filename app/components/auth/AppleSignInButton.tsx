import React from 'react';
import { TouchableOpacity, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';

interface AppleSignInButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function AppleSignInButton({ 
  onPress, 
  disabled = false,
  isLoading = false 
}: AppleSignInButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: '#000' }]}
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
      <FontAwesome name="apple" size={20} color="#fff" style={styles.icon} />
      <Text style={styles.text}>
        Sign in with Apple
      </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
}); 