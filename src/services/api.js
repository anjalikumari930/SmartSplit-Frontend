import axios from 'axios'

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartsplit_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Global 401 Unauthorized handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid credentials
      localStorage.removeItem('smartsplit_token')
      localStorage.removeItem('smartsplit_user')

      // Avoid redirect loops if already on auth routes
      const currentPath = window.location.pathname
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.dispatchEvent(new CustomEvent('smartsplit_unauthorized'))
      }
    }
    return Promise.reject(error)
  }
)

/**
 * Utility function to extract a clean, user-friendly error message from Axios errors
 */
export const getErrorMessage = (error) => {
  if (error.response) {
    // Backend returned an error response
    if (typeof error.response.data === 'string') {
      return error.response.data
    }
    if (error.response.data && error.response.data.message) {
      return error.response.data.message
    }
    return `Server error: ${error.response.status}`
  }
  if (error.request) {
    return 'Unable to reach backend server. Please make sure the Spring Boot service is running.'
  }
  return error.message || 'An unexpected error occurred.'
}

export default api
