import api, { getErrorMessage } from './api'

export const expenseService = {
  /**
   * Fetch all expenses for a specific group
   * @param {string} groupId UUID of the group
   * @returns {Promise<Array>} List of ExpenseResponse objects
   */
  async getGroupExpenses(groupId) {
    try {
      const response = await api.get(`/api/groups/${groupId}/expenses`)
      return response.data || []
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Create a new expense with splits
   * @param {Object} expenseData { description, amount, paidByUserId, groupId, splitType, splits: [{ userId, value }] }
   * @returns {Promise<Object>} Created ExpenseResponse object
   */
  async createExpense(expenseData) {
    try {
      const response = await api.post('/api/expenses', {
        description: expenseData.description.trim(),
        amount: Number(expenseData.amount),
        paidByUserId: expenseData.paidByUserId,
        groupId: expenseData.groupId,
        splitType: expenseData.splitType,
        splits: expenseData.splits.map((s) => ({
          userId: s.userId,
          value: Number(s.value),
        })),
      })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Update an existing expense
   * @param {string} expenseId UUID of the expense
   * @param {Object} expenseData Updated expense payload
   * @returns {Promise<Object>} Updated ExpenseResponse object
   */
  async updateExpense(expenseId, expenseData) {
    try {
      const response = await api.put(`/api/expenses/${expenseId}`, {
        description: expenseData.description.trim(),
        amount: Number(expenseData.amount),
        paidByUserId: expenseData.paidByUserId,
        groupId: expenseData.groupId,
        splitType: expenseData.splitType,
        splits: expenseData.splits.map((s) => ({
          userId: s.userId,
          value: Number(s.value),
        })),
      })
      return response.data
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },

  /**
   * Delete an expense
   * @param {string} expenseId UUID of the expense
   * @returns {Promise<void>}
   */
  async deleteExpense(expenseId) {
    try {
      await api.delete(`/api/expenses/${expenseId}`)
    } catch (error) {
      throw new Error(getErrorMessage(error))
    }
  },
}
