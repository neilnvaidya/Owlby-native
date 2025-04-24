import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface GoogleSignInButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export default function GoogleSignInButton({ onPress, disabled = false }: GoogleSignInButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: '#fff' }]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.iconContainer}>
        <FontAwesome name="google" size={20} color="#DB4437" />
      </View>
      <Text style={styles.text}>
        Sign in with Google
      </Text>
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
  iconContainer: {
    width: 20,
    height: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
}); 