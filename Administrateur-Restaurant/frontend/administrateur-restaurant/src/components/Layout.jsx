import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useDashboard from '../hooks/useDashboard'
import Sidebar from './Sidebar'
import { HamburgerIcon, CloseIcon } from '../data/sidebarItems'
import { MdKeyboardArrowDown } from 'react-icons/md'

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

  const handleSidebarClose = () => setSidebarOpen(false)
  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen)

  return (
    <div className="min-h-screen flex gap-4 p-4 bg-amber-950 md:gap-6 md:p-6" style={{ backgroundColor: '#2b2118' }}>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-60 flex-col flex-shrink-0">
        <Sidebar handleLogout={handleLogout} onNavClick={() => {}} />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          onClick={handleSidebarClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300"
          aria-label="Close sidebar"
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className="fixed top-0 left-0 h-full w-60 flex flex-col z-50 md:hidden shadow-xl transition-transform duration-300 ease-out"
        style={{
          backgroundColor: '#2b2118',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <Sidebar handleLogout={handleLogout} onNavClick={handleSidebarClose} />
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden rounded-2xl shadow-sm bg-amber-50" style={{ backgroundColor: '#f5f0eb', minHeight: 'calc(100vh - 32px)' }}>

        {/* Header */}
        <header
          className="flex items-center justify-between px-6 sm:px-8 py-5 flex-shrink-0 border-b"
          style={{
            backgroundColor: '#2b2118',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          {/* Left Section */}
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={handleSidebarToggle}
              className="md:hidden p-2 rounded-lg text-amber-100 hover:bg-white/10 active:bg-white/20 transition-all duration-200"
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              aria-expanded={sidebarOpen}
              aria-controls="mobile-sidebar"
            >
              {sidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-white truncate" style={{ color: '#ffffff' }}>
              {pageTitle}
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 sm:gap-5">

            {/* User Profile Button */}
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 active:bg-white/15 transition-all duration-200 group">
              <div
                className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(200,169,126,0.15)' }}
              >
                <img 
                  src="/images/tablebooking.png" 
                  alt="Restaurant Logo" 
                  className="w-5 h-5 object-contain"
                  loading="lazy"
                />
              </div>
              <div className="hidden sm:flex flex-col text-left min-w-0">
                <p className="text-xs font-bold text-white leading-tight">Dal Corso</p>
                <p className="text-xs leading-tight truncate" style={{ color: 'rgba(200,169,126,0.65)' }}>
                  Marrakech
                </p>
              </div>
              <MdKeyboardArrowDown 
                size={18} 
                color="rgba(200,169,126,0.65)"
                className="flex-shrink-0 transition-transform duration-200 group-hover:translate-y-0.5"
              />
            </button>

          </div>
        </header>

        {/* Page Content */}
        <main 
          className="flex-1 overflow-y-auto"
          style={{ backgroundColor: '#f5f0eb' }}
          role="main"
        >
          {children}
        </main>

      </div>
    </div>
  )
}
