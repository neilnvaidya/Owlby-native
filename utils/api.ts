import Constants from 'expo-constants';

// Get API URL from environment variables
const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.warn('API_URL is not defined in environment variables. Using fallback URL.');
}

// Use environment variable or fallback to local development
export const getApiUrl = () => {
  return API_URL || 'http://localhost:3001';
};

// Basic fetch wrapper with error handling
export const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${getApiUrl()}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // Check if the response is ok
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.error || `API Error: ${response.status}`
    );
  }

  // Return JSON response or empty object if no content
  return response.status === 204 ? {} as T : await response.json();
};

// API endpoints
export const api = {
  auth: {
    signIn: (email: string, password: string) =>
      fetchApi('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'sign-in', email, password }),
      }),
    signUp: (email: string, password: string) =>
      fetchApi('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'sign-up', email, password }),
      }),
    signOut: () =>
      fetchApi('/api/auth', {
        method: 'POST',
        body: JSON.stringify({ action: 'sign-out' }),
      }),
    getSession: () => fetchApi('/api/auth'),
  },
  // Add more API endpoints as needed
};

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

export const apiClient = new ApiClient(getApiUrl()); 
