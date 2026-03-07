import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import { B } from '../utils/brand'
import { useState } from 'react'
import { UtensilsCrossed, MapPin } from 'lucide-react'

export default function Sidebar({ handleLogout, onNavClick }) {
  const { info } = useRestaurantInfo()
  const [hovLogout, setHovLogout] = useState(false)
  const [hovIdx, setHovIdx] = useState(null)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: B.dark,
      fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Subtle background texture ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse at 50% 0%, rgba(154,111,46,0.12) 0%, transparent 60%),
          radial-gradient(ellipse at 0% 100%, rgba(154,111,46,0.06) 0%, transparent 55%)
        `,
      }} />

      {/* ── Logo / Restaurant ── */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
      }}>
        {/* Brand mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 13, flexShrink: 0,
            background: 'linear-gradient(135deg, #1A1208 0%, #2C1F0A 100%)',
            border: `1.5px solid rgba(196,154,74,0.35)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}>
            <UtensilsCrossed size={20} color="#C49A4A" strokeWidth={2} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{
              margin: 0, fontSize: 15, fontWeight: 900,
              color: '#FFFFFF', letterSpacing: '-0.3px',
              lineHeight: 1.2,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {info?.name || 'TableBooking'}
              <span style={{ color: '#C49A4A', fontWeight: 900 }}>.ma</span>
            </p>
            {(info?.location) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                <MapPin size={10} color="rgba(196,154,74,0.7)" strokeWidth={2} />
                <p style={{
                  margin: 0, fontSize: 11, fontWeight: 600,
                  color: 'rgba(255,255,255,0.38)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {info.location}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto', position: 'relative' }}>

        {/* Section label */}
        <p style={{
          margin: '6px 0 8px 10px',
          fontSize: 9, fontWeight: 800, letterSpacing: '0.15em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
        }}>
          Navigation
        </p>

        {navItems.map((item, i) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavClick}
            onMouseEnter={() => setHovIdx(i)}
            onMouseLeave={() => setHovIdx(null)}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '11px 14px',
              borderRadius: 12,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '-0.1px',
              transition: 'all 0.17s ease',
              position: 'relative',
              overflow: 'hidden',

              // Active
              background: isActive
                ? 'linear-gradient(135deg, rgba(154,111,46,0.22) 0%, rgba(196,154,74,0.12) 100%)'
                : hovIdx === i
                  ? 'rgba(255,255,255,0.05)'
                  : 'transparent',
              color: isActive ? '#F0D090' : hovIdx === i ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.48)',
              border: isActive
                ? '1px solid rgba(196,154,74,0.22)'
                : '1px solid transparent',
              boxShadow: isActive ? 'inset 0 1px 0 rgba(255,255,255,0.04)' : 'none',
            })}
          >
            {({ isActive }) => (
              <>
                {/* Active left bar */}
                {isActive && (
                  <div style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: 3, borderRadius: '0 2px 2px 0',
                    background: 'linear-gradient(180deg, #C49A4A, #9A6F2E)',
                    boxShadow: '0 0 8px rgba(196,154,74,0.5)',
                  }} />
                )}

                {/* Icon wrapper */}
                <div style={{
                  width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive
                    ? 'rgba(196,154,74,0.15)'
                    : 'rgba(255,255,255,0.04)',
                  border: isActive
                    ? '1px solid rgba(196,154,74,0.2)'
                    : '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.17s',
                }}>
                  <span style={{
                    color: isActive ? '#C49A4A' : 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {item.icon}
                  </span>
                </div>

                {/* Label */}
                <span style={{ flex: 1 }}>{item.label}</span>

                {/* Active dot */}
                {isActive && (
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#C49A4A',
                    boxShadow: '0 0 6px rgba(196,154,74,0.7)',
                    flexShrink: 0,
                  }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div style={{
        padding: '12px 12px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
      }}>

        {/* Restaurant info chip */}
        {info?.email && (
          <div style={{
            padding: '9px 14px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            marginBottom: 8,
          }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.02em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
              {info.email}
            </p>
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHovLogout(true)}
          onMouseLeave={() => setHovLogout(false)}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 14px',
            background: hovLogout ? 'rgba(192,24,43,0.10)' : 'transparent',
            border: `1px solid ${hovLogout ? 'rgba(192,24,43,0.22)' : 'transparent'}`,
            borderRadius: 12,
            fontSize: 14, fontWeight: 700,
            color: hovLogout ? '#F87171' : 'rgba(255,255,255,0.38)',
            cursor: 'pointer',
            transition: 'all 0.17s ease',
            textAlign: 'left',
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 9, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hovLogout ? 'rgba(192,24,43,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${hovLogout ? 'rgba(192,24,43,0.2)' : 'rgba(255,255,255,0.05)'}`,
            transition: 'all 0.17s',
          }}>
            <span style={{ color: hovLogout ? '#F87171' : 'rgba(255,255,255,0.38)', display:'flex' }}>
              <LogoutIcon />
            </span>
          </div>
          Déconnexion
        </button>
      </div>

    </div>
  )
}