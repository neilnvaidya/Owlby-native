import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  // Redirect to main app if authenticated, otherwise to auth flow
  return <Redirect href={session ? '/(tabs)' : '/(auth)'} />;
} 