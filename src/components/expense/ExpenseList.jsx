import React, { useState } from 'react'
import { expenseService } from '../../services/expenseService'
import {
  Receipt,
  Calendar,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Divide,
  ListOrdered,
  Percent,
  CheckCircle2,
  DollarSign
} from 'lucide-react'

export const ExpenseList = ({
  expenses = [],
  members = [],
  currentUserId,
  onAddExpenseClick,
  onExpenseDeleted,
}) => {
  const [expandedExpenseId, setExpandedExpenseId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const toggleExpand = (id) => {
    setExpandedExpenseId((prev) => (prev === id ? null : id))
  }

  const handleDelete = async (expenseId, description) => {
    if (!window.confirm(`Are you sure you want to delete the expense "${description}"?`)) {
      return
    }

    setDeletingId(expenseId)
    try {
      await expenseService.deleteExpense(expenseId)
      onExpenseDeleted(expenseId)
    } catch (err) {
      alert(err.message || 'Failed to delete expense.')
    } finally {
      setDeletingId(null)
    }
  }

  // Helper to get member name by ID
  const getMemberName = (userId) => {
    if (userId === currentUserId) return 'You'
    const member = members.find((m) => m.id === userId)
    return member ? member.name : 'Unknown'
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
          <Receipt className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-bold text-white">No Expenses Logged Yet</h3>
          <p className="text-xs text-slate-400">
            Keep track of shared costs! Add dinner, groceries, tickets, or any shared bill to split with your group.
          </p>
        </div>
        <button
          onClick={onAddExpenseClick}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add First Expense</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => {
        const isPaidByMe = expense.paidBy === currentUserId
        const isExpanded = expandedExpenseId === expense.id
        const payerName = getMemberName(expense.paidBy)

        // Find how much current user owes for this expense
        const mySplit = expense.splits?.find((s) => s.userId === currentUserId)
        const myShare = mySplit ? mySplit.amountOwed : 0

        return (
          <div
            key={expense.id}
            className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              {/* Left Details */}
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex-shrink-0 mt-0.5">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-white text-base leading-tight">
                      {expense.description}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {expense.splitType === 'EQUAL' && <Divide className="w-2.5 h-2.5" />}
                      {expense.splitType === 'EXACT' && <ListOrdered className="w-2.5 h-2.5" />}
                      {expense.splitType === 'PERCENTAGE' && <Percent className="w-2.5 h-2.5" />}
                      {expense.splitType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <span>
                      {isPaidByMe ? (
                        <span className="text-indigo-300 font-semibold">You paid</span>
                      ) : (
                        <span>
                          <strong className="text-slate-200">{payerName}</strong> paid
                        </span>
                      )}{' '}
                      ${Number(expense.amount).toFixed(2)}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {new Date(expense.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Side: Your share & Actions */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <div className="text-right">
                  {isPaidByMe ? (
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
                        You lent
                      </span>
                      <span className="text-sm font-bold text-emerald-400 flex items-center justify-end gap-0.5">
                        <ArrowUpRight className="w-3.5 h-3.5" />$
                        {(Number(expense.amount) - (Number(myShare) || 0)).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
                        Your share
                      </span>
                      <span className="text-sm font-bold text-rose-400 flex items-center justify-end gap-0.5">
                        <ArrowDownLeft className="w-3.5 h-3.5" />$
                        {Number(myShare).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-1">
                  <button
                    onClick={() => toggleExpand(expense.id)}
                    className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                    title="View split breakdown"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(expense.id, expense.description)}
                    disabled={deletingId === expense.id}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                    title="Delete expense"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable Split Breakdown */}
            {isExpanded && (
              <div className="pt-3 border-t border-slate-800/80 space-y-2 animate-in fade-in">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Split Breakdown ({expense.splits?.length || 0} participants)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {expense.splits?.map((split) => {
                    const isCurrentUser = split.userId === currentUserId
                    const participantName = getMemberName(split.userId)

                    return (
                      <div
                        key={split.userId}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs"
                      >
                        <span className="text-slate-300 font-medium">
                          {participantName} {isCurrentUser && '(You)'}
                        </span>
                        <span className="font-semibold text-white">
                          ${Number(split.amountOwed).toFixed(2)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
