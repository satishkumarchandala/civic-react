const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get headers
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getHeaders(options.includeAuth !== false),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  // Register user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
      includeAuth: false,
    });
  },

  // Login user
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      includeAuth: false,
    });
  },

  // Get current user
  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  // Update profile
  updateProfile: async (userData) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    return apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },
};

// Issues API
export const issuesAPI = {
  // Get all issues with filters
  getIssues: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/issues${queryString ? `?${queryString}` : ''}`);
  },

  // Get single issue
  getIssue: async (id) => {
    return apiRequest(`/issues/${id}`);
  },

  // Create new issue
  createIssue: async (issueData) => {
    return apiRequest('/issues', {
      method: 'POST',
      body: JSON.stringify(issueData),
    });
  },

  // Update issue status (Admin only)
  updateStatus: async (id, statusData) => {
    return apiRequest(`/issues/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  },

  // Vote on issue
  vote: async (id, voteType) => {
    return apiRequest(`/issues/${id}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType }),
    });
  },

  // Delete issue (Admin only)
  deleteIssue: async (id) => {
    return apiRequest(`/issues/${id}`, {
      method: 'DELETE',
    });
  },
};

// Comments API
export const commentsAPI = {
  // Get comments for an issue
  getComments: async (issueId) => {
    return apiRequest(`/comments/issue/${issueId}`);
  },

  // Add comment
  addComment: async (commentData) => {
    return apiRequest('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },

  // Update comment
  updateComment: async (id, commentData) => {
    return apiRequest(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(commentData),
    });
  },

  // Delete comment
  deleteComment: async (id) => {
    return apiRequest(`/comments/${id}`, {
      method: 'DELETE',
    });
  },

  // Like/unlike comment
  toggleLike: async (id) => {
    return apiRequest(`/comments/${id}/like`, {
      method: 'POST',
    });
  },
};

// Admin API
export const adminAPI = {
  // Get admin statistics
  getStats: async () => {
    return apiRequest('/admin/stats');
  },

  // Get all issues for admin
  getIssues: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/issues${queryString ? `?${queryString}` : ''}`);
  },

  // Get all users for admin
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  // Update user status
  updateUserStatus: async (id, statusData) => {
    return apiRequest(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  },

  // Assign issue
  assignIssue: async (id, assignmentData) => {
    return apiRequest(`/admin/issues/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify(assignmentData),
    });
  },

  // Get analytics
  getAnalytics: async (period = '30') => {
    return apiRequest(`/admin/analytics?period=${period}`);
  },
};

// Email API
export const emailAPI = {
  // Send test email
  sendTestEmail: async () => {
    return apiRequest('/email/test-email', {
      method: 'POST',
    });
  },

  // Send custom email
  sendCustomEmail: async (emailData) => {
    return apiRequest('/email/send-custom-email', {
      method: 'POST',
      body: JSON.stringify(emailData),
    });
  },

  // Notify issue created
  notifyIssueCreated: async (issueId, userId) => {
    return apiRequest('/email/notify-issue-created', {
      method: 'POST',
      body: JSON.stringify({ issueId, userId }),
    });
  },

  // Notify status update
  notifyStatusUpdate: async (issueId, userId, newStatus) => {
    return apiRequest('/email/notify-status-update', {
      method: 'POST',
      body: JSON.stringify({ issueId, userId, newStatus }),
    });
  },

  // Notify comment added
  notifyCommentAdded: async (issueId, commentId, userId) => {
    return apiRequest('/email/notify-comment-added', {
      method: 'POST',
      body: JSON.stringify({ issueId, commentId, userId }),
    });
  },

  // Get email status
  getEmailStatus: async () => {
    return apiRequest('/email/status', { includeAuth: false });
  },
};
