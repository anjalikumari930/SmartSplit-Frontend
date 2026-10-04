import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Bell,
  CheckCheck,
  Receipt,
  Users,
  Scale,
  Sparkles,
  Loader2,
  Clock,
  Inbox
} from 'lucide-react'
import { notificationService } from '../../services/notificationService'

/**
 * Format timestamp into friendly relative time string
 * (e.g. "Just now", "5m ago", "2h ago", "3d ago")
 */
function formatRelativeTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  const minutes = Math.floor(diffInSeconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

/**
 * Determine contextual icon based on notification title/message
 */
function getNotificationIcon(title = '', message = '') {
  const combined = `${title} ${message}`.toLowerCase()
  if (combined.includes('settle') || combined.includes('payment') || combined.includes('received')) {
    return {
      icon: Scale,
      bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    }
  }
  if (combined.includes('expense') || combined.includes('paid') || combined.includes('bill')) {
    return {
      icon: Receipt,
      bg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    }
  }
  if (combined.includes('group') || combined.includes('member') || combined.includes('joined')) {
    return {
      icon: Users,
      bg: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
    }
  }
  return {
    icon: Bell,
    bg: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  }
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isMarkingAll, setIsMarkingAll] = useState(false)
  const dropdownRef = useRef(null)

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length

  // Fetch notifications
  const fetchNotifications = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true)
    try {
      const data = await notificationService.getUserNotifications(0, 15)
      setNotifications(data?.content || [])
    } catch (err) {
      console.warn('Failed to load notifications:', err.message)
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }, [])

  // Initial fetch and 30-second background polling
  useEffect(() => {
    fetchNotifications(true)

    const interval = setInterval(() => {
      fetchNotifications(false)
    }, 30000)

    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Dismiss on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Toggle dropdown
  const handleToggle = () => {
    const nextState = !isOpen
    setIsOpen(nextState)
    if (nextState) {
      fetchNotifications(false)
    }
  }

  // Mark single notification as read
  const handleMarkAsRead = async (id, currentIsRead) => {
    if (currentIsRead) return
    // Optimistic update
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    )
    try {
      await notificationService.markAsRead(id)
    } catch (err) {
      console.warn('Failed to mark notification as read:', err.message)
    }
  }

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || isMarkingAll) return
    setIsMarkingAll(true)
    // Optimistic update
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
    try {
      await notificationService.markAllAsRead()
    } catch (err) {
      console.warn('Failed to mark all notifications as read:', err.message)
      // Rollback on error
      fetchNotifications(false)
    } finally {
      setIsMarkingAll(false)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className={`relative p-2 rounded-xl border transition-all cursor-pointer ${
          isOpen
            ? 'bg-slate-800 text-white border-slate-700'
            : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700/60'
        }`}
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />

        {/* Unread Badge Indicator */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-rose-500/50 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popup */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>

            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || isMarkingAll}
              className={`flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
                unreadCount > 0 && !isMarkingAll
                  ? 'text-indigo-400 hover:text-indigo-300'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              {isMarkingAll ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <CheckCheck className="w-3 h-3" />
              )}
              <span>Mark all as read</span>
            </button>
          </div>

          {/* Notifications Feed */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                <span className="text-xs">Loading activity...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-500">
                  <Inbox className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-200">No notifications</p>
                  <p className="text-[11px] text-slate-500">
                    Activity from your shared groups will appear here.
                  </p>
                </div>
              </div>
            ) : (
              notifications.map((item) => {
                const { icon: EventIcon, bg: iconBg } = getNotificationIcon(
                  item.title,
                  item.message
                )

                return (
                  <div
                    key={item.id}
                    onClick={() => handleMarkAsRead(item.id, item.isRead)}
                    className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 text-left ${
                      !item.isRead
                        ? 'bg-indigo-950/20 hover:bg-indigo-950/30'
                        : 'hover:bg-slate-800/50'
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${iconBg}`}
                    >
                      <EventIcon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-xs font-semibold truncate ${
                            !item.isRead ? 'text-white' : 'text-slate-300'
                          }`}
                        >
                          {item.title || 'Notification'}
                        </p>
                        <span className="text-[10px] text-slate-500 shrink-0 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {formatRelativeTime(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>
                    </div>

                    {/* Unread indicator dot */}
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1 shadow-sm shadow-indigo-500" />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
