import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

export default function Sidebar({ handleLogout, onNavClick, collapsed, onToggle }) {
  const [hov,    setHov]    = useState(null)
  const [hovOut, setHovOut] = useState(false)

  return (
    <div style={{
      width: '100%', height: '100%',
      background: DARK,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      overflow: 'hidden',
    }}>

      {/* LOGO */}
      <div style={{
        padding: collapsed ? '28px 0 24px' : '28px 24px 24px',
        borderBottom: `1px solid rgba(200,169,126,0.18)`,
        flexShrink: 0,
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 8,
        transition: 'padding 0.22s',
      }}>
        {!collapsed && (
          <>
            <img
              src="/images/tablebooking.png"
              alt="TableBooking.ma"
              style={{ height: 32, objectFit: 'contain', display: 'block', flexShrink: 0 }}
              onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }}
            />
            <span style={{ display:'none', fontSize:14, fontWeight:900, color: GOLD, letterSpacing:'-0.3px', whiteSpace:'nowrap' }}>
              TableBooking
            </span>
          </>
        )}

        {/* Collapse toggle — desktop only */}
        {onToggle && (
          <button
            onClick={onToggle}
            title={collapsed ? 'Agrandir' : 'Réduire'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, flexShrink: 0,
              background: 'rgba(200,169,126,0.1)',
              border: '1px solid rgba(200,169,126,0.2)',
              color: 'rgba(200,169,126,0.6)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,169,126,0.2)'; e.currentTarget.style.color = GOLD }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(200,169,126,0.1)'; e.currentTarget.style.color = 'rgba(200,169,126,0.6)' }}
          >
            {collapsed
              ? <ChevronRight size={14} strokeWidth={2.5} />
              : <ChevronLeft  size={14} strokeWidth={2.5} />
            }
          </button>
        )}
      </div>

      {/* NAV */}
      <nav style={{
        flex: 1, padding: '16px 8px',
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
              display: 'flex', alignItems: 'center',
              gap: collapsed ? 0 : 13,
              padding: collapsed ? '13px 0' : '13px 16px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              textDecoration: 'none',
              position: 'relative',
              transition: 'background 0.15s, color 0.15s',
              background: isActive ? GOLD : hov === i ? 'rgba(200,169,126,0.15)' : 'transparent',
              color: isActive ? DARK : hov === i ? GOLD : 'rgba(255,255,255,0.5)',
              overflow: 'hidden',
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{ display:'flex', alignItems:'center', flexShrink:0, color:'inherit' }}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span style={{ fontSize:14, fontWeight: isActive ? 900 : 600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {item.label}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <div style={{ padding: collapsed ? '10px 8px 28px' : '10px 8px 28px', borderTop:`1px solid rgba(200,169,126,0.18)`, flexShrink:0 }}>
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHovOut(true)}
          onMouseLeave={() => setHovOut(false)}
          title={collapsed ? 'Déconnexion' : undefined}
          style={{
            width:'100%', display:'flex', alignItems:'center',
            gap: collapsed ? 0 : 13,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '13px 0' : '13px 16px',
            marginTop: 8,
            background: hovOut ? 'rgba(255,80,80,0.18)' : 'transparent',
            border: 'none',
            color: hovOut ? '#ff6b6b' : 'rgba(255,255,255,0.4)',
            cursor:'pointer',
            transition: 'background 0.15s, color 0.15s',
            fontFamily:'inherit', fontSize:14, fontWeight:600, textAlign:'left',
          }}
        >
          <span style={{ display:'flex', alignItems:'center', flexShrink:0, color:'inherit' }}>
            <LogoutIcon />
          </span>
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  )
}