import api, { getErrorMessage } from './api'

export const userService = {
  /**
   * Fetch currently authenticated user profile
   * @returns {Promise<Object>} User profile object
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/api/users/me')
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Find a registered user by email address (used for adding members to groups)
   * @param {string} email
   * @returns {Promise<Object>} User details { id, name, email }
   */
  async getUserByEmail(email) {
    try {
      const response = await api.get('/api/users/by-email', {
        params: { email: email.trim().toLowerCase() },
      })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },
}
