import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import { useState } from 'react'

const BROWN      = '#9A6F2E'
const BROWN_DARK = '#7A5520'
const BROWN_LIGHT= 'rgba(196,154,74,0.18)'
const TEXT_DIM   = 'rgba(255,255,255,0.45)'
const TEXT_MED   = 'rgba(255,255,255,0.72)'
const TEXT_ON    = '#FFFFFF'

export default function Sidebar({ handleLogout, onNavClick }) {
  const [hov, setHov]       = useState(null)
  const [hovOut, setHovOut] = useState(false)

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#7A5520',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>

      {/* ── LOGO ── */}
      <div style={{
        padding: '26px 22px 22px',
        borderBottom: '1px solid rgba(255,255,255,0.10)',
        flexShrink: 0,
      }}>
        <img
          src="/images/tablebooking.png"
          alt="TableBooking.ma"
          style={{ height: 30, objectFit: 'contain', display: 'block', filter: 'brightness(0) invert(1)' }}
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'block'
          }}
        />
        <div style={{ display: 'none' }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
            Table<span style={{ opacity: 0.6 }}>Booking</span><span style={{ opacity: 0.5 }}>.ma</span>
          </span>
        </div>
      </div>

      {/* ── NAV ── */}
      <nav style={{
        flex: 1,
        padding: '14px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        overflowY: 'auto',
      }}>
        {navItems.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavClick}
            onMouseEnter={() => setHov(i)}
            onMouseLeave={() => setHov(null)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 11,
              padding: '10px 14px',
              borderRadius: 10,
              textDecoration: 'none',
              transition: 'background 0.13s, color 0.13s',
              background: isActive
                ? 'rgba(255,255,255,0.15)'
                : hov === i
                  ? 'rgba(255,255,255,0.08)'
                  : 'transparent',
              color: isActive ? TEXT_ON : hov === i ? TEXT_MED : TEXT_DIM,
            })}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 12, top: '20%', bottom: '20%',
                    width: 3, borderRadius: 2,
                    background: 'rgba(255,255,255,0.9)',
                    // relative parent needed
                  }} />
                )}
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: 13, fontWeight: isActive ? 800 : 600, whiteSpace: 'nowrap' }}>
                  {item.label}
                </span>
                {isActive && (
                  <span style={{
                    marginLeft: 'auto',
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.7)', flexShrink: 0,
                  }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── LOGOUT ── */}
      <div style={{ padding: '10px 12px 26px', borderTop: '1px solid rgba(255,255,255,0.10)', flexShrink: 0 }}>
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHovOut(true)}
          onMouseLeave={() => setHovOut(false)}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: 11,
            padding: '10px 14px',
            borderRadius: 10,
            background: hovOut ? 'rgba(255,255,255,0.08)' : 'transparent',
            border: 'none',
            color: hovOut ? '#FCA5A5' : TEXT_DIM,
            cursor: 'pointer',
            transition: 'all 0.13s',
            textAlign: 'left',
            marginTop: 10,
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', fontSize: 18, flexShrink: 0 }}>
            <LogoutIcon />
          </span>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Déconnexion</span>
        </button>
      </div>
    </div>
  )
}