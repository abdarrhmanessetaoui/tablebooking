import {
  PiLayoutDashboardFill,
  PiCalendarFill,
  PiProhibitFill,
  PiClockFill,
  PiChartBarFill,
  PiGearFill,
  PiSignOutFill,
  PiListFill,
  PiXBold,
} from 'react-icons/pi'

export const navItems = [
  { to: '/dashboard',     label: 'Dashboard',     icon: <PiLayoutDashboardFill size={18} /> },
  { to: '/reservations',  label: 'Reservations',  icon: <PiCalendarFill        size={18} /> },
  { to: '/blocked-dates', label: 'Blocked Dates', icon: <PiProhibitFill        size={18} /> },
  { to: '/calendar',      label: 'Timeline',      icon: <PiClockFill           size={18} /> },
  { to: '/reports',       label: 'Reports',       icon: <PiChartBarFill        size={18} /> },
  { to: '/settings',      label: 'Settings',      icon: <PiGearFill            size={18} /> },
]

export const LogoutIcon    = () => <PiSignOutFill size={18} />
export const HamburgerIcon = () => <PiListFill    size={22} />
export const CloseIcon     = () => <PiXBold       size={20} />