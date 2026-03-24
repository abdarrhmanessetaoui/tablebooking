// src/data/sidebarItems.js
import { 
  Home, CalendarDays, BookOpen, BarChart2, Settings, CalendarOff, LogOut, Utensils, LayoutGrid 
} from 'lucide-react'

// 🌟 Define icons
const DashboardIcon    = () => <Home size={20} strokeWidth={2.2} />
const ReservationsIcon = () => <BookOpen size={20} strokeWidth={2.2} />
const BlockedDatesIcon = () => <CalendarOff size={20} strokeWidth={2.2} />
const CalendarIcon     = () => <CalendarDays size={20} strokeWidth={2.2} />
const ServicesIcon     = () => <Utensils size={20} strokeWidth={2.2} />
const ReportsIcon      = () => <BarChart2 size={20} strokeWidth={2.2} />
const SettingsIcon     = () => <Settings size={20} strokeWidth={2.2} />
const TablesIcon       = () => <LayoutGrid size={20} strokeWidth={2.2} />

export const navItems = [
  { to: "/dashboard", icon: <DashboardIcon />, label: "dashboard" },
  { to: "/reservations", icon: <ReservationsIcon />, label: "reservations" },
  { to: "/blocked-dates", icon: <BlockedDatesIcon />, label: "blocked_dates" },
  { to: "/calendar", icon: <CalendarIcon />, label: "calendar" },
  { to: "/services", icon: <ServicesIcon />, label: "services" },
  { to: "/reports", icon: <ReportsIcon />, label: "reports" },
  { to: "/settings", icon: <SettingsIcon />, label: "settings" },
  { to: "/tables", icon: <TablesIcon />, label: "tables" },
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