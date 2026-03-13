import {
  LayoutDashboard, CalendarDays, BookOpen,
  BarChart2, Settings, CalendarOff, LogOut, Utensils,
} from 'lucide-react'

export const navItems = [
  { to: '/dashboard',     label: 'Tableau de bord', icon: <LayoutDashboard size={22} strokeWidth={2} /> },
  { to: '/reservations',  label: 'Réservations',    icon: <BookOpen        size={22} strokeWidth={2} /> },
  { to: '/calendar',      label: 'Planning',        icon: <CalendarDays    size={22} strokeWidth={2} /> },
  { to: '/blocked-dates', label: 'Dates bloquées',  icon: <CalendarOff     size={22} strokeWidth={2} /> },
  { to: '/services',      label: 'Services',        icon: <Utensils        size={22} strokeWidth={2} /> },
  { to: '/reports',       label: 'Rapports',        icon: <BarChart2       size={22} strokeWidth={2} /> },
/*   { to: '/settings',      label: 'Paramètres',      icon: <Settings        size={22} strokeWidth={2} /> }, */
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