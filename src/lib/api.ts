// API Configuration and Helper Functions

const API_BASE_URL = process.env.NEXT_API_URL || 'http://localhost:8080/api/v1';

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

// Problem API calls
export const problemAPI = {
  /**
   * Get all problems
   */
  getAll: async () => {
    return apiFetch('/problems/get-problems', {
      method: 'GET',
    });
  },

  /**
   * Get problem by ID
   */
  getById: async (id: string) => {
    return apiFetch(`/problems/get-problem/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Delete a problem
   */
  delete: async (id: string) => {
    return apiFetch(`/problems/delete-problem/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Create a new problem
   */
  create: async (data: any) => {
    return apiFetch('/problems/create-problem', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update a problem
   */
  update: async (id: string, data: any) => {
    return apiFetch(`/problems/update-problem/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Playlist API calls
export const playlistAPI = {
  /**
   * Get all playlists
   */
  getAll: async () => {
    return apiFetch('/playlist', {
      method: 'GET',
    });
  },

  /**
   * Get playlist by ID
   */
  getById: async (id: string) => {
    return apiFetch(`/playlist/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Create a new playlist
   */
  create: async (data: any) => {
    return apiFetch('/playlist/create-playlist', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Add problem to playlist
   */
  addProblem: async (playlistId: string, problemIds: string[]) => {
    return apiFetch(`/playlist/${playlistId}/add-problem`, {
      method: 'POST',
      body: JSON.stringify({ problemIds }),
    });
  },

  /**
   * Remove problem from playlist
   */
  removeProblem: async (playlistId: string, problemIds: string[]) => {
    return apiFetch(`/playlist/${playlistId}/remove-problem`, {
      method: 'DELETE',
      body: JSON.stringify({ problemIds }),
    });
  },

  /**
   * Delete a playlist
   */
  delete: async (id: string) => {
    return apiFetch(`/playlist/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Update a playlist
   */
  update: async (id: string, data: { name: string; description: string }) => {
    return apiFetch(`/playlist/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

export { API_BASE_URL };
