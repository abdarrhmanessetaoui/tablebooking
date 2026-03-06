import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'
import useRestaurantInfo from '../hooks/useRestaurantInfo'

export default function Sidebar({ handleLogout, onNavClick }) {
  const { info } = useRestaurantInfo()

  return (
    <div className="flex flex-col h-full">

      {/* Logo + restaurant name */}
      <div className="flex flex-col items-center justify-center py-7 px-4">
        <div
          className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center mb-3"
          style={{ backgroundColor: 'rgba(200,169,126,0.15)' }}
        >
          <img src="/images/tablebooking.png" alt="Logo" className="w-10 h-10 object-contain" />
        </div>
        <p className="text-white text-sm font-bold text-center leading-tight">
          {info.name || 'Dal Corso'}
        </p>
        <p className="text-xs text-center mt-0.5" style={{ color: 'rgba(200,169,126,0.6)' }}>
          {info.location || 'Marrakech'}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 flex-1 py-2">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavClick}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all"
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#c8a97e'             : 'transparent',
              color:           isActive ? '#fff'                : 'rgba(255,255,255,0.45)',
            })}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all hover:bg-white/5 mt-3"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          <LogoutIcon />
          <span>Déconnexion</span>
        </button>
      </div>

    </div>
  )
}