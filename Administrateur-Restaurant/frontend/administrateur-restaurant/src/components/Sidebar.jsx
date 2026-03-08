import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import { useState } from 'react'
import { ChevronsLeft, ChevronsRight, LogOut } from 'lucide-react'

const DARK  = '#2b2118'
const GOLD  = '#c8a97e'

export default function Sidebar({ handleLogout, onNavClick, collapsed, onToggle }) {
  const [hov, setHov]       = useState(null)
  const [hovOut, setHovOut] = useState(false)
  const [hovCol, setHovCol] = useState(false)

  return (
    <div style={{
      width: '100%', height: '100%',
      background: DARK,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      overflow: 'hidden',
    }}>

      {/* ── LOGO ── */}
      <div style={{
        height: 64,
        borderBottom: '1px solid rgba(200,169,126,0.12)',
        flexShrink: 0,
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? 0 : '0 22px',
        overflow: 'hidden',
      }}>
        {collapsed ? (
          <div style={{
            width: 32, height: 32,
            background: GOLD,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 900, color: DARK, letterSpacing: '-0.3px',
            flexShrink: 0,
          }}>TB</div>
        ) : (
          <>
            <img
              src="/images/tablebooking.png"
              alt="TableBooking.ma"
              style={{ height: 32, objectFit: 'contain' }}
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }}
            />
            <span style={{ display:'none', fontSize:15, fontWeight:900, color:GOLD }}>TableBooking.ma</span>
          </>
        )}
      </div>

      {/* ── NAV ── */}
      <nav style={{
        flex: 1,
        padding: '12px 10px',
        display: 'flex', flexDirection: 'column', gap: 2,
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        {navItems.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavClick}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            title={collapsed ? item.label : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: collapsed ? 0 : 11,
              padding: collapsed ? '12px 0' : '11px 13px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              textDecoration: 'none',
              position: 'relative',
              transition: 'background 0.13s, color 0.13s',
              background: isActive ? GOLD : hov === i ? 'rgba(200,169,126,0.1)' : 'transparent',
              color: isActive ? DARK : hov === i ? GOLD : 'rgba(255,255,255,0.45)',
            })}
          >
            {({ isActive }) => (
              <>
                {/* active bar */}
                {isActive && !collapsed && (
                  <span style={{
                    position: 'absolute', left: 0, top: 6, bottom: 6,
                    width: 3, background: '#1a110a',
                  }} />
                )}
                <span style={{ display:'flex', alignItems:'center', flexShrink:0, color:'inherit' }}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span style={{ fontSize: 13, fontWeight: isActive ? 800 : 600, whiteSpace: 'nowrap' }}>
                    {item.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── BOTTOM ACTIONS ── */}
      <div style={{
        borderTop: '1px solid rgba(200,169,126,0.12)',
        flexShrink: 0,
        padding: '8px 10px',
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>

        {/* Logout */}
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHovOut(true)}
          onMouseLeave={() => setHovOut(false)}
          title={collapsed ? 'Déconnexion' : undefined}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: collapsed ? 0 : 11,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '11px 0' : '11px 13px',
            background: hovOut ? 'rgba(239,68,68,0.1)' : 'transparent',
            border: 'none',
            color: hovOut ? '#f87171' : 'rgba(255,255,255,0.3)',
            cursor: 'pointer',
            transition: 'background 0.13s, color 0.13s',
            fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
          }}
        >
          <LogOut size={17} strokeWidth={2} style={{ flexShrink: 0 }} />
          {!collapsed && 'Déconnexion'}
        </button>

        {/* Collapse toggle — sits at the very bottom, full width */}
        <button
          onClick={onToggle}
          onMouseEnter={() => setHovCol(true)}
          onMouseLeave={() => setHovCol(false)}
          title={collapsed ? 'Agrandir' : 'Réduire'}
          style={{
            width: '100%', display: 'flex', alignItems: 'center',
            gap: collapsed ? 0 : 11,
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: collapsed ? '11px 0' : '11px 13px',
            background: hovCol ? 'rgba(200,169,126,0.08)' : 'transparent',
            border: '1px solid ' + (hovCol ? 'rgba(200,169,126,0.2)' : 'rgba(200,169,126,0.08)'),
            color: hovCol ? GOLD : 'rgba(200,169,126,0.35)',
            cursor: 'pointer',
            transition: 'background 0.13s, color 0.13s, border-color 0.13s',
            fontFamily: 'inherit', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.04em',
            marginBottom: 4,
          }}
        >
          {!collapsed && (
            <span>Réduire le menu</span>
          )}
          {collapsed
            ? <ChevronsRight size={15} strokeWidth={2} />
            : <ChevronsLeft  size={15} strokeWidth={2} />
          }
        </button>

      </div>
    </div>
  )
}