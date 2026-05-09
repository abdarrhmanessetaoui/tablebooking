import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { DARK, LIGHT_BROWN, BORDER, RADIUS, WHITE } from '../../styles/dashboard/tokens'

const VIEWS  = ['day', 'week', 'month', 'year']

export default function CalendarNav({ view, setView, navLabel, navigate, goToday, currentDate }) {
  const { t } = useTranslation()
  const isToday = new Date().toDateString() === currentDate.toDateString()

  const btnBase = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: 40, padding: '0 12px',
    background: WHITE, border: `1px solid ${BORDER}`,
    borderRadius: RADIUS.sm, color: DARK,
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'inherit', transition: 'none'
  }

  return (
    <>
      <style>{`
        .cnav { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 24px; }
        .cnav-left  { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .cnav-label { 
          display: flex; align-items: center; gap: 10px; padding: 0 16px; height: 40px;
          border: 1px solid ${BORDER}; background: #fff; border-radius: ${RADIUS.sm}px;
          min-width: 0; 
        }
        .cnav-views { 
          display: flex; background: #fff; padding: 0; border-radius: ${RADIUS.sm}px; 
          border: 1px solid ${BORDER}; overflow: hidden;
        }
        .cnav-views button { 
          padding: 10px 16px; border: none; background: none; color: ${DARK}; 
          font-size: 13px; font-weight: 600; cursor: pointer; transition: none; 
          font-family: inherit; border-right: 1px solid ${BORDER};
        }
        .cnav-views button:last-child { border-right: none; }
        .cnav-views button.active {
          background: ${LIGHT_BROWN};
          color: #fff;
        }
        @media(max-width:640px){
          .cnav { flex-direction: column; align-items: flex-start; }
          .cnav-label { width: 100%; order: -1; margin-bottom: 4px; }
          .cnav-views { width: 100%; }
          .cnav-views button { flex: 1; padding: 10px 8px; font-size: 11px; }
        }
      `}</style>

      <div className="cnav">
        <div className="cnav-left">
          <button onClick={() => navigate('prev')} style={btnBase}><ChevronLeft size={16} strokeWidth={2.5} /></button>

          <div className="cnav-label">
            <span style={{ fontSize: 13, fontWeight: 700, color: DARK, whiteSpace: 'nowrap' }}>
              {navLabel()}
            </span>
          </div>

          <button onClick={() => navigate('next')} style={btnBase}><ChevronRight size={16} strokeWidth={2.5} /></button>

          {!isToday && (
            <button onClick={goToday} style={btnBase}>
              {t('today')}
            </button>
          )}
        </div>

        <div className="cnav-views">
          {VIEWS.map((v) => (
            <button key={v} onClick={() => setView(v)} className={view === v ? 'active' : ''}>
              {t(v)}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
