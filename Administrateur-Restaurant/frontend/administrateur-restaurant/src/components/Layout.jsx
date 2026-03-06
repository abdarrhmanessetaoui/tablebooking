import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useDashboard from '../hooks/useDashboard'
import Sidebar from './Sidebar'
import { HamburgerIcon, CloseIcon } from '../data/sidebarItems'
import {
  MdNotifications,
  MdCalendarToday,
} from 'react-icons/md'

const PAGE_TITLES = {
  '/dashboard':     'Dashboard',
  '/reservations':  'Reservations',
  '/blocked-dates': 'Blocked Dates',
  '/calendar':      'Timeline',
  '/reports':       'Reports',
  '/settings':      'Settings',
}

export default function Layout({ children }) {
  const { handleLogout } = useDashboard()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard'

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f5f0eb' }}>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 min-h-screen flex-col flex-shrink-0" style={{ backgroundColor: '#2b2118' }}>
        <Sidebar handleLogout={handleLogout} onNavClick={() => {}} />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className="fixed top-0 left-0 h-full w-60 flex flex-col z-50 md:hidden transition-transform duration-300"
        style={{
          backgroundColor: '#2b2118',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <Sidebar handleLogout={handleLogout} onNavClick={() => setSidebarOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header bar */}
        <header
          className="flex items-center justify-between px-4 sm:px-8 py-3 flex-shrink-0"
          style={{ backgroundColor: 'rgba(200,169,126,0.15)', borderBottom: '1px solid #f0ebe5' }}
        >
          {/* Left — mobile hamburger + page title */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-lg"
              style={{ color: '#2b2118' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
            <div>
              <h2 className="text-sm font-bold text-gray-900">{pageTitle}</h2>
              <p className="text-xs text-gray-400 hidden sm:block">{today}</p>
            </div>
          </div>

          {/* Right — restaurant info + avatar */}
          <div className="flex items-center gap-3">

            {/* Date pill — desktop only */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium text-gray-500"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#fafafa' }}
            >
              <MdCalendarToday size={13} color="#c8a97e" />
              {today}
            </div>

            {/* Notification bell */}
            <button
              className="relative w-9 h-9 rounded-xl flex items-center justify-center border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <MdNotifications size={18} color="#6b7280" />
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200" />

            {/* Restaurant avatar + name */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: 'rgba(43,33,24,0.08)' }}
              >
                <img src="/images/tablebooking.png" alt="Logo" className="w-6 h-6 object-contain" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-gray-800 leading-tight">Dal Corso</p>
                <p className="text-xs text-gray-400">Marrakech</p>
              </div>
            </div>

          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  )
}