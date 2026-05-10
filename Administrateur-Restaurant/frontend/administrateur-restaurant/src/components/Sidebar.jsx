import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import {
  DARK, LIGHT_BROWN, BORDER, RADIUS, WHITE
} from '../styles/dashboard/tokens'

export default function Sidebar({ handleLogout, onNavClick, collapsed, onToggle }) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === 'ar'

  return (
    <div style={{
      width: '100%', height: '100%',
      background: WHITE,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
      overflow: 'hidden',
      borderRight: `1px solid ${BORDER}`,
    }}>

      {/* LOGO */}
      <div style={{
        position: 'relative',
        padding: collapsed ? '24px 0' : '32px 14px',
        borderBottom: 'none',
        flexShrink: 0,
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        minHeight: collapsed ? 'auto' : 100,
      }}>
        {!collapsed && (
          <img
            src="/images/tablebooking.png"
            alt="TableBooking.ma"
            style={{ height: 56, objectFit: 'contain', display: 'block', flexShrink: 0 }}
          />
        )}

        {/* Collapse toggle */}
        {onToggle && (
          <button
            onClick={onToggle}
            title={collapsed ? t('expand') : t('collapse')}
            style={{
              ...(collapsed ? {
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              } : {
                position: 'absolute', top: 16, right: isRtl ? 'auto' : 16, left: isRtl ? 16 : 'auto',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }),
              width: 26, height: 26, flexShrink: 0,
              background: 'transparent',
              border: 'none',
              borderRadius: RADIUS.sm,
              color: LIGHT_BROWN,
              cursor: 'pointer', transition: 'none',
            }}
          >
            {collapsed
              ? (isRtl ? <ChevronLeft size={13} strokeWidth={2.5} /> : <ChevronRight size={13} strokeWidth={2.5} />)
              : (isRtl ? <ChevronRight size={13} strokeWidth={2.5} /> : <ChevronLeft size={13} strokeWidth={2.5} />)
            }
          </button>
        )}
      </div>

      {/* NAV */}
      <nav style={{
        flex: 1, padding: '12px 10px',
        display: 'flex', flexDirection: 'column', gap: 2,
        overflowY: 'auto', overflowX: 'hidden',
      }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavClick}
            title={collapsed ? t(item.i18nKey) : undefined}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center',
              gap: collapsed ? 0 : 12,
              padding: collapsed ? '12px 0' : '10px 14px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              textDecoration: 'none',
              borderRadius: RADIUS.sm,
              background: isActive ? LIGHT_BROWN : 'transparent',
              color: isActive ? WHITE : DARK,
              transition: 'none',
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{ display:'flex', alignItems:'center', flexShrink:0, color: 'inherit', opacity: isActive ? 1 : 0.4 }}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span style={{ fontSize:13, fontWeight: 800, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                    {t(item.i18nKey)}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER ACTIONS */}
      <div style={{ padding: '12px 10px 24px', borderTop:`1px solid ${BORDER}`, flexShrink:0 }}>
        
        <LanguageSwitcher collapsed={collapsed} dark={false} />

        <button
          onClick={handleLogout}
          title={collapsed ? t('logout') : undefined}
          style={{
            width:'100%', display:'flex', alignItems:'center',
            gap: collapsed ? 0 : 12,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: '10px 14px',
            borderRadius: RADIUS.sm,
            background: 'transparent',
            border: 'none',
            color: DARK,
            cursor:'pointer',
            transition: 'none',
            fontFamily:'inherit', fontSize:13, fontWeight:800, textAlign: isRtl ? 'right' : 'left',
          }}
        >
          <span style={{ display:'flex', alignItems:'center', flexShrink:0, color:'inherit', opacity: 0.4 }}>
            <LogoutIcon />
          </span>
          {!collapsed && <span>{t('logout')}</span>}
        </button>
      </div>
    </div>
  )
}
