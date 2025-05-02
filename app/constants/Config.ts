import { Platform } from 'react-native';

// Get the base URL based on platform
const getBaseUrl = () => {
  if (__DEV__) {
    // Development environment
    return Platform.select({
      ios: 'http://10.16.22.25:3000/api',
      android: 'http://10.0.2.2:3000/api',
      default: 'http://localhost:3000/api',
    });
  }
  // Production environment
  return 'https://api.owlby.com/api';
};

export const API_URL = getBaseUrl(); 