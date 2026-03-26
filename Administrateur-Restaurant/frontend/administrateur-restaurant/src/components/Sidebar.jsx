import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import { useState } from 'react'
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const DARK = '#2b2118'
const GOLD = '#c8a97e'

function LanguageSelector({ collapsed }) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const [hovBtn, setHovBtn] = useState(false)
  const [hovItem, setHovItem] = useState(null)

  const langs = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'ar', label: 'العربية' }
  ]

  const currentLang = i18n.language || 'fr'

  const handleSelect = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('lang', code)
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: 4 }}>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', bottom: '100%', left: collapsed ? '50%' : 0,
            transform: collapsed ? 'translateX(-50%)' : 'none',
            marginBottom: 8, background: DARK, border: `2px solid ${GOLD}`,
            zIndex: 50, display: 'flex', flexDirection: 'column',
            minWidth: 140, padding: 4,
          }}>
            {langs.map((l, i) => (
              <button
                key={l.code}
                onClick={() => handleSelect(l.code)}
                onMouseEnter={() => setHovItem(i)}
                onMouseLeave={() => setHovItem(null)}
                style={{
                  background: hovItem === i ? 'rgba(200,169,126,0.15)' : 'transparent',
                  color: currentLang === l.code ? GOLD : 'rgba(255,255,255,0.8)',
                  border: 'none', padding: '10px 14px', textAlign: 'left',
                  cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHovBtn(true)}
        onMouseLeave={() => setHovBtn(false)}
        title={collapsed ? t('language') : undefined}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          gap: collapsed ? 0 : 13,
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '13px 0' : '13px 16px',
          background: open ? 'rgba(200,169,126,0.15)' : hovBtn ? 'rgba(200,169,126,0.1)' : 'transparent',
          border: 'none',
          color: open || hovBtn ? GOLD : 'rgba(255,255,255,0.4)',
          cursor: 'pointer',
          transition: 'background 0.15s, color 0.15s',
          fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: 'inherit' }}>
          <Globe size={22} strokeWidth={2} />
        </span>
        {!collapsed && <span style={{ textAlign: 'left', flex: 1 }}>{t('language')}</span>}
      </button>
    </div>
  )
}

export default function Sidebar({ handleLogout, onNavClick, collapsed, onToggle }) {
  const { t } = useTranslation()
  const [hov,    setHov]    = useState(null)
  const [hovOut, setHovOut] = useState(false)

  return (
    <div style={{
      width: '100%', height: '100%',
      background: DARK,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
      overflow: 'hidden',
    }}>

      {/* LOGO */}
      <div style={{
        padding: collapsed ? '28px 0 24px' : '28px 24px 24px',
        borderBottom: `2px solid rgba(200,169,126,0.18)`,
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
            title={collapsed ? t('expand') : t('collapse')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 28, height: 28, flexShrink: 0,
              background: 'rgba(200,169,126,0.1)',
              border: '2px solid rgba(200,169,126,0.2)',
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
            title={collapsed ? t(item.i18nKey) : undefined}
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
                    {t(item.i18nKey)}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER ACTIONS */}
      <div style={{ padding: collapsed ? '10px 8px 28px' : '10px 8px 28px', borderTop:`2px solid rgba(200,169,126,0.18)`, flexShrink:0 }}>
        
        <LanguageSelector collapsed={collapsed} />

        <button
          onClick={handleLogout}
          onMouseEnter={() => setHovOut(true)}
          onMouseLeave={() => setHovOut(false)}
          title={collapsed ? t('logout') : undefined}
          style={{
            width:'100%', display:'flex', alignItems:'center',
            gap: collapsed ? 0 : 13,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '13px 0' : '13px 16px',
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
          {!collapsed && <span>{t('logout')}</span>}
        </button>
      </div>
    </div>
  )
}