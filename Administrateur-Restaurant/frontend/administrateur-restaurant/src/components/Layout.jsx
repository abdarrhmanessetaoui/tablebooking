import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useDashboard from '../hooks/Dashboard/useDashboard'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import Sidebar from './Sidebar'
import { HamburgerIcon, CloseIcon } from '../data/sidebarItems'

const PAGE_TITLES = {
  '/dashboard':     'Dashboard',
  '/reservations':  'Réservations',
  '/blocked-dates': 'Dates bloquées',
  '/calendar':      'Planning',
  '/reports':       'Rapports',
  '/settings':      'Paramètres',
}

export default function Layout({ children }) {
  const { handleLogout }              = useDashboard()
  const { info }                      = useRestaurantInfo()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location                      = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard'

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#0E1117',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>

      {/* ── Desktop sidebar ── */}
      <aside style={{
        display: 'none',
        width: 240,
        minHeight: '100vh',
        flexShrink: 0,
        flexDirection: 'column',
      }}
        className="md-sidebar"
      >
        <Sidebar handleLogout={handleLogout} onNavClick={() => {}} />
      </aside>

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.65)',
            zIndex: 40,
          }}
        />
      )}

      {/* ── Mobile sidebar ── */}
      <aside style={{
        position: 'fixed',
        top: 0, left: 0,
        height: '100%',
        width: 240,
        zIndex: 50,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.28s cubic-bezier(0.22,1,0.36,1)',
        flexDirection: 'column',
        display: 'flex',
      }}>
        <Sidebar
          handleLogout={handleLogout}
          onNavClick={() => setSidebarOpen(false)}
        />
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ── Mobile top bar ── */}
        <header style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          background: '#0E1117',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
          className="mobile-header"
        >
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              width: 38, height: 38, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(196,154,74,0.9)',
              cursor: 'pointer',
            }}
          >
            {sidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>

          {/* Logo centered */}
          <img
            src="/images/tablebooking.png"
            alt="TableBooking.ma"
            style={{ height: 26, objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none' }}
          />

          {/* Page title right */}
          <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
            {pageTitle}
          </span>
        </header>

        {/* ── Content ── */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          background: '#F0F2F5',
          borderRadius: '12px 0 0 0',
        }}>
          {children}
        </main>

      </div>

      {/* ── Responsive CSS ── */}
      <style>{`
        @media (min-width: 768px) {
          .md-sidebar {
            display: flex !important;
          }
          .mobile-header {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          .md-sidebar {
            display: none !important;
          }
        }
      `}</style>

    </div>
  )
}