import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import useDashboard from '../hooks/useDashboard'

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    to: '/reservations',
    label: 'Reservations',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
]

const LogoutIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

const HamburgerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const SidebarContent = ({ handleLogout, onNavClick }) => (
  <>
    <div className="flex items-center justify-center py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <img src="/images/tablebooking.png" alt="Logo" className="h-10 object-contain" />
    </div>

    <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all"
          style={({ isActive }) => ({
            backgroundColor: isActive ? '#c8a97e' : 'transparent',
            color: isActive ? '#fff' : 'rgba(200,169,126,0.7)',
          })}
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="px-3 pb-6 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all hover:bg-white/5"
        style={{ color: 'rgba(200,169,126,0.7)' }}
      >
        <LogoutIcon />
        <span>Logout</span>
      </button>
    </div>
  </>
)

export default function Layout({ children }) {
  const { handleLogout } = useDashboard()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f5f0eb' }}>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 min-h-screen flex-col flex-shrink-0" style={{ backgroundColor: '#2b2118' }}>
        <SidebarContent handleLogout={handleLogout} onNavClick={() => {}} />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className="fixed top-0 left-0 h-full w-56 flex flex-col z-50 md:hidden transition-transform duration-300"
        style={{
          backgroundColor: '#2b2118',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <SidebarContent handleLogout={handleLogout} onNavClick={() => setSidebarOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar */}
        <header className="flex md:hidden items-center justify-between px-4 py-3 shadow-sm" style={{ backgroundColor: '#2b2118' }}>
          <img src="/images/tablebooking.png" alt="Logo" className="h-8 object-contain" />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ color: '#c8a97e' }}>
            {sidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  )
}