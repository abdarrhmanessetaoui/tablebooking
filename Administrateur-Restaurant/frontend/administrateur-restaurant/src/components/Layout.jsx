import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useDashboard from '../hooks/Dashboard/useDashboard'
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

const SIDEBAR_W = 64  // narrow icon rail — matches DoorDash reference

export default function Layout({ children }) {
  const { handleLogout }              = useDashboard()
  const [open, setOpen]               = useState(false)
  const location                      = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard'

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; }
        * { box-sizing: border-box; }

        .layout-root {
          min-height: 100vh;
          display: flex;
          background: #111318;
          font-family: 'Plus Jakarta Sans','DM Sans',system-ui,sans-serif;
        }

        /* Desktop sidebar */
        .sidebar-desktop {
          width: ${SIDEBAR_W}px;
          min-height: 100vh;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: visible;
          z-index: 10;
        }

        /* Mobile header */
        .mobile-header {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: #111318;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        @media (max-width: 767px) {
          .sidebar-desktop { display: none !important; }
          .mobile-header   { display: flex !important; }
        }

        /* Main content */
        .main-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: #F0F2F5;
          border-radius: 14px 0 0 0;
          min-height: 100vh;
          overflow-x: hidden;
        }
      `}</style>

      <div className="layout-root">

        {/* ── Desktop sidebar ── */}
        <aside className="sidebar-desktop">
          <Sidebar handleLogout={handleLogout} onNavClick={() => {}} />
        </aside>

        {/* ── Mobile overlay ── */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.65)',
              zIndex: 40,
            }}
          />
        )}

        {/* ── Mobile drawer ── */}
        <aside style={{
          position: 'fixed', top: 0, left: 0,
          width: SIDEBAR_W, height: '100%',
          zIndex: 50,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.26s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <Sidebar handleLogout={handleLogout} onNavClick={() => setOpen(false)} />
        </aside>

        {/* ── Right side ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Mobile top bar */}
          <header className="mobile-header">
            <button
              onClick={() => setOpen(!open)}
              style={{
                width: 38, height: 38, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: '#C49A4A', cursor: 'pointer',
              }}
            >
              {open ? <CloseIcon /> : <HamburgerIcon />}
            </button>

            <img
              src="/images/tablebooking.png"
              alt="TableBooking.ma"
              style={{ height: 28, objectFit: 'contain' }}
              onError={e => e.target.style.display = 'none'}
            />

            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.45)' }}>
              {pageTitle}
            </span>
          </header>

          {/* Page content */}
          <main className="main-content">
            {children}
          </main>

        </div>
      </div>
    </>
  )
}