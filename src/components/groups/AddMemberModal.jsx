import React, { useState } from 'react'
import { userService } from '../../services/userService'
import { groupService } from '../../services/groupService'
import { X, UserPlus, Search, UserCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

export const AddMemberModal = ({ groupId, isOpen, onClose, onMemberAdded }) => {
  const [email, setEmail] = useState('')
  const [foundUser, setFoundUser] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  if (!isOpen) return null

  const handleSearch = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setFoundUser(null)

    const trimmed = email.trim()
    if (!trimmed) {
      setError('Please enter an email address.')
      return
    }

    setIsSearching(true)
    try {
      const user = await userService.getUserByEmail(trimmed)
      setFoundUser(user)
    } catch (err) {
      setError(err.message || 'No registered user found with that email address.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddMember = async () => {
    if (!foundUser) return
    setError(null)
    setIsAdding(true)

    try {
      await groupService.addMember(groupId, foundUser.id)
      setSuccess(`${foundUser.name} added to the group successfully!`)
      onMemberAdded()
      setTimeout(() => {
        onClose()
        setEmail('')
        setFoundUser(null)
        setSuccess(null)
      }, 1200)
    } catch (err) {
      setError(err.message || 'Failed to add member to group.')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Add Member to Group</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
              <span>{success}</span>
            </div>
          )}

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Search by Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setFoundUser(null)
                  setError(null)
                }}
                placeholder="registered.user@example.com"
                className="flex-1 px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl border border-slate-700 transition-colors disabled:opacity-50"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Search</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Enter the exact email address registered in SmartSplit.
            </p>
          </form>

          {/* Found User Card */}
          {foundUser && (
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                  {foundUser.name ? foundUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">{foundUser.name}</h4>
                  <p className="text-xs text-slate-400">{foundUser.email}</p>
                </div>
              </div>

              <button
                onClick={handleAddMember}
                disabled={isAdding}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-md cursor-pointer"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Adding to Group...</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Confirm &amp; Add Member</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
