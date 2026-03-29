import { useTranslation } from 'react-i18next'
import useRestaurantSettings from '../../hooks/settings/useRestaurantSettings.js'
import FadeUp from '../../Dashboard/FadeUp'
import Spinner from '../../Dashboard/Spinner'
import RestaurantInfoSection  from './RestaurantInfoSection'
import HoursPlanningSection   from './HoursPlanningSection'
import NotificationsSection   from './NotificationsSection'
import '../../styles/settings/settings.css'

const DARK    = '#423428'
const GOLD_DK = '#a8834e'
const CREAM   = '#ffffff'

export default function Settings() {
  const { t } = useTranslation()
  const {
    loading,
    info, setInfoField, saveInfo, savingInfo,
    hours, activeService, setActiveServiceIdx, activeDay, setActiveDay,
    toggleWorkingDay, updateDayOH, saveHours, savingHours,
    services, servicesOnActiveDay,
    notifications, setNotifField, saveNotif, savingNotif,
  } = useRestaurantSettings()

  if (loading) return (
    <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner />
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: CREAM,
      fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
      padding: 'clamp(14px,3vw,40px) clamp(12px,4vw,36px)',
      width: '100%',
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <FadeUp delay={0}>
        <h1 style={{
          margin: 0,
          fontSize: 'clamp(20px,5vw,36px)',
          fontWeight: 900,
          color: DARK,
          letterSpacing: '-1.5px',
          lineHeight: 1,
        }}>
          {t('settings_module.title')}
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK }} />
      </FadeUp>

      <FadeUp delay={10}>
        <div style={{ height: 4, background: DARK, margin: '16px 0 32px' }} />
      </FadeUp>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>

        <FadeUp delay={20}>
          <RestaurantInfoSection
            info={info}
            setInfoField={setInfoField}
            saveInfo={saveInfo}
            savingInfo={savingInfo}
          />
        </FadeUp>

        <FadeUp delay={30}>
          <HoursPlanningSection
            hours={hours}
            services={services}
            servicesOnActiveDay={servicesOnActiveDay}
            activeService={activeService}
            setActiveServiceIdx={setActiveServiceIdx}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            toggleWorkingDay={toggleWorkingDay}
            updateDayOH={updateDayOH}
            saveHours={saveHours}
            savingHours={savingHours}
          />
        </FadeUp>

        <FadeUp delay={40}>
          <NotificationsSection
            notifications={notifications}
            setNotifField={setNotifField}
            saveNotif={saveNotif}
            savingNotif={savingNotif}
          />
        </FadeUp>

      </div>
    </div>
  )
}