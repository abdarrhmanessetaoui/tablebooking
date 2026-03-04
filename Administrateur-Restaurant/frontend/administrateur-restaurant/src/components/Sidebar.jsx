import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'

export default function Sidebar({ handleLogout, onNavClick }) {
  return (
    <>
      <div className="flex items-center justify-center py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <img src="/images/tablebooking.png" alt="Logo" className="h-10 object-contain" />
      </div>

      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all"
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#c8a97e' : 'transparent',
              color: isActive ? '#fff' : 'rgba(200,169,126,0.7)',
            })}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-6 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all hover:bg-white/5"
          style={{ color: 'rgba(200,169,126,0.7)' }}
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>
    </>
  )
}