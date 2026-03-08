import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import { useState } from 'react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

const DARK   = '#2b2118'
const DARK2  = '#231b13'
const GOLD   = '#c8a97e'
const GOLD2  = '#e8c99e'

export default function Sidebar({ handleLogout, onNavClick, collapsed, onToggle }) {
  const [hov, setHov]       = useState(null)
  const [hovOut, setHovOut] = useState(false)

  return (
    <div style={{
      width: '100%', height: '100%',
      background: DARK,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* subtle texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 180% 60% at 50% -10%, rgba(200,169,126,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 100% 40% at 50% 110%, rgba(0,0,0,0.25) 0%, transparent 60%)
        `,
      }} />

      {/* LOGO ZONE */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: collapsed ? '22px 0 20px' : '22px 20px 20px',
        borderBottom: `1px solid rgba(200,169,126,0.12)`,
        flexShrink: 0,
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 8,
      }}>
        {!collapsed && (
          <div style={{ display:'flex', alignItems:'center', gap:0, minWidth:0, overflow:'hidden' }}>
            <img
              src="/images/tablebooking.png"
              alt="TableBooking.ma"
              style={{ height:34, objectFit:'contain', display:'block', maxWidth:140 }}
              onError={e => {
                e.target.style.display='none'
                e.target.nextSibling.style.display='flex'
              }}
            />
            <span style={{
              display:'none', alignItems:'center', gap:0,
              fontSize:15, fontWeight:900, color:GOLD, letterSpacing:'-0.5px',
            }}>
              Table<span style={{ color:'#fff' }}>Booking</span>
              <span style={{ fontSize:9, fontWeight:800, color:GOLD, opacity:0.7, marginLeft:1, alignSelf:'flex-end', marginBottom:1 }}>.ma</span>
            </span>
          </div>
        )}

        {/* collapse toggle */}
        <button
          onClick={onToggle}
          title={collapsed ? 'Agrandir le menu' : 'Réduire le menu'}
          style={{
            width:30, height:30, flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center',
            background:'rgba(200,169,126,0.1)',
            border:'1px solid rgba(200,169,126,0.18)',
            color:'rgba(200,169,126,0.6)',
            cursor:'pointer',
            transition:'all 0.15s',
            borderRadius: 0,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background='rgba(200,169,126,0.2)'
            e.currentTarget.style.color=GOLD
            e.currentTarget.style.borderColor='rgba(200,169,126,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background='rgba(200,169,126,0.1)'
            e.currentTarget.style.color='rgba(200,169,126,0.6)'
            e.currentTarget.style.borderColor='rgba(200,169,126,0.18)'
          }}
        >
          {collapsed
            ? <PanelLeftOpen  size={14} strokeWidth={2} />
            : <PanelLeftClose size={14} strokeWidth={2} />
          }
        </button>
      </div>

      {/* NAV LABEL */}
      {!collapsed && (
        <div style={{
          position:'relative', zIndex:1,
          padding:'16px 20px 6px',
          fontSize:9, fontWeight:900, color:'rgba(200,169,126,0.35)',
          letterSpacing:'0.22em', textTransform:'uppercase',
        }}>
          Navigation
        </div>
      )}

      {/* NAV */}
      <nav style={{
        flex:1, zIndex:1, position:'relative',
        padding: collapsed ? '8px 10px' : '4px 10px 8px',
        display:'flex', flexDirection:'column', gap:2,
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
              gap: collapsed ? 0 : 12,
              padding: collapsed ? '12px 0' : '11px 14px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              textDecoration:'none',
              position:'relative',
              transition:'background 0.15s, color 0.15s',
              background: isActive
                ? GOLD
                : hov === i
                  ? 'rgba(200,169,126,0.12)'
                  : 'transparent',
              color: isActive
                ? DARK
                : hov === i
                  ? GOLD2
                  : 'rgba(255,255,255,0.45)',
            })}
          >
            {({ isActive }) => (
              <>
                {/* active left bar */}
                {isActive && !collapsed && (
                  <span style={{
                    position:'absolute', left:0, top:6, bottom:6,
                    width:3, background:DARK2,
                  }} />
                )}

                <span style={{
                  display:'flex', alignItems:'center', flexShrink:0,
                  color:'inherit',
                  filter: isActive ? 'none' : hov === i ? 'none' : 'none',
                }}>
                  {item.icon}
                </span>

                {!collapsed && (
                  <span style={{
                    fontSize:13, fontWeight: isActive ? 800 : 600,
                    whiteSpace:'nowrap', overflow:'hidden',
                    letterSpacing: isActive ? '-0.2px' : '0',
                  }}>
                    {item.label}
                  </span>
                )}

                {/* hover dot when collapsed */}
                {collapsed && hov === i && (
                  <span style={{
                    position:'absolute', right:6, top:'50%',
                    transform:'translateY(-50%)',
                    width:4, height:4, borderRadius:'50%',
                    background: GOLD, opacity:0.7,
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
        height:1, margin: collapsed ? '0 10px' : '0 10px',
        background:'rgba(200,169,126,0.12)',
        flexShrink:0,
      }} />

      {/* LOGOUT */}
      <div style={{
        position:'relative', zIndex:1,
        padding: collapsed ? '8px 10px 24px' : '8px 10px 24px',
        flexShrink:0,
      }}>
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHovOut(true)}
          onMouseLeave={() => setHovOut(false)}
          title={collapsed ? 'Déconnexion' : undefined}
          style={{
            width:'100%', display:'flex', alignItems:'center',
            gap: collapsed ? 0 : 12,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '12px 0' : '11px 14px',
            background: hovOut ? 'rgba(239,68,68,0.12)' : 'transparent',
            border:'none',
            color: hovOut ? '#f87171' : 'rgba(255,255,255,0.3)',
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