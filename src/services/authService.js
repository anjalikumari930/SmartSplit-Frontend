import api, { getErrorMessage } from './api'

export const authService = {
  /**
   * Register a new user
   * @param {Object} data { name, email, password }
   * @returns {Promise<string>} Success message from backend
   */
  async signup(data) {
    try {
      const response = await api.post('/api/auth/signup', {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Authenticate user with credentials
   * @param {Object} credentials { email, password }
   * @returns {Promise<string>} Plain JWT token string
   */
  async login(credentials) {
    try {
      const response = await api.post(
        '/api/auth/login',
        {
          email: credentials.email.trim().toLowerCase(),
          password: credentials.password,
        },
        {
          // Response is a plain text JWT string
          responseType: 'text',
        }
      )

      // Spring Boot returns the raw JWT string
      const token = typeof response.data === 'string' ? response.data.trim() : response.data?.token
      if (!token) {
        throw new Error('No authentication token received from server')
      }
      return token
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },
}
