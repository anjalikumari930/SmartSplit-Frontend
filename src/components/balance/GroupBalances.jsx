import React from 'react'
import { TrendingUp, TrendingDown, CheckCircle2, Wallet, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

/**
 * GroupBalances Component
 * Renders the net balance breakdown for all members of a group,
 * highlighting the current user's personal balance status.
 *
 * @param {Array} balances List of { userId, userName, balance } objects
 * @param {Array} members List of GroupMember objects for avatar/metadata enrichment
 */
export function GroupBalances({ balances = [], members = [] }) {
  const { currentUser } = useAuth()

  // Find current user's balance
  const myBalanceObj = balances.find((b) => b.userId === currentUser?.id)
  const myBalance = myBalanceObj ? Number(myBalanceObj.balance) : 0

  // Calculate totals
  const totalReceivable = balances
    .filter((b) => Number(b.balance) > 0)
    .reduce((sum, b) => sum + Number(b.balance), 0)

  const totalPayable = balances
    .filter((b) => Number(b.balance) < 0)
    .reduce((sum, b) => sum + Math.abs(Number(b.balance)), 0)

  return (
    <div className="space-y-6">
      {/* Current User Net Position Banner */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          myBalance > 0
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : myBalance < 0
            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            : 'bg-slate-900/60 border-slate-800 text-slate-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                myBalance > 0
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : myBalance < 0
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-indigo-500/20 text-indigo-400'
              }`}
            >
              {myBalance > 0 ? (
                <TrendingUp className="w-6 h-6" />
              ) : myBalance < 0 ? (
                <TrendingDown className="w-6 h-6" />
              ) : (
                <CheckCircle2 className="w-6 h-6" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Your Group Balance
              </p>
              <h3 className="text-xl sm:text-2xl font-black">
                {myBalance > 0 ? (
                  <span className="text-emerald-400">+${myBalance.toFixed(2)}</span>
                ) : myBalance < 0 ? (
                  <span className="text-rose-400">-${Math.abs(myBalance).toFixed(2)}</span>
                ) : (
                  <span className="text-slate-200">$0.00</span>
                )}
              </h3>
            </div>
          </div>

          <div className="text-xs sm:text-right text-slate-400">
            {myBalance > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                You are owed in this group
              </span>
            )}
            {myBalance < 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-medium">
                You owe money in this group
              </span>
            )}
            {myBalance === 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
                You are all settled up!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Member Balances Section */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Member Net Balances
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {balances.length} {balances.length === 1 ? 'member' : 'members'}
          </span>
        </div>

        {balances.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No member balance details available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {balances.map((item) => {
              const numBal = Number(item.balance || 0)
              const isMe = item.userId === currentUser?.id
              const isPositive = numBal > 0.005
              const isNegative = numBal < -0.005
              const isZero = !isPositive && !isNegative

              return (
                <div
                  key={item.userId}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isMe
                      ? 'border-indigo-500/40 bg-indigo-950/20'
                      : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isPositive
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isNegative
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.userName
                        ? item.userName
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()
                        : <User className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-white truncate">
                          {item.userName || 'Member'}
                        </p>
                        {isMe && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {isPositive && 'Gets back'}
                        {isNegative && 'Owes'}
                        {isZero && 'Settled up'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm font-bold block ${
                        isPositive
                          ? 'text-emerald-400'
                          : isNegative
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {isPositive && `+$${numBal.toFixed(2)}`}
                      {isNegative && `-$${Math.abs(numBal).toFixed(2)}`}
                      {isZero && '$0.00'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupBalances
