import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the test screen first
  return <Redirect href="/test" />;
} 