import {
  Home, CalendarDays, BookOpen,
  BarChart2, Settings, CalendarOff, LogOut, Utensils, LayoutGrid
} from 'lucide-react'

export const navItems = [
  { to: '/dashboard', label: 'Tableau de bord', i18nKey: 'dashboard', icon: <Home size={22} strokeWidth={2} /> },
  { to: '/reservations',  label: 'Réservations', i18nKey: 'reservations',    icon: <BookOpen        size={22} strokeWidth={2} /> },
  { to: '/calendar',      label: 'Planning', i18nKey: 'planning',        icon: <CalendarDays    size={22} strokeWidth={2} /> },
  { to: '/blocked-dates', label: 'Dates bloquées', i18nKey: 'blocked_dates',  icon: <CalendarOff     size={22} strokeWidth={2} /> },
  { to: '/services',      label: 'Services', i18nKey: 'services',        icon: <Utensils        size={22} strokeWidth={2} /> },
  { to: '/tables',       label: 'Tables', i18nKey: 'tables',         icon: <LayoutGrid     size={22} strokeWidth={2} /> },
  { to: '/reports',       label: 'Rapports', i18nKey: 'reports',        icon: <BarChart2       size={22} strokeWidth={2} /> },
  { to: '/settings',      label: 'Paramètres', i18nKey: 'settings',      icon: <Settings        size={22} strokeWidth={2} /> },
]

export function LogoutIcon() {
  return <LogOut size={22} strokeWidth={2} />
}

export function HamburgerIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="3" y1="6"  x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  )
}

export function CloseIcon() {
  return (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="18" y1="6"  x2="6"  y2="18"/>
      <line x1="6"  y1="6"  x2="18" y2="18"/>
    </svg>
  )
}
