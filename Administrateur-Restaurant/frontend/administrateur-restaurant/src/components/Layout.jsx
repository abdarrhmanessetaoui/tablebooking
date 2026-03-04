import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard',    label: 'Dashboard',    icon: '🏠' },
  { to: '/reservations', label: 'Reservations', icon: '📅' },
]

export default function Layout({ children }) {
  const { handleLogout } = useDashboard()

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f5f0eb' }}>

      {/* Sidebar */}
      <aside className="w-56 min-h-screen flex flex-col shadow-md" style={{ backgroundColor: '#2b2118' }}>

        <div className="flex items-center justify-center py-6 border-b border-white/10">
          <img src="/images/tablebooking.png" alt="Logo" className="h-10 object-contain" />
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all"
              style={({ isActive }) => ({
                backgroundColor: isActive ? '#c8a97e' : 'transparent',
                color: isActive ? '#fff' : '#c8a97e',
              })}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm hover:opacity-80 transition-all"
            style={{ color: '#c8a97e' }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  )
}