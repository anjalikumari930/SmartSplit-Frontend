import React from 'react'
import { ArrowRight, CheckCircle2, Sparkles, User, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

/**
 * SettlementList Component
 * Visualizes the graph-simplified debt settlement transactions.
 *
 * @param {Array} settlements List of { fromUserId, fromUserName, toUserId, toUserName, amount } objects
 */
export function SettlementList({ settlements = [] }) {
  const { currentUser } = useAuth()

  // Filter out any zero or invalid amounts just in case
  const validSettlements = settlements.filter(
    (s) => Number(s.amount) > 0.009
  )

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Smart Debt Settlement Plan
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Splitwise-style graph simplification minimizing the total number of payments.
          </p>
        </div>

        {validSettlements.length > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 self-start sm:self-auto">
            {validSettlements.length} {validSettlements.length === 1 ? 'payment' : 'payments'} required
          </span>
        )}
      </div>

      {/* Settlements Feed */}
      {validSettlements.length === 0 ? (
        <div className="py-12 px-4 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-white">All Settled Up!</h4>
          <p className="text-xs text-slate-400 max-w-sm">
            There are no pending debts in this group. Everyone has paid their fair share.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {validSettlements.map((item, index) => {
            const isFromMe = item.fromUserId === currentUser?.id
            const isToMe = item.toUserId === currentUser?.id
            const isMyTransaction = isFromMe || isToMe
            const amount = Number(item.amount || 0).toFixed(2)

            return (
              <div
                key={`${item.fromUserId}-${item.toUserId}-${index}`}
                className={`p-4 rounded-2xl border transition-all ${
                  isFromMe
                    ? 'bg-rose-950/20 border-rose-500/30 shadow-md shadow-rose-950/20'
                    : isToMe
                    ? 'bg-emerald-950/20 border-emerald-500/30 shadow-md shadow-emerald-950/20'
                    : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Payer and Payee Flow */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    {/* From User */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                        {item.fromUserName
                          ? item.fromUserName
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()
                          : <User className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {isFromMe ? 'You' : item.fromUserName || 'Member'}
                      </span>
                    </div>

                    {/* Arrow with Action text */}
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <span className="text-xs font-medium hidden sm:inline text-slate-400">pays</span>
                      <ArrowRight className="w-4 h-4 text-indigo-400" />
                    </div>

                    {/* To User */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                        {item.toUserName
                          ? item.toUserName
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')
                              .toUpperCase()
                          : <User className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {isToMe ? 'You' : item.toUserName || 'Member'}
                      </span>
                    </div>
                  </div>

                  {/* Amount and Status Pill */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-black text-white">
                        ${amount}
                      </span>
                    </div>

                    {isFromMe && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        You pay
                      </span>
                    )}

                    {isToMe && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        You receive
                      </span>
                    )}

                    {!isMyTransaction && (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                        Group Debt
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SettlementList
