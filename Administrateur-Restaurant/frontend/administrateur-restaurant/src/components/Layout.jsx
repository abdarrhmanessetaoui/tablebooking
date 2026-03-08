import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useDashboard      from '../hooks/Dashboard/useDashboard'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import Sidebar           from './Sidebar'
import { HamburgerIcon, CloseIcon } from '../data/sidebarItems'
import { MapPin, Mail } from 'lucide-react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'
const SW   = 220

const PAGE_TITLES = {
  '/dashboard':     'Dashboard',
  '/reservations':  'Réservations',
  '/blocked-dates': 'Dates bloquées',
  '/calendar':      'Planning',
  '/reports':       'Rapports',
  '/settings':      'Paramètres',
}

export default function Layout({ children }) {
  const { handleLogout }    = useDashboard()
  const { info }            = useRestaurantInfo()
  const [open, setOpen]     = useState(false)
  const location            = useLocation()
  const title               = PAGE_TITLES[location.pathname] || 'Dashboard'
  const initial             = info?.name ? info.name.charAt(0).toUpperCase() : 'R'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin:0; padding:0; background:#fff; }

        .l-root {
          min-height:100vh; display:flex; flex-direction:column;
          font-family:'Plus Jakarta Sans','DM Sans',system-ui,sans-serif;
        }

        /* ── Desktop top header ── */
        .l-topheader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          height: 54px;
          background: ${DARK};
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 30;
        }

        /* ── Body row: sidebar + content ── */
        .l-body {
          flex: 1;
          display: flex;
          min-height: 0;
        }

        .l-aside {
          width: ${SW}px;
          flex-shrink: 0;
          position: sticky;
          top: 54px;
          height: calc(100vh - 54px);
          overflow-y: auto;
          z-index: 20;
        }

        .l-main {
          flex: 1;
          min-width: 0;
          background: #fff;
          overflow-x: hidden;
        }

        /* ── Mobile hamburger bar (replaces header on mobile) ── */
        .l-mobile-bar {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          height: 54px;
          background: ${DARK};
          flex-shrink: 0;
          position: sticky;
          top: 0;
          z-index: 30;
        }

        @media (max-width: 767px) {
          .l-topheader { display: none !important; }
          .l-mobile-bar { display: flex !important; }
          .l-aside { display: none !important; }
          .l-aside-drawer { display: block; }
          .l-aside.sticky-desktop { display: none !important; }
        }

        @media (min-width: 768px) {
          .l-mobile-bar { display: none !important; }
          .l-aside-drawer { display: none !important; }
        }
      `}</style>

      <div className="l-root">

        {/* ── DESKTOP: top header with restaurant info ── */}
        <header className="l-topheader">
          {/* Left: restaurant identity */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{
              width:32, height:32, borderRadius:'50%',
              background: GOLD, display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:14, fontWeight:900, color:DARK, flexShrink:0,
            }}>
              {initial}
            </div>
            <div>
              <p style={{ margin:0, fontSize:13, fontWeight:800, color:'#fff', lineHeight:1.2 }}>
                {info?.name || 'Restaurant'}
              </p>
              {info?.city && (
                <p style={{ margin:0, fontSize:11, fontWeight:600, color: GOLD, display:'flex', alignItems:'center', gap:4 }}>
                  <MapPin size={10} strokeWidth={2.5} />
                  {info.city}
                </p>
              )}
            </div>
          </div>

          {/* Right: email */}
          {info?.email && (
            <div style={{ display:'flex', alignItems:'center', gap:7 }}>
              <Mail size={13} strokeWidth={2} color={GOLD} />
              <span style={{ fontSize:12, fontWeight:600, color:'rgba(200,169,126,0.85)' }}>
                {info.email}
              </span>
            </div>
          )}
        </header>

        {/* ── MOBILE: hamburger bar (no restaurant info, just nav) ── */}
        <header className="l-mobile-bar">
          <button onClick={() => setOpen(!open)}
            style={{ width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(200,169,126,0.18)', border:'none', color:GOLD, cursor:'pointer' }}>
            {open ? <CloseIcon /> : <HamburgerIcon />}
          </button>
          <img src="/images/tablebooking.png" alt="TableBooking.ma"
            style={{ height:26, objectFit:'contain' }}
            onError={e => e.target.style.display='none'} />
          <span style={{ fontSize:12, fontWeight:700, color:'rgba(200,169,126,0.7)', minWidth:80, textAlign:'right' }}>
            {title}
          </span>
        </header>

        {/* ── Overlay for mobile drawer ── */}
        {open && (
          <div onClick={() => setOpen(false)}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:40 }} />
        )}

        {/* ── Mobile sidebar drawer ── */}
        <div className="l-aside-drawer" style={{
          position:'fixed', top:0, left:0,
          width:SW, height:'100%', zIndex:50,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition:'transform 0.26s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <Sidebar handleLogout={handleLogout} onNavClick={() => setOpen(false)} />
        </div>

        {/* ── Body ── */}
        <div className="l-body">
          <aside className="l-aside">
            <Sidebar handleLogout={handleLogout} onNavClick={() => {}} />
          </aside>
          <main className="l-main">{children}</main>
        </div>

      </div>
    </>
  )
}