import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import useDashboard from '../hooks/Dashboard/useDashboard'
import useRestaurantInfo from '../hooks/useRestaurantInfo'
import Sidebar from './Sidebar'
import { HamburgerIcon, CloseIcon } from '../data/sidebarItems'
import { MdKeyboardArrowDown, MdLocationOn } from 'react-icons/md'

const PAGE_TITLES = {
  '/dashboard':     'Dashboard',
  '/reservations':  'Réservations',
  '/blocked-dates': 'Dates bloquées',
  '/calendar':      'Planning',
  '/reports':       'Rapports',
  '/settings':      'Paramètres',
}
  
export default function Layout({ children }) {
  const { handleLogout }  = useDashboard()
  const { info }          = useRestaurantInfo()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const pageTitle = PAGE_TITLES[location.pathname] || 'Dashboard'

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'short', month: 'short', day: 'numeric',
  })

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#2b2118' }}>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 min-h-screen flex-col flex-shrink-0">
        <Sidebar handleLogout={handleLogout} onNavClick={() => {}} />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside
        className="fixed top-0 left-0 h-full w-60 flex flex-col z-50 md:hidden transition-transform duration-300"
        style={{
          backgroundColor: '#2b2118',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <Sidebar handleLogout={handleLogout} onNavClick={() => setSidebarOpen(false)} />
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col min-w-0">

{/* /*         {/* Header */}
{/*         <header
          className="flex items-center justify-between px-6 sm:px-8 py-4 flex-shrink-0"
          style={{ backgroundColor: '#2b2118' }}
        >
          {/* Left — page title */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-xl"
              style={{ color: '#c8a97e' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <CloseIcon /> : <HamburgerIcon />}
            </button>
            <div>
              <h2 className="text-base font-bold text-white">{pageTitle}</h2>
              <p className="text-xs hidden sm:block capitalize" style={{ color: 'rgba(200,169,126,0.5)' }}>{today}</p>
            </div>
          </div>
        /*</div>*/}

          {/* Right — restaurant info */}
            {/* <div className="flex items-center gap-2.5"> */}

              {/* Location pill — desktop only */}
              {/* {info.location && (
                <div
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{ backgroundColor: 'rgba(200,169,126,0.08)', color: 'rgba(200,169,126,0.7)' }}
                >
                  <MdLocationOn size={13} color="#c8a97e" />
                  {info.location}
                </div>
              )} */}

              {/* Divider */}
              {/* <div className="w-px h-6" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} /> */}

              {/* Restaurant avatar + name */}
              {/* <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors">
                <div
                  className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(200,169,126,0.15)' }}
                >
                  <img src="/images/tablebooking.png" alt="Logo" className="w-5 h-5 object-contain" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-white leading-tight">{info.name || 'Dal Corso'}</p>
                  <p className="text-xs leading-tight" style={{ color: 'rgba(200,169,126,0.6)' }}>
                    {info.email || 'Restaurant'}
                  </p>
                </div>
                <MdKeyboardArrowDown size={15} color="rgba(200,169,126,0.5)" />
              </button> */}

            {/* </div> */}
        </header> */ */

        {/* Content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{
            backgroundColor: '#f5f0eb',
            borderRadius: '28px 0 0 0',
          }}
        >
          {children}
        </main>

      </div>
    </div>
  )
}