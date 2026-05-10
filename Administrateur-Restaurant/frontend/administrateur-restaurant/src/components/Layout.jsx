import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import useDashboard from '../hooks/Dashboard/useDashboard'
import Sidebar from './Sidebar'
import { HamburgerIcon, CloseIcon } from '../data/sidebarItems'
import {
  DARK, LIGHT_BROWN, BG_PAGE, BORDER, RADIUS, WHITE, FONT_URL
} from '../styles/dashboard/tokens'

const SW_OPEN      = 240
const SW_COLLAPSED = 68

const PAGE_TITLES = {
  '/dashboard':     'dashboard',
  '/reservations':  'reservations',
  '/blocked-dates': 'blocked_dates',
  '/calendar':      'planning',
  '/services':      'services',
  '/reports':       'reports',
  '/settings':      'settings',
  '/tables':        'tables',
}

export default function Layout({ children }) {
  const { t, i18n } = useTranslation()
  const { handleLogout }          = useDashboard()
  const [open, setOpen]           = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const location                  = useLocation()
  const titleKey                  = PAGE_TITLES[location.pathname] || 'dashboard'
  const title                     = t(titleKey)
  const SW                        = collapsed ? SW_COLLAPSED : SW_OPEN

  return (
    <>

    <div className="l-root" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>

        {/* Desktop sidebar */}
        <aside className="l-aside" style={{ width: SW }}>
          <Sidebar
            handleLogout={handleLogout}
            onNavClick={() => {}}
            collapsed={collapsed}
            onToggle={() => setCollapsed(c => !c)}
          />
        </aside>

        {/* Mobile overlay */}
        <div
          className={`l-overlay ${open ? 'active' : ''}`}
          onClick={() => setOpen(false)}
        />

        {/* Mobile drawer */}
        <div className={`l-drawer${open ? ' open' : ''}`}>
          <Sidebar
            handleLogout={handleLogout}
            onNavClick={() => setOpen(false)}
            collapsed={false}
            onToggle={() => {}}
          />
        </div>

        {/* Content column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* Mobile topbar */}
          <header className="l-topbar">
            <button
              onClick={() => setOpen(o => !o)}
              aria-label="Menu"
              style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: RADIUS.sm, color: DARK, cursor: 'pointer', flexShrink: 0, transition: 'none' }}>
              {open ? <CloseIcon /> : <HamburgerIcon />}
            </button>

            <img src="/images/tablebooking.png" alt="TableBooking.ma"
              style={{ height: 20, objectFit: 'contain' }}
              onError={e => { e.target.style.display = 'none' }} />

            <span style={{ fontSize: 12, fontWeight: 900, color: DARK, minWidth: 72, textAlign: i18n.language === 'ar' ? 'left' : 'right', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {title}
            </span>
          </header>

          <main className="l-main">{children || <Outlet />}</main>
        </div>
      </div>
    </>
  )
}
