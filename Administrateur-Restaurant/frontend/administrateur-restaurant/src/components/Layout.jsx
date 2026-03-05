import { useState } from 'react'
import useDashboard from '../hooks/useDashboard'
import Sidebar from './Sidebar'
import { HamburgerIcon, CloseIcon } from '../data/sidebarItems'

export default function Layout({ children }) {
  const { handleLogout } = useDashboard()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f5f0eb' }}>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 min-h-screen flex-col flex-shrink-0" style={{ backgroundColor: '#2b2118' }}>
        <Sidebar handleLogout={handleLogout} onNavClick={() => {}} />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar drawer */}
      <aside
        className="fixed top-0 left-0 h-full w-56 flex flex-col z-50 md:hidden transition-transform duration-300"
        style={{
          backgroundColor: '#2b2118',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <Sidebar handleLogout={handleLogout} onNavClick={() => setSidebarOpen(false)} />
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