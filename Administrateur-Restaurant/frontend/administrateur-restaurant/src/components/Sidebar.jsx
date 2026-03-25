import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import { useState } from 'react'


const DARK = '#2b2118'
const GOLD = '#c8a97e'

export default function Sidebar({ handleLogout, onNavClick, collapsed, onToggle }) {

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#FFFFFF',
      borderRight: `2px solid ${DARK}`,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      overflow: 'hidden',
    }}>

      {/* LOGO */}
      <div style={{
        padding: collapsed ? '28px 0 24px' : '28px 24px 24px',
        borderBottom: `2px solid ${DARK}`,
        flexShrink: 0,
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 8,
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
              background: DARK,
              border: `1px solid ${GOLD}`,
              color: GOLD,
              cursor: 'pointer',
              fontSize: 10, fontWeight: 900
            }}
          >
            {collapsed ? '›' : '‹'}
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
            title={collapsed ? item.label : undefined}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center',
              gap: collapsed ? 0 : 13,
              padding: collapsed ? '13px 0' : '13px 16px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              textDecoration: 'none',
              position: 'relative',
              background: isActive ? DARK : 'transparent',
              color: isActive ? GOLD : DARK,
              overflow: 'hidden',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            })}
          >
                {!collapsed && (
                  <span style={{ fontSize:14, fontWeight: isActive ? 900 : 700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {item.label}
                  </span>
                )}
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <div style={{ padding: collapsed ? '10px 8px 28px' : '10px 8px 28px', borderTop:`2px solid ${DARK}`, flexShrink:0 }}>
        <button
          onClick={handleLogout}
          title={collapsed ? 'Déconnexion' : undefined}
          style={{
            width:'100%', display:'flex', alignItems:'center',
            gap: collapsed ? 0 : 13,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '13px 0' : '13px 16px',
            marginTop: 8,
            background: '#FF0000',
            border: 'none',
            color: '#FFFFFF',
            cursor:'pointer',
            fontFamily:'inherit', fontSize:13, fontWeight:900, textAlign:'left',
            textTransform: 'uppercase'
          }}
        >
          {!collapsed && <span>Déconnexion</span>}
          {collapsed && <span>OFF</span>}
        </button>
      </div>
    </div>
  )
}