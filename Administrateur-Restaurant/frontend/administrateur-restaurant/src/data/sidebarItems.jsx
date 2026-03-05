import { LayoutDashboard, CalendarDays, Ban, Clock, BarChart2, LogOut, Menu, X } from 'lucide-react'

export const navItems = [
  { to: '/dashboard',    label: 'Dashboard',    icon: <LayoutDashboard size={17} strokeWidth={1.8} /> },
  { to: '/reservations', label: 'Reservations', icon: <CalendarDays    size={17} strokeWidth={1.8} /> },
  { to: '/blocked-dates',label: 'Blocked Dates',icon: <Ban             size={17} strokeWidth={1.8} /> },
  { to: '/calendar',     label: 'Timeline',     icon: <Clock           size={17} strokeWidth={1.8} /> },
  { to: '/reports',      label: 'Reports',      icon: <BarChart2       size={17} strokeWidth={1.8} /> },
]

export const LogoutIcon    = () => <LogOut  size={17} strokeWidth={1.8} />
export const HamburgerIcon = () => <Menu    size={22} strokeWidth={2}   />
export const CloseIcon     = () => <X       size={22} strokeWidth={2}   />