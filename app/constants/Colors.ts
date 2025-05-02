const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    primary: '#007AFF',
    border: '#E5E5E5',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    primary: '#0A84FF',
    border: '#333333',
  },
  primary: '#007AFF',
  text: '#000000',
  border: '#E5E5E5',
  error: '#FF3B30',
  errorBackground: '#FFEBEE',
  inputBackground: '#F5F5F5',
} as const; 