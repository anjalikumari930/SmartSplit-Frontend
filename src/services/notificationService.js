import api, { getErrorMessage } from './api'

export const notificationService = {
  /**
   * Fetch paginated notifications for the logged-in user
   * @param {number} page Page number (0-indexed, default 0)
   * @param {number} size Page size (default 15)
   * @returns {Promise<{ content: Array, totalElements: number, totalPages: number, number: number }>}
   */
  async getUserNotifications(page = 0, size = 15) {
    try {
      const response = await api.get('/api/notifications', {
        params: { page, size },
      })
      return response.data || { content: [], totalElements: 0, totalPages: 0 }
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Mark a single notification as read
   * @param {string} notificationId UUID of the notification
   * @returns {Promise<void>}
   */
  async markAsRead(notificationId) {
    try {
      await api.patch(`/api/notifications/${notificationId}/read`)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Mark all unread notifications as read for current user
   * @returns {Promise<void>}
   */
  async markAllAsRead() {
    try {
      await api.patch('/api/notifications/read-all')
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },
}

export default notificationService
