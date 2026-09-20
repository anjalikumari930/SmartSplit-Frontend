import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { groupService } from '../services/groupService'
import { AddMemberModal } from '../components/groups/AddMemberModal'
import {
  Users,
  ArrowLeft,
  UserPlus,
  Trash2,
  LogOut,
  Shield,
  User,
  Calendar,
  Receipt,
  Scale,
  Loader2,
  AlertCircle
} from 'lucide-react'

export const GroupDetails = () => {
  const { groupId } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [activeTab, setActiveTab] = useState('members') // 'members', 'expenses', 'balances'
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [groupData, membersData] = await Promise.all([
        groupService.getGroupDetails(groupId),
        groupService.getGroupMembers(groupId),
      ])
      setGroup(groupData)
      setMembers(membersData)
    } catch (err) {
      setError(err.message || 'Failed to load group details.')
    } finally {
      setIsLoading(false)
    }
  }, [groupId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const isAdmin = members.some(
    (m) => m.id === currentUser?.id && m.role === 'ADMIN'
  ) || group?.createdBy === currentUser?.id

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from this group?`)) {
      return
    }

    try {
      await groupService.removeMember(groupId, memberId)
      setMembers((prev) => prev.filter((m) => m.id !== memberId))
    } catch (err) {
      alert(err.message || 'Failed to remove member.')
    }
  }

  const handleLeaveGroup = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) {
      return
    }

    setIsProcessing(true)
    try {
      await groupService.leaveGroup(groupId)
      navigate('/dashboard')
    } catch (err) {
      alert(err.message || 'Failed to leave group.')
      setIsProcessing(false)
    }
  }

  const handleDeleteGroup = async () => {
    if (
      !window.confirm(
        'WARNING: This will permanently delete the group, all expenses, and balance settlements. Continue?'
      )
    ) {
      return
    }

    setIsProcessing(true)
    try {
      await groupService.deleteGroup(groupId)
      navigate('/dashboard')
    } catch (err) {
      alert(err.message || 'Failed to delete group.')
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-sm font-medium">Loading group details from SmartSplit backend...</p>
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="space-y-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <span>{error || 'Group not found.'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Back button */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Group Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-extrabold text-xl shadow-inner">
            {group.name ? group.name.charAt(0).toUpperCase() : 'G'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-white tracking-tight">{group.name}</h1>
              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Created {new Date(group.createdAt).toLocaleDateString()}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {members.length} member{members.length === 1 ? '' : 's'}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsAddMemberModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>

          <button
            onClick={handleLeaveGroup}
            disabled={isProcessing}
            title="Leave this group"
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave</span>
          </button>

          {isAdmin && (
            <button
              onClick={handleDeleteGroup}
              disabled={isProcessing}
              title="Delete group permanently"
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'members'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Members ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'expenses'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Expenses</span>
        </button>

        <button
          onClick={() => setActiveTab('balances')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'balances'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Balances &amp; Settlements</span>
        </button>
      </div>

      {/* Tab 1: Members */}
      {activeTab === 'members' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Group Members</h3>
            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add Member
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {members.map((member) => {
              const isCurrentUser = member.id === currentUser?.id
              return (
                <div key={member.id} className="py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-bold flex items-center justify-center text-xs">
                      {member.name ? member.name.charAt(0).toUpperCase() : 'M'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">
                          {member.name} {isCurrentUser && '(You)'}
                        </span>
                        {member.role === 'ADMIN' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            ADMIN
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">
                            MEMBER
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{member.email}</p>
                    </div>
                  </div>

                  {/* Actions for Admin on other members */}
                  {isAdmin && !isCurrentUser && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.name)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors text-xs font-medium flex items-center gap-1 cursor-pointer"
                      title="Remove from group"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Expenses (Placeholder for Phase 6) */}
      {activeTab === 'expenses' && (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Expense Tracking</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Ready for Phase 6. You will be able to log shared expenses, select EQUAL, EXACT, or PERCENTAGE splits, and track receipts.
          </p>
        </div>
      )}

      {/* Tab 3: Balances & Settlements (Placeholder for Phase 7) */}
      {activeTab === 'balances' && (
        <div className="bg-slate-900/40 border border-dashed border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Smart Debt Simplification</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Ready for Phase 7. SmartSplit will automatically minimize settlement transactions across your group members using your backend graph algorithm.
          </p>
        </div>
      )}

      {/* Add Member Modal */}
      <AddMemberModal
        groupId={groupId}
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onMemberAdded={loadData}
      />
    </div>
  )
}
