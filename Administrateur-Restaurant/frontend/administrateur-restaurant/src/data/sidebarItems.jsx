import {
  MdDashboard,
  MdCalendarMonth,
  MdEventBusy,
  MdAccessTime,
  MdBarChart,
  MdSettings,
  MdLogout,
  MdMenu,
  MdClose,
} from 'react-icons/md'

export const navItems = [
  { to: '/dashboard',     label: 'Dashboard',     icon: <MdDashboard     size={20} /> },
  { to: '/reservations',  label: 'Reservations',  icon: <MdCalendarMonth size={20} /> },
  { to: '/blocked-dates', label: 'Blocked Dates', icon: <MdEventBusy     size={20} /> },
  { to: '/calendar',      label: 'Timeline',      icon: <MdAccessTime    size={20} /> },
  { to: '/reports',       label: 'Reports',       icon: <MdBarChart      size={20} /> },
  { to: '/settings',      label: 'Settings',      icon: <MdSettings      size={20} /> },
]

export const LogoutIcon    = () => <MdLogout size={20} />
export const HamburgerIcon = () => <MdMenu   size={24} />
export const CloseIcon     = () => <MdClose  size={24} />