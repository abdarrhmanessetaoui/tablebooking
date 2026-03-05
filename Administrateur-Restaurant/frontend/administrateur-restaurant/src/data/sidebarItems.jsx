import { LayoutDashboard, CalendarDays, Ban, Clock, BarChart2, Settings, LogOut, Menu, X } from 'lucide-react'

export const navItems = [
  { to: '/dashboard',     label: 'Dashboard',     icon: <LayoutDashboard style={{ width: 17, height: 17 }} strokeWidth={1.8} /> },
  { to: '/reservations',  label: 'Reservations',  icon: <CalendarDays    style={{ width: 17, height: 17 }} strokeWidth={1.8} /> },
  { to: '/blocked-dates', label: 'Blocked Dates', icon: <Ban             style={{ width: 17, height: 17 }} strokeWidth={1.8} /> },
  { to: '/calendar',      label: 'Timeline',      icon: <Clock           style={{ width: 17, height: 17 }} strokeWidth={1.8} /> },
  { to: '/reports',       label: 'Reports',       icon: <BarChart2       style={{ width: 17, height: 17 }} strokeWidth={1.8} /> },
  { to: '/settings',      label: 'Settings',      icon: <Settings        style={{ width: 17, height: 17 }} strokeWidth={1.8} /> },
]

export const LogoutIcon    = () => <LogOut style={{ width: 17, height: 17 }} strokeWidth={1.8} />
export const HamburgerIcon = () => <Menu   style={{ width: 22, height: 22 }} strokeWidth={2}   />
export const CloseIcon     = () => <X      style={{ width: 22, height: 22 }} strokeWidth={2}   />