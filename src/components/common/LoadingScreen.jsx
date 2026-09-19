import React from 'react'
import { Loader2 } from 'lucide-react'

export const LoadingScreen = ({ message = 'Loading SmartSplit...' }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-300 text-sm font-medium">{message}</p>
      </div>
    </div>
  )
}
