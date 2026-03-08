import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useDashboard       from '../hooks/Dashboard/useDashboard'
import useRestaurantInfo  from '../hooks/useRestaurantInfo'
import Sidebar            from './Sidebar'
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

function RestaurantBanner({ info }) {
  if (!info) return null
  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', alignItems: 'center',
      justifyContent: 'space-between', gap: 12,
      padding: '10px 28px',
      background: DARK,
      borderBottom: '2px solid rgba(200,169,126,0.2)',
      flexShrink: 0,
    }}>
      {/* Left: name + location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 32, height: 32, background: GOLD, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontSize: 14, fontWeight: 900, color: DARK, lineHeight: 1 }}>
            {info.name?.charAt(0)}
          </span>
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
            {info.name}
          </p>
          {info.location && (
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: GOLD, display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={9} color={GOLD} strokeWidth={2.5} />
              {info.location}
            </p>
          )}
        </div>
      </div>

      {/* Right: email only */}
      {info.email && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(200,169,126,0.15)' }}>
          <Mail size={11} color={GOLD} strokeWidth={2} />
          <span style={{ fontSize: 11, fontWeight: 700, color: GOLD }}>{info.email}</span>
        </div>
      )}
    </div>
  )
}

export default function Layout({ children }) {
  const { handleLogout } = useDashboard()
  const { info }         = useRestaurantInfo()
  const [open, setOpen]  = useState(false)
  const location         = useLocation()
  const title            = PAGE_TITLES[location.pathname] || 'Dashboard'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin:0; padding:0; background:#fff; }
        .l-root {
          min-height:100vh; display:flex;
          font-family:'Plus Jakarta Sans','DM Sans',system-ui,sans-serif;
        }
        .l-aside {
          width:${SW}px; min-height:100vh; flex-shrink:0;
          position:sticky; top:0; height:100vh;
          overflow-y:auto; z-index:20;
        }
        .l-topbar {
          display:none; align-items:center; justify-content:space-between;
          padding:14px 20px; background:${DARK};
          flex-shrink:0; position:sticky; top:0; z-index:30;
        }
        .l-main {
          flex:1; min-width:0;
          min-height:100vh; overflow-x:hidden; background:#fff;
        }
        @media(max-width:767px){
          .l-aside  { display:none !important; }
          .l-topbar { display:flex !important; }
        }
      `}</style>

      <div className="l-root">
        {/* Desktop sidebar */}
        <aside className="l-aside">
          <Sidebar handleLogout={handleLogout} onNavClick={() => {}} />
        </aside>

        {/* Mobile overlay */}
        {open && (
          <div onClick={() => setOpen(false)}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:40 }} />
        )}

        {/* Mobile drawer */}
        <aside style={{
          position:'fixed', top:0, left:0,
          width:SW, height:'100%', zIndex:50,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition:'transform 0.26s cubic-bezier(0.22,1,0.36,1)',
        }}>
          <Sidebar handleLogout={handleLogout} onNavClick={() => setOpen(false)} />
        </aside>

        {/* Right column */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>

          {/* Mobile topbar */}
          <header className="l-topbar">
            <button onClick={() => setOpen(!open)}
              style={{ width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(200,169,126,0.18)', border:'none', color:GOLD, cursor:'pointer' }}>
              {open ? <CloseIcon /> : <HamburgerIcon />}
            </button>
            <img src="/images/tablebooking.png" alt="TableBooking.ma"
              style={{ height:28, objectFit:'contain' }}
              onError={e => e.target.style.display='none'} />
            <span style={{ fontSize:13, fontWeight:700, color:'rgba(200,169,126,0.7)' }}>{title}</span>
          </header>

          {/* Restaurant banner — sticky under topbar */}
          <div style={{ position:'sticky', top:0, zIndex:25 }}>
            <RestaurantBanner info={info} />
          </div>

          <main className="l-main">{children}</main>
        </div>
      </div>
    </>
  )
}