

export const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/reservations',  label: 'Réservations' },
  { to: '/calendar',      label: 'Planning' },
  { to: '/blocked-dates', label: 'Dates Bloquées' },
  { to: '/services',      label: 'Services' },
  { to: '/tables',       label: 'Tables' },
  { to: '/reports',       label: 'Rapports' },
  { to: '/settings',      label: 'Paramètres' },
]

export function LogoutIcon() { return null }

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