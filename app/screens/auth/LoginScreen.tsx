import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';
import GoogleSignInButton from '../../components/auth/GoogleSignInButton';
import AppleSignInButton from '../../components/auth/AppleSignInButton';
import EmailSignInForm from '../../components/auth/EmailSignInForm';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { api } from '../../utils/api';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setIsLoading(true);
      // In a real app, you would implement Google Sign-In integration
      // For now, we'll just simulate a successful sign-in with a mock token
      const mockGoogleToken = 'mock_google_token';
      
      const response = await api.loginWithGoogle(mockGoogleToken);
      
      if (response.success && response.data?.token) {
        api.setToken(response.data.token);
        router.replace('/(tabs)');
      } else {
        setError(response.error || 'Google sign-in failed');
      }
    } catch (err) {
      setError('An error occurred during Google sign-in');
      console.error('Google sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setError(null);
      setIsLoading(true);
      // In a real app, you would implement Apple Sign-In integration
      // For now, we'll just simulate a successful sign-in with a mock token
      const mockAppleToken = 'mock_apple_token';
      
      const response = await api.loginWithApple(mockAppleToken);
      
      if (response.success && response.data?.token) {
        api.setToken(response.data.token);
        router.replace('/(tabs)');
      } else {
        setError(response.error || 'Apple sign-in failed');
      }
    } catch (err) {
      setError('An error occurred during Apple sign-in');
      console.error('Apple sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <FontAwesome name="graduation-cap" size={70} color={colors.tint} />
              <Text style={[styles.title, { color: colors.text }]}>Owlby</Text>
              <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>Your learning journey starts here</Text>
            </View>
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            <View style={styles.formContainer}>
              <EmailSignInForm isLogin={true} />
              
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: colors.tabIconDefault }]} />
                <Text style={[styles.dividerText, { color: colors.tabIconDefault }]}>or</Text>
                <View style={[styles.dividerLine, { backgroundColor: colors.tabIconDefault }]} />
              </View>
              
              <GoogleSignInButton 
                onPress={handleGoogleSignIn} 
                disabled={isLoading}
              />
              
              {Platform.OS === 'ios' && (
                <AppleSignInButton 
                  onPress={handleAppleSignIn} 
                  disabled={isLoading}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: '500',
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
  },
}); 