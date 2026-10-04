import api, { getErrorMessage } from './api'

export const balanceService = {
  /**
   * Fetch all balances for all members in a group
   * @param {string} groupId UUID of the group
   * @returns {Promise<{ groupId: string, balances: Array<{ userId: string, userName: string, balance: number }> }>}
   */
  async getGroupBalances(groupId) {
    try {
      const response = await api.get(`/api/groups/${groupId}/balances`)
      return response.data || { groupId, balances: [] }
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Fetch balance information for a specific user in a group
   * @param {string} groupId UUID of the group
   * @param {string} userId UUID of the user
   * @returns {Promise<{ userId: string, userName: string, balance: number }>}
   */
  async getUserBalance(groupId, userId) {
    try {
      const response = await api.get(`/api/groups/${groupId}/balances/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Fetch optimized settlement plan for a group
   * @param {string} groupId UUID of the group
   * @returns {Promise<{ groupId: string, settlements: Array<{ fromUserId: string, fromUserName: string, toUserId: string, toUserName: string, amount: number }> }>}
   */
  async getGroupSettlements(groupId) {
    try {
      const response = await api.get(`/api/groups/${groupId}/settlements`)
      return response.data || { groupId, settlements: [] }
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Fetch settlement transactions involving a specific user in a group
   * @param {string} groupId UUID of the group
   * @param {string} userId UUID of the user
   * @returns {Promise<{ groupId: string, settlements: Array<{ fromUserId: string, fromUserName: string, toUserId: string, toUserName: string, amount: number }> }>}
   */
  async getUserSettlements(groupId, userId) {
    try {
      const response = await api.get(`/api/groups/${groupId}/settlements/${userId}`)
      return response.data || { groupId, settlements: [] }
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },
}

export default balanceService
