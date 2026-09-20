import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { expenseService } from '../../services/expenseService'
import { 
  X, 
  Receipt, 
  DollarSign, 
  Users, 
  AlertCircle, 
  Loader2, 
  Check, 
  Percent, 
  Divide, 
  ListOrdered,
  Sparkles
} from 'lucide-react'

export const AddExpenseModal = ({ groupId, members = [], isOpen, onClose, onExpenseAdded }) => {
  const { currentUser } = useAuth()

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidByUserId, setPaidByUserId] = useState('')
  const [splitType, setSplitType] = useState('EQUAL') // 'EQUAL', 'EXACT', 'PERCENTAGE'
  
  // Custom split values: { [userId]: number }
  const [selectedMembers, setSelectedMembers] = useState(new Set())
  const [exactValues, setExactValues] = useState({})
  const [percentageValues, setPercentageValues] = useState({})
  
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize members and payer when modal opens
  useEffect(() => {
    if (isOpen && members.length > 0) {
      // Default payer to logged-in user if member of group, else first member
      const isUserInGroup = members.some((m) => m.id === currentUser?.id)
      setPaidByUserId(isUserInGroup ? currentUser.id : members[0].id)

      // Default: select all members for equal split
      setSelectedMembers(new Set(members.map((m) => m.id)))

      // Default exact and percentage states
      const initialExact = {}
      const initialPercentage = {}
      const evenPercent = (100 / members.length).toFixed(2)

      members.forEach((m) => {
        initialExact[m.id] = ''
        initialPercentage[m.id] = evenPercent
      })
      setExactValues(initialExact)
      setPercentageValues(initialPercentage)
      setError(null)
    }
  }, [isOpen, members, currentUser])

  const totalAmountNum = parseFloat(amount) || 0

  // Calculation summaries
  const equalCount = selectedMembers.size
  const equalPerPerson = equalCount > 0 && totalAmountNum > 0 ? (totalAmountNum / equalCount).toFixed(2) : '0.00'

  const exactSum = useMemo(() => {
    return Object.values(exactValues).reduce((acc, val) => acc + (parseFloat(val) || 0), 0)
  }, [exactValues])

  const percentageSum = useMemo(() => {
    return Object.values(percentageValues).reduce((acc, val) => acc + (parseFloat(val) || 0), 0)
  }, [percentageValues])

  if (!isOpen) return null

  const handleMemberToggle = (memberId) => {
    const next = new Set(selectedMembers)
    if (next.has(memberId)) {
      if (next.size > 1) {
        next.delete(memberId)
      }
    } else {
      next.add(memberId)
    }
    setSelectedMembers(next)
  }

  const handleExactChange = (memberId, value) => {
    setExactValues((prev) => ({ ...prev, [memberId]: value }))
  }

  const handlePercentageChange = (memberId, value) => {
    setPercentageValues((prev) => ({ ...prev, [memberId]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!description.trim()) {
      setError('Please provide a description.')
      return
    }

    if (!totalAmountNum || totalAmountNum <= 0) {
      setError('Please enter a valid amount greater than zero.')
      return
    }

    if (!paidByUserId) {
      setError('Please select who paid.')
      return
    }

    let splits = []

    if (splitType === 'EQUAL') {
      if (selectedMembers.size === 0) {
        setError('At least one member must be selected for the split.')
        return
      }
      splits = Array.from(selectedMembers).map((userId) => ({
        userId,
        value: parseFloat(equalPerPerson) || 1.0,
      }))
    } else if (splitType === 'EXACT') {
      const activeMembers = members.filter((m) => (parseFloat(exactValues[m.id]) || 0) > 0)
      if (activeMembers.length === 0) {
        setError('Please enter exact amounts for participants.')
        return
      }

      const diff = Math.abs(exactSum - totalAmountNum)
      if (diff > 0.01) {
        setError(
          `The sum of exact amounts ($${exactSum.toFixed(2)}) must equal the total amount ($${totalAmountNum.toFixed(2)}). Difference: $${(totalAmountNum - exactSum).toFixed(2)}`
        )
        return
      }

      splits = activeMembers.map((m) => ({
        userId: m.id,
        value: parseFloat(exactValues[m.id]) || 0,
      }))
    } else if (splitType === 'PERCENTAGE') {
      const activeMembers = members.filter((m) => (parseFloat(percentageValues[m.id]) || 0) > 0)
      if (activeMembers.length === 0) {
        setError('Please enter percentages for participants.')
        return
      }

      const diff = Math.abs(percentageSum - 100)
      if (diff > 0.01) {
        setError(`The sum of percentages (${percentageSum.toFixed(1)}%) must equal exactly 100%.`)
        return
      }

      splits = activeMembers.map((m) => ({
        userId: m.id,
        value: parseFloat(percentageValues[m.id]) || 0,
      }))
    }

    setIsSubmitting(true)
    try {
      await expenseService.createExpense({
        description: description.trim(),
        amount: totalAmountNum,
        paidByUserId,
        groupId,
        splitType,
        splits,
      })

      // Reset
      setDescription('')
      setAmount('')
      onExpenseAdded()
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create expense.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Receipt className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Add New Expense</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Description & Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Description
              </label>
              <input
                type="text"
                required
                autoFocus
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Dinner, Groceries, Hotel"
                className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Amount ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <DollarSign className="w-4 h-4" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Paid By Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Paid By
            </label>
            <select
              value={paidByUserId}
              onChange={(e) => setPaidByUserId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} {member.id === currentUser?.id ? '(You)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Split Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Split Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSplitType('EQUAL')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  splitType === 'EQUAL'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Divide className="w-3.5 h-3.5" />
                <span>Equal</span>
              </button>

              <button
                type="button"
                onClick={() => setSplitType('EXACT')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  splitType === 'EXACT'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Exact ($)</span>
              </button>

              <button
                type="button"
                onClick={() => setSplitType('PERCENTAGE')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  splitType === 'PERCENTAGE'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Percent className="w-3.5 h-3.5" />
                <span>Percentage</span>
              </button>
            </div>
          </div>

          {/* Split Customization Container */}
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-3">
            {/* Split Type 1: EQUAL */}
            {splitType === 'EQUAL' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Split equally among selected:</span>
                  <span className="font-bold text-indigo-300">
                    ${equalPerPerson} / person
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {members.map((member) => {
                    const isChecked = selectedMembers.has(member.id)
                    return (
                      <div
                        key={member.id}
                        onClick={() => handleMemberToggle(member.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-indigo-950/30 border-indigo-500/40 text-white'
                            : 'bg-slate-900/40 border-slate-800 text-slate-500'
                        }`}
                      >
                        <span className="text-xs font-medium">
                          {member.name} {member.id === currentUser?.id ? '(You)' : ''}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                            isChecked
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'border-slate-700 bg-slate-800'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Split Type 2: EXACT */}
            {splitType === 'EXACT' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Specify exact dollar amounts:</span>
                  <span
                    className={`font-bold ${
                      Math.abs(exactSum - totalAmountNum) < 0.01
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    ${exactSum.toFixed(2)} / ${totalAmountNum.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between gap-3 p-2 bg-slate-900/50 rounded-xl border border-slate-800"
                    >
                      <span className="text-xs text-white font-medium truncate flex-1">
                        {member.name} {member.id === currentUser?.id ? '(You)' : ''}
                      </span>
                      <div className="relative w-28">
                        <span className="absolute left-2.5 top-2 text-slate-500 text-xs">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={exactValues[member.id] || ''}
                          onChange={(e) => handleExactChange(member.id, e.target.value)}
                          className="w-full pl-6 pr-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Split Type 3: PERCENTAGE */}
            {splitType === 'PERCENTAGE' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Specify percentage shares:</span>
                  <span
                    className={`font-bold ${
                      Math.abs(percentageSum - 100) < 0.01
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {percentageSum.toFixed(1)}% / 100%
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {members.map((member) => {
                    const pct = parseFloat(percentageValues[member.id]) || 0
                    const calcDollars = ((totalAmountNum * pct) / 100).toFixed(2)

                    return (
                      <div
                        key={member.id}
                        className="flex items-center justify-between gap-3 p-2 bg-slate-900/50 rounded-xl border border-slate-800"
                      >
                        <div className="flex-1 truncate">
                          <span className="text-xs text-white font-medium">
                            {member.name} {member.id === currentUser?.id ? '(You)' : ''}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-2">
                            (${calcDollars})
                          </span>
                        </div>
                        <div className="relative w-24">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            placeholder="0"
                            value={percentageValues[member.id] || ''}
                            onChange={(e) => handlePercentageChange(member.id, e.target.value)}
                            className="w-full pl-2 pr-6 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white text-right focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                          <span className="absolute right-2 top-2 text-slate-500 text-xs">%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Expense...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save Expense</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
