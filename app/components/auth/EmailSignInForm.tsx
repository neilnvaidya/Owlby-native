import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import { useRouter } from 'expo-router';
import { apiClient } from '../../../utils/api';

interface EmailSignInFormProps {
  isLogin?: boolean;
}

export default function EmailSignInForm({ isLogin = true }: EmailSignInFormProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setError(null);
      setIsSubmitting(true);

      if (!email || !password) {
        setError('Email and password are required');
        return;
      }

      if (!isLogin && !name) {
        setError('Name is required for registration');
        return;
      }

      let response;
      if (isLogin) {
        response = await apiClient.login(email, password);
      } else {
        response = await apiClient.register(email, password, name);
      }

      if (!response.success) {
        setError(response.error || 'Authentication failed');
        return;
      }

      // Store the token
      if (response.data?.token) {
        apiClient.setToken(response.data.token);
        // Navigate to main app
        router.replace('/(tabs)');
      } else {
        setError('Authentication failed');
      }
    } catch (err) {
      setError('An error occurred during authentication');
      console.error('Auth error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {!isLogin && (
        <TextInput
          style={[styles.input, { borderColor: colors.tabIconDefault }]}
          placeholder="Full Name"
          placeholderTextColor={colors.tabIconDefault}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      )}
      
      <TextInput
        style={[styles.input, { borderColor: colors.tabIconDefault }]}
        placeholder="Email"
        placeholderTextColor={colors.tabIconDefault}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={[styles.input, { borderColor: colors.tabIconDefault }]}
        placeholder="Password"
        placeholderTextColor={colors.tabIconDefault}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.tint }]}
        onPress={handleSubmit}
        disabled={isSubmitting}
        testID="submit-button"
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.switchMode}
        onPress={() => router.replace(isLogin ? '/screens/auth/RegisterScreen' : '/screens/auth/LoginScreen')}
      >
        <Text style={[styles.switchModeText, { color: colors.text }]}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchMode: {
    alignItems: 'center',
    marginTop: 16,
  },
  switchModeText: {
    fontSize: 14,
  },
  errorText: {
    color: '#ff3b30',
    marginTop: 8,
    fontSize: 14,
  },
}); 