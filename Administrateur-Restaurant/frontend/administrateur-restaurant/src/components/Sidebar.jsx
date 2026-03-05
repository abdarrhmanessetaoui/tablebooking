import { NavLink } from 'react-router-dom'
import { navItems, LogoutIcon } from '../data/sidebarItems'

export default function Sidebar({ handleLogout, onNavClick }) {
  return (
    <>
      {/* Restaurant branding */}
      <div className="px-5 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: 'rgba(200,169,126,0.15)' }}
          >
            <img src="/images/tablebooking.png" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-tight">Dal Corso</p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(200,169,126,0.6)' }}>Marrakech</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-3 py-4 flex-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#c8a97e'             : 'transparent',
              color:           isActive ? '#fff'                : 'rgba(200,169,126,0.6)',
            })}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5 mt-3"
          style={{ color: 'rgba(200,169,126,0.6)' }}
        >
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>
    </>
  )
}