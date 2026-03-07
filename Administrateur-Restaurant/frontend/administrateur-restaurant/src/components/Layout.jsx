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

const SW = 62

export default function Layout({ children }) {
  const { handleLogout }    = useDashboard()
  const [open, setOpen]     = useState(false)
  const location            = useLocation()
  const pageTitle           = PAGE_TITLES[location.pathname] || 'Dashboard'

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        .l-root {
          min-height: 100vh;
          display: flex;
          background: #F0F2F5;
          font-family: 'Plus Jakarta Sans','DM Sans',system-ui,sans-serif;
        }
        .l-sidebar {
          width: ${SW}px;
          min-height: 100vh;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: visible;
          z-index: 20;
          background: #fff;
          border-right: 1px solid #EBEBEB;
        }
        .l-mobile-bar {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: #fff;
          border-bottom: 1px solid #EBEBEB;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 30;
        }
        .l-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          background: #F0F2F5;
          min-height: 100vh;
          overflow-x: hidden;
        }
        @media (max-width: 767px) {
          .l-sidebar    { display: none !important; }
          .l-mobile-bar { display: flex !important; }
        }
      `}</style>

      <div className="l-root">

        {/* Desktop sidebar */}
        <aside className="l-sidebar">
          <Sidebar handleLogout={handleLogout} onNavClick={() => {}} />
        </aside>

        {/* Mobile overlay */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 40 }}
          />
        )}

        {/* Mobile drawer */}
        <aside style={{
          position: 'fixed', top: 0, left: 0,
          width: SW, height: '100%', zIndex: 50,
          background: '#fff', borderRight: '1px solid #EBEBEB',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <Sidebar handleLogout={handleLogout} onNavClick={() => setOpen(false)} />
        </aside>

        {/* Right side */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Mobile top bar */}
          <header className="l-mobile-bar">
            <button
              onClick={() => setOpen(!open)}
              style={{
                width: 36, height: 36, borderRadius: 9,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#F4F5F7', border: '1px solid #E4E7ED',
                color: '#6B7280', cursor: 'pointer',
              }}
            >
              {open ? <CloseIcon /> : <HamburgerIcon />}
            </button>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{pageTitle}</span>
            <div style={{ width: 36 }} />
          </header>

          {/* Page content */}
          <main className="l-main">{children}</main>

        </div>
      </div>
    </>
  )
}