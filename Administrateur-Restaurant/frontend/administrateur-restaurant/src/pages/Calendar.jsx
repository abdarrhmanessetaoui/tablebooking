import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FileDown } from 'lucide-react'
import useCalendar   from '../hooks/Calendar/useCalendar'
import CalendarNav   from '../components/Calendar/CalendarNav'
import CalendarWeek  from '../components/Calendar/Calendarweek'
import FadeUp        from '../components/Dashboard/FadeUp'
import Spinner       from '../components/Dashboard/Spinner'
import Btn           from '../components/Dashboard/Btn'
import { exportPDF } from '../utils/export'

import {
  page, header, headerLeft,
  h1 as h1Style, divider,
  errorBanner, tabsCSS,
} from '../styles/dashboard/dashboard.styles'
import {
  DARK, LIGHT_BROWN, FONT_URL,
} from '../styles/dashboard/tokens'

export default function Calendar() {
  const { t } = useTranslation()
  const {
    view, setView, currentDate, setCurrentDate,
    weekDays, monthDays, loading, error,
    navigate, goToday, getByDate, getByMonth,
    navLabel, reservations,
  } = useCalendar()

  const [exporting, setExporting] = useState(false)
  const [weekSelectedDay, setWeekSelectedDay] = useState(null)

  useEffect(() => {
    // Notify the app that data is ready
    if (!loading) {
      window.dispatchEvent(new CustomEvent('app-ready'))
    }
  }, [loading])

  function handleNavigate(dir) {
    setWeekSelectedDay(null)
    navigate(dir)
  }
  function handleGoToday() {
    setWeekSelectedDay(null)
    goToday()
  }
  function handleSetView(v) {
    setWeekSelectedDay(null)
    setView(v)
  }

  async function handleExport() {
    setExporting(true)
    try {
      const allRes = view === 'day' ? getByDate(currentDate)
        : view === 'week' ? weekDays.flatMap(d => getByDate(d))
        : reservations || []
      
      await exportPDF(null, allRes, t('planning') + ' ' + navLabel())
    } catch(e) { console.error(e) } finally { setExporting(false) }
  }

  if (loading) return <Spinner fullPage />

  return (
    <>
      <style>{tabsCSS}</style>
      <link href={FONT_URL} rel="stylesheet" />

      <div style={page}>
        
        <FadeUp delay={0}>
          <div style={header}>
            <div style={headerLeft}>
              <h1 style={h1Style}>{t('planning')}</h1>
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={10}>
          <div style={divider} />
        </FadeUp>

        {error && (
          <FadeUp delay={15}>
            <div style={errorBanner}>
              {error}
            </div>
          </FadeUp>
        )}

        <FadeUp delay={20}>
          <CalendarNav
            view={view}
            setView={handleSetView}
            navLabel={navLabel}
            navigate={handleNavigate}
            goToday={handleGoToday}
            currentDate={currentDate}
          />
        </FadeUp>

        <FadeUp delay={40}>
          <CalendarWeek
            view={view}
            setView={handleSetView}
            weekDays={weekDays}
            monthDays={monthDays}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            getByDate={getByDate}
            getByMonth={getByMonth}
            onDayChange={setWeekSelectedDay}
          />
        </FadeUp>
      </div>
    </>
  )
}
