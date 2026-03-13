import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useDashboard from '../hooks/Dashboard/useDashboard'
import Sidebar from './Sidebar'
import { HamburgerIcon, CloseIcon } from '../data/sidebarItems'

const DARK = '#2b2118'
const GOLD = '#c8a97e'
const SW_OPEN      = 220
const SW_COLLAPSED = 64

const PAGE_TITLES = {
  '/dashboard':     'Dashboard',
  '/reservations':  'Réservations',
  '/blocked-dates': 'Dates bloquées',
  '/calendar':      'Planning',
  '/services':      'Services',
  '/reports':       'Rapports',
  '/settings':      'Paramètres',
  '/tables': 'Tables',
}

export default function Layout({ children }) {
  const { handleLogout }          = useDashboard()
  const [open, setOpen]           = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const location                  = useLocation()
  const title                     = PAGE_TITLES[location.pathname] || 'Dashboard'
  const SW                        = collapsed ? SW_COLLAPSED : SW_OPEN

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #fff; }
        body { overflow-x: hidden; }

        .l-root  { min-height: 100vh; display: flex; font-family: 'Plus Jakarta Sans','DM Sans',system-ui,sans-serif; }
        .l-aside {
          flex-shrink: 0; position: sticky; top: 0; height: 100vh;
          overflow: hidden; z-index: 20;
          width: ${SW}px;
          transition: width 0.22s cubic-bezier(0.4,0,0.2,1);
          border-right: 1px solid rgba(200,169,126,0.12);
        }
        .l-main    { flex: 1; min-width: 0; background: #fff; overflow-x: hidden; }
        .l-topbar  {
          display: none; align-items: center; justify-content: space-between;
          padding: 0 16px; height: 52px; background: ${DARK};
          position: sticky; top: 0; z-index: 30; flex-shrink: 0;
        }
        .l-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 40; }
        .l-drawer  {
          display: none; position: fixed; top: 0; left: 0;
          width: ${SW_OPEN}px; height: 100%; z-index: 50;
          transform: translateX(-100%);
          transition: transform 0.26s cubic-bezier(0.22,1,0.36,1);
        }
        .l-drawer.open { transform: translateX(0); }

        @media (max-width: 767px) {
          .l-aside   { display: none !important; }
          .l-topbar  { display: flex !important; }
          .l-drawer  { display: block !important; }
          .l-overlay { display: block !important; }
        }
      `}</style>

      <div className="l-root">

        {/* Desktop sidebar */}
        <aside className="l-aside">
          <Sidebar
            handleLogout={handleLogout}
            onNavClick={() => {}}
            collapsed={collapsed}
            onToggle={() => setCollapsed(c => !c)}
          />
        </aside>

        {/* Mobile overlay */}
        <div
          className={`l-overlay${open ? '' : ' hidden'}`}
          onClick={() => setOpen(false)}
          style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none', transition: 'opacity 0.22s' }}
        />

        {/* Mobile drawer */}
        <div className={`l-drawer${open ? ' open' : ''}`}>
          <Sidebar
            handleLogout={handleLogout}
            onNavClick={() => setOpen(false)}
            collapsed={false}
            onToggle={() => {}}
          />
        </div>

        {/* Content column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Mobile topbar */}
          <header className="l-topbar">
            <button
              onClick={() => setOpen(o => !o)}
              aria-label="Menu"
              style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(200,169,126,0.15)', border: 'none', color: GOLD, cursor: 'pointer', flexShrink: 0 }}>
              {open ? <CloseIcon /> : <HamburgerIcon />}
            </button>

            <img src="/images/tablebooking.png" alt="TableBooking.ma"
              style={{ height: 24, objectFit: 'contain' }}
              onError={e => { e.target.style.display = 'none' }} />

            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(200,169,126,0.6)', minWidth: 72, textAlign: 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {title}
            </span>
          </header>

          <main className="l-main">{children}</main>
        </div>
      </div>
    </>
  )
}