import {
  Home, CalendarDays, BookOpen,
  BarChart2, Settings, CalendarOff, LogOut, Utensils, LayoutGrid
} from 'lucide-react'

// ── Consistent stroke weight: 1.5 for all icons ──
const ICON_SIZE   = 20
const ICON_STROKE = 1.5

export const navItems = [
  { to: '/dashboard', label: 'Tableau de bord', i18nKey: 'dashboard', icon: <Home size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { to: '/reservations',  label: 'Réservations', i18nKey: 'reservations',    icon: <BookOpen        size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { to: '/calendar',      label: 'Planning', i18nKey: 'planning',        icon: <CalendarDays    size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { to: '/blocked-dates', label: 'Dates bloquées', i18nKey: 'blocked_dates',  icon: <CalendarOff     size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { to: '/services',      label: 'Services', i18nKey: 'services',        icon: <Utensils        size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { to: '/tables',       label: 'Tables', i18nKey: 'tables',         icon: <LayoutGrid     size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { to: '/reports',       label: 'Rapports', i18nKey: 'reports',        icon: <BarChart2       size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
  { to: '/settings',      label: 'Paramètres', i18nKey: 'settings',      icon: <Settings        size={ICON_SIZE} strokeWidth={ICON_STROKE} /> },
]

export function LogoutIcon() {
  return <LogOut size={ICON_SIZE} strokeWidth={ICON_STROKE} />
}

export function HamburgerIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="3" y1="6"  x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="18" y1="6"  x2="6"  y2="18"/>
      <line x1="6"  y1="6"  x2="18" y2="18"/>
    </svg>
  )
}
