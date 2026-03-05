import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useDashboard from '../hooks/useDashboard'
import Sidebar from './Sidebar'
import { HamburgerIcon, CloseIcon } from '../data/sidebarItems'
import { MdNotifications, MdKeyboardArrowDown } from 'react-icons/md'

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

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#2b2118' }}>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 min-h-screen flex-col flex-shrink-0">
        <Sidebar handleLogout={handleLogout} onNavClick={() => {}} />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside
        className="fixed top-0 left-0 h-full w-60 flex flex-col z-50 md:hidden transition-transform duration-300"
        style={{
          backgroundColor: '#2b2118',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <Sidebar handleLogout={handleLogout} onNavClick={() => setSidebarOpen(false)} />
      </aside>

      {/* Right side — content area with rounded top-left */}
      <div
        className="flex-1 flex flex-col min-w-0 min-h-screen"
        style={{
          backgroundColor: '#f5f0eb',
          borderRadius: '24px 0 0 24px',
          overflow: 'hidden',
        }}
      >

        {/* Top header */}
        <header
          className="flex items-center justify-between px-6 sm:px-8 py-4 flex-shrink-0 bg-white"
          style={{ borderBottom: '1px solid #f0ebe5' }}
        >
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-xl"
              style={{ color: '#2b2118' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
            <h2 className="text-base font-bold text-gray-900">{pageTitle}</h2>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">

            {/* Notification */}
            <button className="relative w-9 h-9 rounded-2xl flex items-center justify-center bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors">
              <MdNotifications size={19} color="#6b7280" />
              {/* Badge */}
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ backgroundColor: '#c8a97e' }}
              />
            </button>

            {/* Divider */}
            <div className="w-px h-7 mx-1 bg-gray-200" />

            {/* Profile */}
            <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-2xl hover:bg-gray-50 transition-colors">
              <div
                className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: '#2b2118' }}
              >
                <img src="/images/tablebooking.png" alt="Logo" className="w-5 h-5 object-contain" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-gray-800 leading-tight">Dal Corso</p>
                <p className="text-xs text-gray-400 leading-tight">Marrakech</p>
              </div>
              <MdKeyboardArrowDown size={16} color="#9ca3af" />
            </button>

          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  )
}