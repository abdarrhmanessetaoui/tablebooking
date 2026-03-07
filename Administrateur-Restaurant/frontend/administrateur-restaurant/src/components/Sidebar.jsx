import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import { useState } from 'react'
import { MapPin, LogOut } from 'lucide-react'

export default function Sidebar({ handleLogout, onNavClick }) {
  const { info } = useRestaurantInfo()
  const [hovIdx, setHovIdx] = useState(null)
  const [hovLogout, setHovLogout] = useState(false)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      background: '#0E1117',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>

      {/* ── LOGO TOP ── */}
      <div style={{
        padding: '22px 20px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src="/images/tablebooking.png"
          alt="TableBooking.ma"
          style={{ height: 32, objectFit: 'contain', display: 'block' }}
          onError={e => {
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'block'
          }}
        />
        {/* Text fallback */}
        <div style={{ display: 'none' }}>
          <span style={{
            fontSize: 16, fontWeight: 900,
            color: '#C49A4A', letterSpacing: '-0.3px',
          }}>
            Table<span style={{ color: '#fff' }}>Booking</span>
            <span style={{ color: '#C49A4A' }}>.ma</span>
          </span>
        </div>
      </div>

      {/* ── RESTAURANT INFO ── */}
      {(info?.name || info?.location) && (
        <div style={{
          margin: '12px 12px 0',
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 12,
        }}>
          {info?.name && (
            <p style={{
              margin: 0, fontSize: 13, fontWeight: 800,
              color: '#fff', letterSpacing: '-0.2px',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {info.name}
            </p>
          )}
          {info?.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
              <MapPin size={10} color="rgba(196,154,74,0.6)" strokeWidth={2} />
              <p style={{
                margin: 0, fontSize: 11, fontWeight: 600,
                color: 'rgba(255,255,255,0.35)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {info.location}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── NAV LABEL ── */}
      <p style={{
        margin: '18px 0 6px 24px',
        fontSize: 9, fontWeight: 800,
        color: 'rgba(255,255,255,0.2)',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
      }}>
        Menu
      </p>

      {/* ── NAV ITEMS ── */}
      <nav style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: '0 10px',
        overflowY: 'auto',
      }}>
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
              transition: 'all 0.15s ease',
              position: 'relative',
              background: isActive
                ? 'rgba(196,154,74,0.14)'
                : hovIdx === i
                  ? 'rgba(255,255,255,0.05)'
                  : 'transparent',
              color: isActive
                ? '#E5C97A'
                : hovIdx === i
                  ? 'rgba(255,255,255,0.82)'
                  : 'rgba(255,255,255,0.45)',
              border: isActive
                ? '1px solid rgba(196,154,74,0.2)'
                : '1px solid transparent',
            })}
          >
            {({ isActive }) => (
              <>
                {/* Left gold bar */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: 0, top: '20%', bottom: '20%',
                    width: 3, borderRadius: '0 3px 3px 0',
                    background: 'linear-gradient(180deg,#C49A4A,#9A6F2E)',
                    boxShadow: '0 0 8px rgba(196,154,74,0.55)',
                  }} />
                )}

                {/* Icon box */}
                <div style={{
                  width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive
                    ? 'rgba(196,154,74,0.15)'
                    : 'rgba(255,255,255,0.04)',
                  border: isActive
                    ? '1px solid rgba(196,154,74,0.22)'
                    : '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.15s',
                  color: isActive ? '#C49A4A' : 'inherit',
                }}>
                  {item.icon}
                </div>

                {/* Label */}
                <span style={{ flex: 1 }}>{item.label}</span>

                {/* Active dot */}
                {isActive && (
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#C49A4A',
                    boxShadow: '0 0 6px rgba(196,154,74,0.8)',
                    flexShrink: 0,
                  }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── LOGOUT ── */}
      <div style={{
        padding: '10px 10px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHovLogout(true)}
          onMouseLeave={() => setHovLogout(false)}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 14px',
            background: hovLogout ? 'rgba(248,113,113,0.08)' : 'transparent',
            border: `1px solid ${hovLogout ? 'rgba(248,113,113,0.2)' : 'transparent'}`,
            borderRadius: 12,
            fontSize: 14, fontWeight: 700,
            color: hovLogout ? '#F87171' : 'rgba(255,255,255,0.38)',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            textAlign: 'left',
          }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 10, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: hovLogout ? 'rgba(248,113,113,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${hovLogout ? 'rgba(248,113,113,0.18)' : 'rgba(255,255,255,0.05)'}`,
            transition: 'all 0.15s',
            color: 'inherit',
          }}>
            <LogoutIcon />
          </div>
          Déconnexion
        </button>
      </div>

    </div>
  )
}