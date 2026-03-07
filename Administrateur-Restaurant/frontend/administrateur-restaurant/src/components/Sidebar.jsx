import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import { useState } from 'react'

const GOLD = '#C49A4A'
const GOLD_DIM = 'rgba(196,154,74,0.18)'
const TEXT_DIM = 'rgba(255,255,255,0.38)'
const TEXT_HOV = 'rgba(255,255,255,0.80)'
const BG = '#0E1117'
const BG_CARD = '#161B26'
const BORDER = 'rgba(255,255,255,0.07)'

export default function Sidebar({ handleLogout, onNavClick }) {
  const { info } = useRestaurantInfo()
  const [hovIdx, setHovIdx] = useState(null)
  const [hovLogout, setHovLogout] = useState(false)
  const [tooltip, setTooltip] = useState(null)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      background: BG,
      borderRight: `1px solid ${BORDER}`,
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      position: 'relative',
      overflow: 'visible',
    }}>

      {/* ── Logo ── */}
      <div style={{
        width: '100%',
        padding: '18px 0 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <img
          src="/images/tablebooking.png"
          alt="TableBooking.ma"
          style={{ width: 36, height: 36, objectFit: 'contain' }}
          onError={e => {
            // Fallback: text logo
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
        {/* Text fallback if no image */}
        <div style={{
          display: 'none',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: 1,
        }}>
          <span style={{ fontSize: 11, fontWeight: 900, color: GOLD, letterSpacing: '0.04em' }}>TB</span>
          <span style={{ fontSize: 7, fontWeight: 800, color: 'rgba(196,154,74,0.5)', letterSpacing: '0.1em' }}>.ma</span>
        </div>
      </div>

      {/* ── Nav items ── */}
      <nav style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '14px 0',
        width: '100%',
        overflowY: 'auto',
        overflowX: 'visible',
      }}>
        {navItems.map((item, i) => (
          <div
            key={item.to}
            style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}
            onMouseEnter={() => { setHovIdx(i); setTooltip(i) }}
            onMouseLeave={() => { setHovIdx(null); setTooltip(null) }}
          >
            <NavLink
              to={item.to}
              onClick={onNavClick}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 42,
                height: 42,
                borderRadius: 12,
                textDecoration: 'none',
                position: 'relative',
                transition: 'all 0.15s ease',
                background: isActive ? GOLD_DIM : hovIdx === i ? 'rgba(255,255,255,0.06)' : 'transparent',
                border: isActive ? `1px solid rgba(196,154,74,0.28)` : '1px solid transparent',
                color: isActive ? GOLD : hovIdx === i ? TEXT_HOV : TEXT_DIM,
              })}
            >
              {({ isActive }) => (
                <>
                  {/* Active left indicator */}
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      left: -1,
                      top: '22%', bottom: '22%',
                      width: 3,
                      borderRadius: '0 3px 3px 0',
                      background: GOLD,
                      boxShadow: `0 0 8px ${GOLD}80`,
                    }} />
                  )}

                  {/* Icon */}
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    color: 'inherit',
                  }}>
                    {item.icon}
                  </span>
                </>
              )}
            </NavLink>

            {/* Tooltip */}
            {tooltip === i && (
              <div style={{
                position: 'absolute',
                left: 'calc(100% + 12px)',
                top: '50%',
                transform: 'translateY(-50%)',
                background: BG_CARD,
                border: `1px solid rgba(255,255,255,0.1)`,
                borderRadius: 9,
                padding: '7px 13px',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                zIndex: 9999,
                boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
                animation: 'ttfade 0.15s ease',
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.88)' }}>
                  {item.label}
                </span>
                {/* Arrow */}
                <div style={{
                  position: 'absolute',
                  left: -5, top: '50%', transform: 'translateY(-50%)',
                  width: 8, height: 8,
                  background: BG_CARD,
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRight: 'none', borderTop: 'none',
                  transform: 'translateY(-50%) rotate(45deg)',
                }} />
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* ── Divider ── */}
      <div style={{ width: 32, height: 1, background: BORDER, margin: '0 0 10px' }} />

      {/* ── Logout ── */}
      <div style={{ padding: '0 0 22px', display: 'flex', justifyContent: 'center', width: '100%', position: 'relative' }}
        onMouseEnter={() => { setHovLogout(true); setTooltip('logout') }}
        onMouseLeave={() => { setHovLogout(false); setTooltip(null) }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: 42, height: 42, borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hovLogout ? 'rgba(192,24,43,0.12)' : 'transparent',
            border: `1px solid ${hovLogout ? 'rgba(192,24,43,0.25)' : 'transparent'}`,
            color: hovLogout ? '#F87171' : TEXT_DIM,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'inherit' }}>
            <LogoutIcon />
          </span>
        </button>

        {/* Logout tooltip */}
        {tooltip === 'logout' && (
          <div style={{
            position: 'absolute',
            left: 'calc(100% + 12px)',
            top: '50%',
            transform: 'translateY(-50%)',
            background: BG_CARD,
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 9,
            padding: '7px 13px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 9999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#F87171' }}>Déconnexion</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes ttfade {
          from { opacity: 0; transform: translateY(-50%) translateX(-4px); }
          to   { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
      `}</style>
    </div>
  )
}