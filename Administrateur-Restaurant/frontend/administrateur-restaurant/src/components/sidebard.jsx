import { NavLink, useNavigate } from "react-router-dom";


const NAV = [
    { to: "/dashboard",    label: "Dashboard",     Icon: IconGrid     },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  return (

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
          <IconCalendar size={16} className="text-white" />
        </div>
        <div>
          <span className="font-display text-sm font-bold leading-tight tracking-tight text-white">
            TableBooking
          </span>
          <span className="text-brand-400 font-display text-sm font-bold">.ma</span>
        </div>
      </div>

      {/* Restaurant name tag */}
      <div className="px-6 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400 font-medium truncate">Gusto Marrakech</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 pb-2 text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
          Menu
        </p>
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
               transition-all duration-150 group
               ${isActive
                ? "bg-brand-500 text-white shadow-lg shadow-brand-500/25"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={17} className={isActive ? "text-white" : "text-slate-500 group-hover:text-white transition-colors"} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium
            text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-150"
        >
          <IconLogout size={17} className="text-slate-500" />
          Log out
        </button>
      </div>

      {/* Admin badge */}
      <div className="px-4 pb-4">
        <div className="rounded-xl bg-white/5 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 border border-brand-500/30
            flex items-center justify-center text-brand-400 text-xs font-bold flex-shrink-0">
            A
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Admin</p>
            <p className="text-[11px] text-slate-500 truncate">admin@gusto.ma</p>
          </div>
        </div>
      </div>
    </aside>
  );
}