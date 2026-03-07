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
const CONTENT_BG = '#EDEEF2'   // cool blue-gray — clearly distinct from white sidebar

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
        html, body { margin: 0; padding: 0; background: ${CONTENT_BG}; }

        .l-root {
          min-height: 100vh;
          display: flex;
          background: ${CONTENT_BG};
          font-family: 'Plus Jakarta Sans','DM Sans',system-ui,sans-serif;
        }
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
          background: #FFFFFF;
          border-right: 1px solid #E8E9EE;
        }
        .l-topbar {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 13px 18px;
          background: #fff;
          border-bottom: 1px solid #E8E9EE;
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
          min-height: 100vh;
          overflow-x: hidden;
          background: ${CONTENT_BG};
        }
        @media (max-width: 767px) {
          .l-aside   { display: none !important; }
          .l-topbar  { display: flex !important; }
        }
      `}</style>

      <div className="l-root">

        <aside className="l-aside">
          <Sidebar handleLogout={handleLogout} onNavClick={() => {}} />
        </aside>

        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }}
          />
        )}

        <aside style={{
          position: 'fixed', top: 0, left: 0,
          width: SW, height: '100%',
          zIndex: 50, background: '#fff',
          borderRight: '1px solid #E8E9EE',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.26s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <Sidebar handleLogout={handleLogout} onNavClick={() => setOpen(false)} />
        </aside>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <header className="l-topbar">
            <button
              onClick={() => setOpen(!open)}
              style={{
                width: 38, height: 38, borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#F4F5F7', border: '1px solid #E8E9EE',
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
            <span style={{ fontSize: 13, fontWeight: 700, color: '#6B6B6B' }}>{pageTitle}</span>
          </header>

          <main className="l-main">{children}</main>
        </div>
      </div>
    </>
  )
}