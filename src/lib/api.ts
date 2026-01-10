// API Configuration and Helper Functions

const API_BASE_URL = 'http://localhost:8080/api/v1';

interface FetchOptions extends RequestInit {
  credentials?: RequestCredentials;
}

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: FetchOptions = {
    ...options,
    credentials: 'include', // Always include cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(errorData.errors || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

// Auth API calls
export const authAPI = {
  /**
   * Login with email and password
   */
  login: async (email: string, password: string) => {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  /**
   * Register a new user
   */
  register: async (data: { name: string; email: string; password: string; image?: string }) => {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Logout current user
   */
  logout: async () => {
    return apiFetch('/auth/logout', {
      method: 'POST',
    });
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    return apiFetch('/auth/get-profile', {
      method: 'GET',
    });
  },
};

export { API_BASE_URL };
