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
        html, body { margin: 0; padding: 0; background: #F4F5F7; }

        .l-root {
          min-height: 100vh;
          display: flex;
          background: #F4F5F7;
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
          z-index: 20;
          /* no border, no shadow — brown bg speaks for itself */
        }
        .l-topbar {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 13px 20px;
          background: #7A5520;
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
          background: #F4F5F7;
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
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }}
          />
        )}

        <aside style={{
          position: 'fixed', top: 0, left: 0,
          width: SW, height: '100%',
          zIndex: 50,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.26s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <Sidebar handleLogout={handleLogout} onNavClick={() => setOpen(false)} />
        </aside>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Mobile top bar */}
          <header className="l-topbar">
            <button
              onClick={() => setOpen(!open)}
              style={{
                width: 36, height: 36, borderRadius: 9,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.12)', border: 'none',
                color: '#fff', cursor: 'pointer', fontSize: 20,
              }}
            >
              {open ? <CloseIcon /> : <HamburgerIcon />}
            </button>
            <img
              src="/images/tablebooking.png"
              alt="TableBooking.ma"
              style={{ height: 24, objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              onError={e => e.target.style.display = 'none'}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>{pageTitle}</span>
          </header>

          <main className="l-main">{children}</main>
        </div>
      </div>
    </>
  )
}