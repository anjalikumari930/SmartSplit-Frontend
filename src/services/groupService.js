import api, { getErrorMessage } from './api'

export const groupService = {
  /**
   * Get all groups the current user belongs to
   * @returns {Promise<Array>} List of GroupResponse objects
   */
  async getUserGroups() {
    try {
      const response = await api.get('/api/groups')
      return response.data || []
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Create a new expense group
   * @param {string} name Group name (3-50 chars)
   * @returns {Promise<Object>} Created GroupResponse object
   */
  async createGroup(name) {
    try {
      const response = await api.post('/api/groups', {
        name: name.trim(),
      })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Get details of a single group
   * @param {string} groupId UUID of the group
   * @returns {Promise<Object>} GroupResponse object
   */
  async getGroupDetails(groupId) {
    try {
      const response = await api.get(`/api/groups/${groupId}`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Get all members belonging to a group
   * @param {string} groupId UUID of the group
   * @returns {Promise<Array>} List of GroupMemberResponse objects { id, name, email, role }
   */
  async getGroupMembers(groupId) {
    try {
      const response = await api.get(`/api/groups/${groupId}/members`)
      return response.data || []
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Add a member to an existing group
   * @param {string} groupId UUID of the group
   * @param {string} userId UUID of the user to add
   * @returns {Promise<void>}
   */
  async addMember(groupId, userId) {
    try {
      await api.post(`/api/groups/${groupId}/members`, { userId })
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Remove a member from a group (admin only)
   * @param {string} groupId UUID of the group
   * @param {string} memberId UUID of the member to remove
   * @returns {Promise<void>}
   */
  async removeMember(groupId, memberId) {
    try {
      await api.delete(`/api/groups/${groupId}/members/${memberId}`)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Leave a group as the current user
   * @param {string} groupId UUID of the group
   * @returns {Promise<void>}
   */
  async leaveGroup(groupId) {
    try {
      await api.post(`/api/groups/${groupId}/leave`)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Delete a group and all associated data (admin only)
   * @param {string} groupId UUID of the group
   * @returns {Promise<void>}
   */
  async deleteGroup(groupId) {
    try {
      await api.delete(`/api/groups/${groupId}`)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },
}
