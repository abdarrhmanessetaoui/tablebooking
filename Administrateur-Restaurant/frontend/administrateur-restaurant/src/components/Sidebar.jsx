import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DARK  = '#2b2118'
const DARK2 = '#231b13'
const GOLD  = '#c8a97e'
const GOLD2 = '#e8c99e'

export default function Sidebar({ handleLogout, onNavClick, collapsed, onToggle }) {
  const [hov, setHov]       = useState(null)
  const [hovOut, setHovOut] = useState(false)
  const [hovToggle, setHovToggle] = useState(false)

  return (
    <div style={{
      width: '100%', height: '100%',
      background: DARK,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      overflow: 'visible',   /* let the toggle tab poke out */
      position: 'relative',
    }}>

      {/* atmosphere gradient */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none', zIndex:0,
        background:`
          radial-gradient(ellipse 180% 50% at 50% -5%, rgba(200,169,126,0.08) 0%, transparent 55%),
          radial-gradient(ellipse 100% 35% at 50% 108%, rgba(0,0,0,0.28) 0%, transparent 55%)
        `,
      }} />

      {/* ── FLOATING TOGGLE TAB on right edge ── */}
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovToggle(true)}
        onMouseLeave={() => setHovToggle(false)}
        title={collapsed ? 'Agrandir' : 'Réduire'}
        style={{
          position: 'absolute',
          top: '50%',
          right: -16,           /* pokes out beyond sidebar edge */
          transform: 'translateY(-50%)',
          zIndex: 99,
          width: 16,
          height: 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: hovToggle ? GOLD : '#3a2d22',
          border: `1px solid ${hovToggle ? GOLD : 'rgba(200,169,126,0.25)'}`,
          borderLeft: 'none',
          color: hovToggle ? DARK : 'rgba(200,169,126,0.7)',
          cursor: 'pointer',
          transition: 'background 0.18s, color 0.18s, border-color 0.18s',
          padding: 0,
          borderRadius: '0 4px 4px 0',
          boxShadow: hovToggle
            ? `2px 0 12px rgba(200,169,126,0.25)`
            : `2px 0 8px rgba(0,0,0,0.3)`,
        }}
      >
        {collapsed
          ? <ChevronRight size={11} strokeWidth={2.5} />
          : <ChevronLeft  size={11} strokeWidth={2.5} />
        }
      </button>

      {/* LOGO */}
      <div style={{
        position:'relative', zIndex:1,
        padding: collapsed ? '24px 0 20px' : '24px 20px 20px',
        borderBottom:`1px solid rgba(200,169,126,0.1)`,
        flexShrink:0,
        display:'flex', alignItems:'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        minHeight: 76,
      }}>
        {collapsed ? (
          /* small gold square as logo mark when collapsed */
          <div style={{
            width:28, height:28,
            background:`linear-gradient(135deg, ${GOLD} 0%, #a8834e 100%)`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:12, fontWeight:900, color:DARK, letterSpacing:'-0.5px',
          }}>
            TB
          </div>
        ) : (
          <>
            <img
              src="/images/tablebooking.png"
              alt="TableBooking.ma"
              style={{ height:34, objectFit:'contain', display:'block', maxWidth:150 }}
              onError={e => {
                e.target.style.display='none'
                e.target.nextSibling.style.display='flex'
              }}
            />
            <span style={{
              display:'none', alignItems:'center',
              fontSize:15, fontWeight:900, color:GOLD, letterSpacing:'-0.5px',
            }}>
              Table<span style={{color:'#fff'}}>Booking</span>
              <span style={{fontSize:9,fontWeight:800,color:GOLD,opacity:0.6,marginLeft:1,alignSelf:'flex-end',marginBottom:2}}>.ma</span>
            </span>
          </>
        )}
      </div>

      {/* NAV LABEL */}
      {!collapsed && (
        <div style={{
          position:'relative', zIndex:1,
          padding:'14px 20px 4px',
          fontSize:9, fontWeight:900,
          color:'rgba(200,169,126,0.28)',
          letterSpacing:'0.25em', textTransform:'uppercase',
        }}>
          Menu
        </div>
      )}

      {/* NAV */}
      <nav style={{
        flex:1, zIndex:1, position:'relative',
        padding: collapsed ? '8px 8px' : '4px 10px 8px',
        display:'flex', flexDirection:'column', gap:1,
        overflowY:'auto', overflowX:'hidden',
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
              display:'flex', alignItems:'center',
              gap: collapsed ? 0 : 11,
              padding: collapsed ? '13px 0' : '11px 13px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              textDecoration:'none',
              position:'relative',
              transition:'background 0.14s, color 0.14s',
              background: isActive
                ? GOLD
                : hov === i
                  ? 'rgba(200,169,126,0.1)'
                  : 'transparent',
              color: isActive ? DARK
                   : hov === i ? GOLD2
                   : 'rgba(255,255,255,0.42)',
            })}
          >
            {({ isActive }) => (
              <>
                {/* active indicator bar */}
                {isActive && !collapsed && (
                  <span style={{
                    position:'absolute', left:0, top:5, bottom:5,
                    width:3, background:DARK2,
                  }} />
                )}

                <span style={{ display:'flex', alignItems:'center', flexShrink:0, color:'inherit' }}>
                  {item.icon}
                </span>

                {!collapsed && (
                  <span style={{
                    fontSize:13,
                    fontWeight: isActive ? 800 : 600,
                    whiteSpace:'nowrap',
                    letterSpacing: isActive ? '-0.2px' : '0',
                  }}>
                    {item.label}
                  </span>
                )}

                {/* tooltip-dot for collapsed hover */}
                {collapsed && hov === i && !isActive && (
                  <span style={{
                    position:'absolute', right:5, top:'50%',
                    transform:'translateY(-50%)',
                    width:3, height:3, borderRadius:'50%',
                    background:GOLD, opacity:0.8,
                  }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* DIVIDER */}
      <div style={{
        position:'relative', zIndex:1,
        height:1, margin:'0 12px',
        background:'rgba(200,169,126,0.1)',
        flexShrink:0,
      }} />

      {/* LOGOUT */}
      <div style={{
        position:'relative', zIndex:1,
        padding: collapsed ? '6px 8px 22px' : '6px 10px 22px',
        flexShrink:0,
      }}>
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHovOut(true)}
          onMouseLeave={() => setHovOut(false)}
          title={collapsed ? 'Déconnexion' : undefined}
          style={{
            width:'100%', display:'flex', alignItems:'center',
            gap: collapsed ? 0 : 11,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '12px 0' : '11px 13px',
            background: hovOut ? 'rgba(239,68,68,0.1)' : 'transparent',
            border:'none',
            color: hovOut ? '#f87171' : 'rgba(255,255,255,0.28)',
            cursor:'pointer',
            transition:'background 0.15s, color 0.15s',
            fontFamily:'inherit', fontSize:13, fontWeight:600, textAlign:'left',
          }}
        >
          <span style={{ display:'flex', alignItems:'center', flexShrink:0, color:'inherit' }}>
            <LogoutIcon />
          </span>
          {!collapsed && 'Déconnexion'}
        </button>
      </div>

    </div>
  )
}