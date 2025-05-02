import { Platform } from 'react-native';
import { useAuth } from './auth';

// Get the base URL based on environment
const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.EXPO_PUBLIC_API_URL || 'https://your-vercel-app.vercel.app';
  }
  
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api'; // Android emulator localhost
  }
  return 'http://10.16.22.25:3000/api'; // iOS simulator localhost
};

const BASE_URL = getBaseUrl();

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async loginWithGoogle(token: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async loginWithApple(token: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/auth/apple', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  // User methods
  async getProfile(): Promise<ApiResponse> {
    return this.request('/api/user/profile');
  }

  async updateProfile(data: {
    name?: string;
    email?: string;
    avatar?: string;
  }): Promise<ApiResponse> {
    return this.request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Learning methods
  async getTopics(): Promise<ApiResponse> {
    return this.request('/topics');
  }

  async getTopic(id: string): Promise<ApiResponse> {
    return this.request(`/topics/${id}`);
  }

  async getProgress(): Promise<ApiResponse> {
    return this.request('/progress');
  }

  async getMilestones(): Promise<ApiResponse> {
    return this.request('/milestones');
  }

  // Health check
  async checkHealth(): Promise<ApiResponse> {
    return this.request('/api/health');
  }

  // Token management
  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }
}

export const api = new ApiClient(BASE_URL); 