import React from 'react'
import { CheckCircle2, ArrowRight, ShieldCheck, Layers, GitBranch } from 'lucide-react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-slate-800/80 backdrop-blur border border-slate-700/60 rounded-2xl p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Layers className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">SmartSplit Frontend</h1>
              <p className="text-sm text-slate-400">Expense Splitting & Settlement Application</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Phase 1 Ready
          </span>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1 text-sm">
              <GitBranch className="w-4 h-4" /> Multi-Repo Setup
            </div>
            <p className="text-xs text-slate-300">
              Dedicated repository on branch <code className="text-indigo-300 font-mono">feature/task1-setup</code>.
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1 text-sm">
              <ShieldCheck className="w-4 h-4" /> Backend Dev Proxy
            </div>
            <p className="text-xs text-slate-300">
              Proxying <code className="text-indigo-300 font-mono">/api</code> &amp; <code className="text-indigo-300 font-mono">/groups</code> to Spring Boot on port 8080.
            </p>
          </div>
        </div>

        {/* Stack Badges */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Installed Stack</h2>
          <div className="flex flex-wrap gap-2">
            {['React 19', 'Vite 8', 'Tailwind CSS v4', 'React Router 7', 'Axios', 'Lucide Icons'].map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-700/50 text-slate-200 border border-slate-600/40"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Next Step Banner */}
        <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-300">Next: Phase 2</p>
            <p className="text-xs text-slate-400">Centralized API Client &amp; AuthContext (JWT Authentication)</p>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-all shadow-md"
          >
            Ready <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
