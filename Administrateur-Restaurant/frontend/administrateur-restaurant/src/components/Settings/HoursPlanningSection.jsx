import { Clock, X, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DARK, LIGHT_BROWN, LIGHT_BROWN_DK, CREAM } from './constants'
import Section    from './Section'
import Label      from './Label'
import TabBtn     from './TabBtn'
import TimeInput  from './TimeInput'
import SaveBtn    from './SaveBtn'

export default function HoursPlanningSection({
  hours,
  services,
  servicesOnActiveDay,
  activeService,
  setActiveServiceIdx,
  activeDay,
  setActiveDay,
  toggleWorkingDay,
  updateDayOH,
  saveHours,
  savingHours,
}) {
  const { t } = useTranslation()

  const DAYS = [
    t('services_module.sun_short', { defaultValue: 'Sun' }),
    t('services_module.mon_short', { defaultValue: 'Mon' }),
    t('services_module.tue_short', { defaultValue: 'Tue' }),
    t('services_module.wed_short', { defaultValue: 'Wed' }),
    t('services_module.thu_short', { defaultValue: 'Thu' }),
    t('services_module.fri_short', { defaultValue: 'Fri' }),
    t('services_module.sat_short', { defaultValue: 'Sat' }),
  ]
  const DAYS_FULL = [
    t('services_module.sun_full', { defaultValue: 'Sunday' }),
    t('services_module.mon_full', { defaultValue: 'Monday' }),
    t('services_module.tue_full', { defaultValue: 'Tuesday' }),
    t('services_module.wed_full', { defaultValue: 'Wednesday' }),
    t('services_module.thu_full', { defaultValue: 'Thursday' }),
    t('services_module.fri_full', { defaultValue: 'Friday' }),
    t('services_module.sat_full', { defaultValue: 'Saturday' }),
  ]

  const currentSvc  = servicesOnActiveDay[activeService]
  const ohindex     = currentSvc?.ohindex ?? 0
  const currentOH   = hours.allOH?.[ohindex]
  const currentSlot = currentOH?.openhours?.[activeDay]
  const isDayOpen   = hours.working_dates?.[activeDay] ?? false

  return (
    <Section
      icon={Clock}
      title={t('settings_module.hours_planning')}
      action={<SaveBtn onClick={saveHours} saving={savingHours} />}
    >
      {/* ── Day pills ── */}
      <Label>{t('settings_module.opening_days')}</Label>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8, marginBottom: 24 }}>
        {DAYS.map((day, i) => {
          const open     = hours.working_dates?.[i] ?? false
          const isActive = activeDay === i
          const svcCount = services.filter(s => (s.available_days ?? [0,1,2,3,4,5,6]).includes(i)).length
          return (
            <button
              key={i}
              className="day-pill-pad"
              onClick={() => { setActiveDay(i); setActiveServiceIdx(0) }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = open ? '#3d2d1e' : CREAM }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = open ? DARK : '#fff' }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                background: isActive ? LIGHT_BROWN : open ? DARK : '#fff',
                border: `4px solid ${isActive ? '#a8834e' : DARK}`,
                color: isActive ? DARK : open ? LIGHT_BROWN : DARK,
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {day}
              </span>
              <span className="day-pill-sub" style={{ fontSize: 9, fontWeight: 700, opacity: 0.75 }}>
                {open
                  ? t('settings_module.svc_count', { count: svcCount })
                  : t('settings_module.closed')
                }
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Selected day header + toggle ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 16, fontWeight: 900, color: DARK }}>{DAYS_FULL[activeDay]}</span>
          <span style={{
            fontSize: 11, fontWeight: 800, color: '#ffffff',
            background: isDayOpen ? '#16A34A' : '#DC2626',
            padding: '3px 10px',
            border: `4px solid ${isDayOpen ? '#16A34A' : '#DC2626'}`,
          }}>
            {isDayOpen ? t('settings_module.open') : t('settings_module.closed')}
          </span>
          {isDayOpen && servicesOnActiveDay.length > 0 && (
            <span style={{
              fontSize: 11, fontWeight: 800, color: '#ffffff',
              background: '#e8c87a', padding: '3px 10px', border: '4px solid #e8c87a',
            }}>
              {servicesOnActiveDay.length}{' '}
              {servicesOnActiveDay.length > 1
                ? t('settings_module.services')
                : t('settings_module.service')
              }
            </span>
          )}
        </div>

        <button
          onClick={() => toggleWorkingDay(activeDay)}
          title={isDayOpen ? t('settings_module.mark_closed') : t('settings_module.mark_open')}
          onMouseEnter={e => (e.currentTarget.style.opacity = 0.85)}
          onMouseLeave={e => (e.currentTarget.style.opacity = 1)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', fontSize: 11, fontWeight: 900, borderRadius: 6,
            background: isDayOpen ? '#DC2626' : '#16A34A',
            border: 'none', color: '#fff',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'opacity 0.15s', flexShrink: 0,
          }}
        >
          {isDayOpen
            ? <><X size={14} color="#fff" strokeWidth={2.5} /><span className="toggle-btn-text">{t('settings_module.mark_closed')}</span></>
            : <><Check size={14} color="#fff" strokeWidth={2.5} /><span className="toggle-btn-text">{t('settings_module.mark_open')}</span></>
          }
        </button>
      </div>

      {/* ── Content ── */}
      {!isDayOpen ? (
        <div style={{
          padding: '20px 24px', background: '#ffffff',
          border: '4px solid #DC2626', fontSize: 13, fontWeight: 700, color: '#DC2626',
        }}>
          {t('settings_module.closed_day_msg')}
        </div>
      ) : servicesOnActiveDay.length === 0 ? (
        <div style={{
          padding: '20px 24px', background: '#ffffff',
          border: '4px solid #e8c87a', fontSize: 13, fontWeight: 700, color: LIGHT_BROWN_DK,
        }}>
          {t('settings_module.no_service_on_day', { day: DAYS_FULL[activeDay].toLowerCase() })}
          <br />
          {t('settings_module.configure_services_msg')}
        </div>
      ) : (
        <>
          <Label>{t('settings_module.hours_per_service')}</Label>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8, marginBottom: 16 }}>
            {servicesOnActiveDay.map((svc, i) => (
              <TabBtn key={svc.idx} active={activeService === i} onClick={() => setActiveServiceIdx(i)}>
                {svc.name}
              </TabBtn>
            ))}
          </div>

          {currentSlot && (
            <div style={{
              background: CREAM, border: `4px solid ${DARK}`,
              padding: 'clamp(14px,3vw,24px)',
            }}>
              <div style={{ marginBottom: 10, fontSize: 12, fontWeight: 800, color: LIGHT_BROWN_DK }}>
                {currentSvc?.name ?? t('settings_module.service')} · {DAYS_FULL[activeDay]}
              </div>
              <div className="time-editor" style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div>
                  <Label>{t('settings_module.opening')}</Label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <TimeInput max={23} value={currentSlot.h1} onChange={v => updateDayOH(ohindex, activeDay, 'h1', v)} />
                    <span style={{ fontSize: 18, fontWeight: 900, color: LIGHT_BROWN_DK }}>:</span>
                    <TimeInput max={59} value={currentSlot.m1} onChange={v => updateDayOH(ohindex, activeDay, 'm1', v)} />
                  </div>
                </div>
                <div style={{ paddingBottom: 12, fontSize: 20, color: DARK, fontWeight: 900 }}>→</div>
                <div>
                  <Label>{t('settings_module.closing')}</Label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <TimeInput max={23} value={currentSlot.h2} onChange={v => updateDayOH(ohindex, activeDay, 'h2', v)} />
                    <span style={{ fontSize: 18, fontWeight: 900, color: LIGHT_BROWN_DK }}>:</span>
                    <TimeInput max={59} value={currentSlot.m2} onChange={v => updateDayOH(ohindex, activeDay, 'm2', v)} />
                  </div>
                </div>
                <div>
                  <Label>{t('settings_module.preview')}</Label>
                  <div style={{
                    padding: '10px 16px', background: DARK,
                    fontSize: 14, fontWeight: 900, color: LIGHT_BROWN,
                    letterSpacing: '0.06em', whiteSpace: 'nowrap',
                  }}>
                    {String(currentSlot.h1 ?? 0).padStart(2, '0')}:{String(currentSlot.m1 ?? 0).padStart(2, '0')}
                    {'  '}
                    {String(currentSlot.h2 ?? 0).padStart(2, '0')}:{String(currentSlot.m2 ?? 0).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Section>
  )
}
