import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useDashboard from '../hooks/useDashboard'
import Sidebar from './Sidebar'
import { HamburgerIcon, CloseIcon } from '../data/sidebarItems'
import { MdKeyboardArrowDown, MdMail, MdChat } from 'react-icons/md'

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
          className="flex items-center justify-between px-6 sm:px-8 py-4 flex-shrink-0"
          style={{
            backgroundColor: '#1a1410',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {/* Left Section - Logo/Restaurant Name */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleSidebarToggle}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-200"
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
            <div className="hidden md:flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#c8a97e' }}
              >
                <img 
                  src="/images/tablebooking.png" 
                  alt="Restaurant Logo" 
                  className="w-5 h-5 object-contain"
                  loading="lazy"
                />
              </div>
              <span className="text-sm font-semibold text-white">Dal Corso</span>
            </div>
          </div>

          {/* Right Section - Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Action Icons */}
            <button 
              className="p-2 rounded-md hover:bg-white/10 transition-all duration-200"
              aria-label="Messages"
            >
              <MdMail size={20} color="rgba(200,169,126,0.8)" />
            </button>
            
            <button 
              className="p-2 rounded-md hover:bg-white/10 transition-all duration-200"
              aria-label="Chat"
            >
              <MdChat size={20} color="rgba(200,169,126,0.8)" />
            </button>

            {/* Divider */}
            <div className="w-px h-6 mx-1" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

            {/* User Profile Dropdown */}
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10 transition-all duration-200 group">
              <div
                className="w-8 h-8 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(200,169,126,0.2)' }}
              >
                <img 
                  src="/images/tablebooking.png" 
                  alt="User Avatar" 
                  className="w-5 h-5 object-contain"
                  loading="lazy"
                />
              </div>
              <span className="hidden sm:block text-xs font-medium text-white">Erza Miller</span>
              <MdKeyboardArrowDown 
                size={16} 
                color="rgba(200,169,126,0.7)"
                className="flex-shrink-0"
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
