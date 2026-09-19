import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Layers, LogOut, User, Mail, Calendar, Shield, Sparkles } from 'lucide-react'

export const Dashboard = () => {
  const { currentUser, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white">SmartSplit</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-semibold flex items-center justify-center text-xs">
                {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="font-medium text-slate-200 hidden sm:inline">{currentUser?.name}</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" /> Authenticated via Spring Boot JWT
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Hello, {currentUser?.name || 'SmartSplit User'}!
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Phase 2 is fully connected. Your session is authenticated with your Spring Boot backend service.
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-white">Your Profile Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-800/40 border border-slate-700/40 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Name
              </div>
              <p className="text-sm font-semibold text-white">{currentUser?.name || 'N/A'}</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email
              </div>
              <p className="text-sm font-semibold text-white">{currentUser?.email || 'N/A'}</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Shield className="w-3.5 h-3.5 text-indigo-400" /> Provider
              </div>
              <p className="text-sm font-semibold text-white">{currentUser?.authProvider || 'LOCAL'}</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/40 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Member Since
              </div>
              <p className="text-sm font-semibold text-white">
                {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Active'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
