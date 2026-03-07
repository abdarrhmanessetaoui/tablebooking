import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useDashboard from '../hooks/Dashboard/useDashboard'
import Sidebar from './Sidebar'
import { HamburgerIcon, CloseIcon } from '../data/sidebarItems'
import { B } from '../utils/brand'

const PAGE_TITLES = {
  '/dashboard':     'Dashboard',
  '/reservations':  'Réservations',
  '/blocked-dates': 'Dates bloquées',
  '/calendar':      'Planning',
  '/reports':       'Rapports',
  '/settings':      'Paramètres',
}

const SW = 215

export default function Layout({ children }) {
  const { handleLogout }    = useDashboard()
  const [open, setOpen]     = useState(false)
  const location            = useLocation()
  const pageTitle           = PAGE_TITLES[location.pathname] || 'Dashboard'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }

        .l-root {
          min-height: 100vh;
          display: flex;
          background: #F5F0EA;
          font-family: 'Plus Jakarta Sans','DM Sans',system-ui,sans-serif;
        }

        /* Sidebar: white, warm 1px border, zero shadow */
        .l-aside {
          width: ${SW}px;
          min-height: 100vh;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          overflow-x: visible;
          z-index: 20;
          background: #fff;
          border-right: 1px solid #F0EDE8;
        }

        /* Mobile top bar — hidden on desktop */
        .l-topbar {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 13px 18px;
          background: #fff;
          border-bottom: 1px solid #F0EDE8;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 30;
        }

        /* Main content area */
        .l-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          overflow-x: hidden;
          /* Matches dashboard B.pageBg */
          background: #F5F0EA;
        }

        @media (max-width: 767px) {
          .l-aside   { display: none !important; }
          .l-topbar  { display: flex !important; }
        }
      `}</style>

      <div className="l-root">

        {/* ── Desktop sidebar ── */}
        <aside className="l-aside">
          <Sidebar handleLogout={handleLogout} onNavClick={() => {}} />
        </aside>

        {/* ── Mobile overlay ── */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(28,20,12,0.35)', zIndex: 40 }}
          />
        )}

        {/* ── Mobile drawer ── */}
        <aside style={{
          position: 'fixed', top: 0, left: 0,
          width: SW, height: '100%',
          zIndex: 50, background: '#fff',
          borderRight: '1px solid #F0EDE8',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.26s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <Sidebar handleLogout={handleLogout} onNavClick={() => setOpen(false)} />
        </aside>

        {/* ── Right column ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Mobile top bar */}
          <header className="l-topbar">
            <button
              onClick={() => setOpen(!open)}
              style={{
                width: 38, height: 38, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#FAF8F5', border: '1px solid #EDE8E0',
                color: B.brown || '#9A6F2E', cursor: 'pointer', fontSize: 20,
              }}
            >
              {open ? <CloseIcon /> : <HamburgerIcon />}
            </button>

            <img
              src="/images/tablebooking.png"
              alt="TableBooking.ma"
              style={{ height: 26, objectFit: 'contain' }}
              onError={e => e.target.style.display = 'none'}
            />

            <span style={{ fontSize: 13, fontWeight: 700, color: '#6B6B6B' }}>
              {pageTitle}
            </span>
          </header>

          {/* Page content */}
          <main className="l-main">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}