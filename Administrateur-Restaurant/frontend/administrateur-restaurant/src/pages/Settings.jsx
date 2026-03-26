import { useState } from 'react'
import { Store, MapPin, Mail, Users, Phone, Clock, Bell, Save, ChevronDown, ChevronUp, Globe, X, Check } from 'lucide-react'
import useRestaurantSettings from '../hooks/useRestaurantSettings'
import FadeUp  from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'
import { useTranslation } from 'react-i18next'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const CREAM   = '#ffffff'
const BORDER  = '#2b2118'

const FR_DAYS      = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
const FR_DAYS_FULL = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']

function Label({ children }) {
  return (
    <p style={{ margin: '0 0 6px', fontSize: 9, fontWeight: 900, color: DARK, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
      {children}
    </p>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text', icon: Icon, disabled, readOnly }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {Icon && <Icon size={14} strokeWidth={2} color={focused ? GOLD : DARK}
        style={{ position: 'absolute', left: 12, flexShrink: 0, transition: 'color 0.15s', pointerEvents: 'none' }} />}
      <input type={type} value={value ?? ''} onChange={e => { if (!readOnly) onChange(e.target.value) }}
        placeholder={placeholder} disabled={disabled} readOnly={readOnly}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: Icon ? '11px 14px 11px 36px' : '11px 14px',
          border: `4px solid ${focused ? GOLD : BORDER}`,
          fontSize: 13, fontWeight: 700, color: DARK,
          fontFamily: 'inherit', outline: 'none',
          background: disabled || readOnly ? CREAM : '#fff',
          borderRadius: 0, transition: 'border-color 0.15s', WebkitAppearance: 'none',
          cursor: readOnly ? 'text' : (disabled ? 'not-allowed' : 'text'),
        }}
      />
    </div>
  )
}

function TimeInput({ value, onChange, max }) {
  return (
    <input type="number" min="0" max={max} value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      style={{
        width: 52, textAlign: 'center',
        border: `4px solid ${BORDER}`, padding: '10px 6px',
        fontSize: 15, fontWeight: 900, color: DARK,
        fontFamily: 'inherit', outline: 'none',
        background: '#fff', borderRadius: 0, WebkitAppearance: 'none',
        transition: 'border-color 0.15s',
      }}
      onFocus={e => e.target.style.borderColor = GOLD}
      onBlur={e => e.target.style.borderColor = BORDER}
    />
  )
}

function SaveBtn({ onClick, saving }) {
  const { t } = useTranslation()
  const [hov, setHov] = useState(false)
  return (
    <>
      <style>{`.save-btn-label { display: inline } @media(max-width:600px){ .save-btn-label { display: none } }`}</style>
      <button onClick={onClick} disabled={saving}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        title={t('settings_module.save_btn')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
          background: saving ? '#3d2d1e' : hov ? GOLD_DK : GOLD,
          border: 'none', color: DARK, fontSize: 11, fontWeight: 900,
          cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
          fontFamily: 'inherit', letterSpacing: '0.05em', textTransform: 'uppercase',
          transition: 'background 0.15s', whiteSpace: 'nowrap', flexShrink: 0,
        }}>
        <Save size={12} strokeWidth={2.5} />
        <span className="save-btn-label">{saving ? t('settings_module.saving') : t('settings_module.save_btn')}</span>
      </button>
    </>
  )
}

function Section({ icon: Icon, title, action, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ background: '#fff', border: `4px solid ${DARK}`, overflow: 'hidden' }}>
      <div onClick={() => setOpen(o => !o)} style={{
        padding: '12px 16px', background: DARK,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer', userSelect: 'none', gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
          {Icon && <Icon size={14} strokeWidth={2.5} color={GOLD} style={{ flexShrink: 0 }} />}
          <span style={{
            fontSize: 11, fontWeight: 900, color: GOLD, letterSpacing: '0.12em',
            textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {action && <div onClick={e => e.stopPropagation()}>{action}</div>}
          {open ? <ChevronUp size={14} strokeWidth={2.5} color={GOLD} /> : <ChevronDown size={14} strokeWidth={2.5} color={GOLD} />}
        </div>
      </div>
      {open && <div style={{ padding: 'clamp(16px,3vw,28px)' }}>{children}</div>}
    </div>
  )
}

function Grid({ children }) {
  return (
    <>
      <style>{`.settings-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(220px,1fr)); gap: 16px; } @media(max-width:500px){ .settings-grid { grid-template-columns: 1fr; gap: 12px; } }`}</style>
      <div className="settings-grid">{children}</div>
    </>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function TabBtn({ active, onClick, children, disabled }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: '9px 16px',
        background: active ? DARK : hov ? CREAM : '#fff',
        border: `4px solid ${active ? DARK : BORDER}`,
        color: active ? GOLD : DARK,
        fontSize: 12, fontWeight: 800,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'inherit', transition: 'all 0.15s',
        opacity: disabled ? 0.4 : 1, whiteSpace: 'nowrap',
      }}>
      {children}
    </button>
  )
}

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

  const DAYS = [
    t('services_module.sun_short', { defaultValue: 'Sun' }),
    t('services_module.mon_short', { defaultValue: 'Mon' }),
    t('services_module.tue_short', { defaultValue: 'Tue' }),
    t('services_module.wed_short', { defaultValue: 'Wed' }),
    t('services_module.thu_short', { defaultValue: 'Thu' }),
    t('services_module.fri_short', { defaultValue: 'Fri' }),
    t('services_module.sat_short', { defaultValue: 'Sat' })
  ]
  const DAYS_FULL = [
    t('services_module.sun_full', { defaultValue: 'Sunday' }),
    t('services_module.mon_full', { defaultValue: 'Monday' }),
    t('services_module.tue_full', { defaultValue: 'Tuesday' }),
    t('services_module.wed_full', { defaultValue: 'Wednesday' }),
    t('services_module.thu_full', { defaultValue: 'Thursday' }),
    t('services_module.fri_full', { defaultValue: 'Friday' }),
    t('services_module.sat_full', { defaultValue: 'Saturday' })
  ]

  if (loading) return (
    <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spinner />
    </div>
  )

  const currentSvc  = servicesOnActiveDay[activeService]
  const ohindex     = currentSvc?.ohindex ?? 0
  const currentOH   = hours.allOH?.[ohindex]
  const currentSlot = currentOH?.openhours?.[activeDay]
  const isDayOpen   = hours.working_dates?.[activeDay] ?? false

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .toggle-btn-text { display: inline; }
        .day-pill-sub    { display: block; }
        .day-pill-pad    { padding: 10px 14px !important; min-width: 58px !important; }
        .time-editor     { gap: 20px; }
        @media (max-width: 600px) {
          .toggle-btn-text { display: none; }
        }
        @media (max-width: 480px) {
          .day-pill-pad  { padding: 8px 6px !important; min-width: 36px !important; }
          .day-pill-sub  { display: none; }
          .time-editor   { gap: 10px; }
        }
      `}</style>

      <div style={{
        minHeight: '100vh', background: CREAM,
        fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
        padding: 'clamp(14px,3vw,40px) clamp(12px,4vw,36px)', width: '100%',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

        <FadeUp delay={0}>
          <h1 style={{ margin: 0, fontSize: 'clamp(20px,5vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
            {t('settings_module.title')}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
          </p>
        </FadeUp>

        <FadeUp delay={10}>
          <div style={{ height: 4, background: DARK, margin: '16px 0 32px' }} />
        </FadeUp>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>

          {/* ══ 1. INFOS ══ */}
          <FadeUp delay={20}>
            <Section icon={Store} title={t('settings_module.restaurant_info')} action={<SaveBtn onClick={saveInfo} saving={savingInfo} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Grid>
                  <Field label={t('settings_module.restaurant_name')}>
                    <TextInput icon={Store} value={info.form_name} onChange={v => setInfoField('form_name', v)} placeholder={t('settings_module.restaurant_name_placeholder')} />
                  </Field>
                  <Field label={t('settings_module.capacity')}>
                    <TextInput icon={Users} value={info.capacity} onChange={v => setInfoField('capacity', v)} placeholder={t('settings_module.capacity_placeholder')} type="number" />
                  </Field>
                </Grid>
                <Field label={t('settings_module.address')}>
                  <TextInput icon={MapPin} value={info.address} onChange={v => setInfoField('address', v)} placeholder={t('settings_module.address_placeholder')} />
                </Field>
                <Grid>
                  <Field label={t('settings_module.google_maps')}>
                    <TextInput icon={MapPin} value={info.google_maps_link} onChange={v => setInfoField('google_maps_link', v)} placeholder={t('settings_module.google_maps_placeholder')} />
                  </Field>
                  <Field label={t('settings_module.website')}>
                    <TextInput icon={Globe} value={info.website} onChange={v => setInfoField('website', v)} placeholder={t('settings_module.website_placeholder')} />
                  </Field>
                </Grid>
                <Grid>
                  <Field label={t('settings_module.phone')}>
                    <TextInput icon={Phone} value={info.phone} onChange={v => setInfoField('phone', v)} placeholder={t('settings_module.phone_placeholder')} type="tel" />
                  </Field>
                  <Field label={t('settings_module.contact_email')}>
                    <TextInput icon={Mail} value={info.contact_email} onChange={v => setInfoField('contact_email', v)} placeholder={t('settings_module.contact_email_placeholder')} type="email" />
                  </Field>
                </Grid>
                <Field label={t('settings_module.description')}>
                  <textarea value={info.description ?? ''} onChange={e => setInfoField('description', e.target.value)}
                    placeholder={t('settings_module.description_placeholder')} rows={3}
                    style={{
                      width: '100%', padding: '11px 14px',
                      border: `4px solid ${BORDER}`, fontSize: 13, fontWeight: 600, color: DARK,
                      fontFamily: 'inherit', outline: 'none', background: '#fff',
                      borderRadius: 0, resize: 'vertical', transition: 'border-color 0.15s',
                    }}
                    onFocus={e => e.target.style.borderColor = GOLD}
                    onBlur={e => e.target.style.borderColor = BORDER}
                  />
                </Field>
              </div>
            </Section>
          </FadeUp>

          {/* ══ 2. PLANNING ══ */}
          <FadeUp delay={30}>
            <Section icon={Clock} title={t('settings_module.hours_planning')} action={<SaveBtn onClick={saveHours} saving={savingHours} />}>

              {/* ── Day pills ── */}
              <Label>{t('settings_module.opening_days')}</Label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8, marginBottom: 24 }}>
                {DAYS.map((day, i) => {
                  const open     = hours.working_dates?.[i] ?? false
                  const isActive = activeDay === i
                  const svcCount = services.filter(s => (s.available_days ?? [0,1,2,3,4,5,6]).includes(i)).length
                  return (
                    <button key={i}
                      className="day-pill-pad"
                      onClick={() => { setActiveDay(i); setActiveServiceIdx(0) }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                        background: isActive ? GOLD : open ? DARK : '#fff',
                        border: `4px solid ${isActive ? GOLD_DK : DARK}`,
                        color: isActive ? DARK : open ? GOLD : DARK,
                        cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = open ? '#3d2d1e' : CREAM }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = open ? DARK : '#fff' }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {day}
                      </span>
                      <span className="day-pill-sub" style={{ fontSize: 9, fontWeight: 700, opacity: 0.75 }}>
                        {open ? t('settings_module.svc_count', { count: svcCount }) : t('settings_module.closed')}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* ── Selected day header + open toggle ── */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: DARK }}>{DAYS_FULL[activeDay]}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 800,
                    color: '#ffffff',
                    background: isDayOpen ? '#16A34A' : '#DC2626',
                    padding: '3px 10px', border: `4px solid ${isDayOpen ? '#16A34A' : '#DC2626'}`,
                  }}>
                    {isDayOpen ? t('settings_module.open') : t('settings_module.closed')}
                  </span>
                  {isDayOpen && servicesOnActiveDay.length > 0 && (
                    <span style={{
                      fontSize: 11, fontWeight: 800, color: '#ffffff',
                      background: '#e8c87a', padding: '3px 10px',
                      border: `4px solid #e8c87a`,
                    }}>
                      {servicesOnActiveDay.length} {servicesOnActiveDay.length > 1 ? t('settings_module.services') : t('settings_module.service')}
                    </span>
                  )}
                </div>

                <button onClick={() => toggleWorkingDay(activeDay)}
                  title={isDayOpen ? t('settings_module.mark_closed') : t('settings_module.mark_open')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', fontSize: 11, fontWeight: 900, borderRadius: 6,
                    background: isDayOpen ? '#DC2626' : '#16A34A',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'opacity 0.15s', flexShrink: 0,
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
                  onMouseLeave={e => e.currentTarget.style.opacity = 1}
                >
                  {isDayOpen
                    ? <><X size={14} color="#fff" strokeWidth={2.5} /><span className="toggle-btn-text">{t('settings_module.mark_closed')}</span></>
                    : <><Check size={14} color="#fff" strokeWidth={2.5} /><span className="toggle-btn-text">{t('settings_module.mark_open')}</span></>
                  }
                </button>
              </div>

              {/* ── Content ── */}
              {!isDayOpen ? (
                <div style={{ padding: '20px 24px', background: '#ffffff', border: `4px solid #DC2626`, fontSize: 13, fontWeight: 700, color: '#DC2626' }}>
                  {t('settings_module.closed_day_msg')}
                </div>
              ) : servicesOnActiveDay.length === 0 ? (
                <div style={{ padding: '20px 24px', background: '#ffffff', border: `4px solid #e8c87a`, fontSize: 13, fontWeight: 700, color: GOLD_DK }}>
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
                    <div style={{ background: CREAM, border: `4px solid ${DARK}`, padding: 'clamp(14px,3vw,24px)' }}>
                      <div style={{ marginBottom: 10, fontSize: 12, fontWeight: 800, color: GOLD_DK }}>
                        {currentSvc?.name ?? t('settings_module.service')} · {DAYS_FULL[activeDay]}
                      </div>
                      <div className="time-editor" style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div>
                          <Label>{t('settings_module.opening')}</Label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <TimeInput max={23} value={currentSlot.h1} onChange={v => updateDayOH(ohindex, activeDay, 'h1', v)} />
                            <span style={{ fontSize: 18, fontWeight: 900, color: GOLD_DK }}>:</span>
                            <TimeInput max={59} value={currentSlot.m1} onChange={v => updateDayOH(ohindex, activeDay, 'm1', v)} />
                          </div>
                        </div>
                        <div style={{ paddingBottom: 12, fontSize: 20, color: DARK, fontWeight: 900 }}>→</div>
                        <div>
                          <Label>{t('settings_module.closing')}</Label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <TimeInput max={23} value={currentSlot.h2} onChange={v => updateDayOH(ohindex, activeDay, 'h2', v)} />
                            <span style={{ fontSize: 18, fontWeight: 900, color: GOLD_DK }}>:</span>
                            <TimeInput max={59} value={currentSlot.m2} onChange={v => updateDayOH(ohindex, activeDay, 'm2', v)} />
                          </div>
                        </div>
                        <div>
                          <Label>{t('settings_module.preview')}</Label>
                          <div style={{ padding: '10px 16px', background: DARK, fontSize: 14, fontWeight: 900, color: GOLD, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                            {String(currentSlot.h1 ?? 0).padStart(2,'0')}:{String(currentSlot.m1 ?? 0).padStart(2,'0')}
                            {' — '}
                            {String(currentSlot.h2 ?? 0).padStart(2,'0')}:{String(currentSlot.m2 ?? 0).padStart(2,'0')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Section>
          </FadeUp>

          {/* ══ 3. NOTIFICATIONS ══ */}
          <FadeUp delay={40}>
            <Section icon={Bell} title={t('settings_module.email_notifications')} defaultOpen={false} action={<SaveBtn onClick={saveNotif} saving={savingNotif} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Grid>
                  <Field label={t('settings_module.sender_name')}>
                    <TextInput readOnly value={notifications.fp_from_name} onChange={v => setNotifField('fp_from_name', v)} placeholder={t('settings_module.sender_name_placeholder')} />
                  </Field>
                  <Field label={t('settings_module.sender_email')}>
                    <TextInput readOnly icon={Mail} value={notifications.fp_from_email} onChange={v => setNotifField('fp_from_email', v)} placeholder={t('settings_module.sender_email_placeholder')} type="email" />
                  </Field>
                </Grid>
                <Field label={t('settings_module.dest_emails')}>
                  <TextInput icon={Mail} value={notifications.fp_destination_emails} onChange={v => setNotifField('fp_destination_emails', v)} placeholder={t('settings_module.dest_emails_placeholder')} />
                </Field>
                <div style={{ height: 4, background: DARK, opacity: 0.08 }} />
                <div>
                  <Label>{t('settings_module.default_status')}</Label>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {['Pending', 'Confirmed'].map(s => (
                      <TabBtn key={s} active={notifications.defaultstatus === s} onClick={() => setNotifField('defaultstatus', s)}>
                        {s === 'Pending' ? t('settings_module.pending') : t('settings_module.confirmed')}
                      </TabBtn>
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          </FadeUp>

        </div>
      </div>
    </>
  )
}