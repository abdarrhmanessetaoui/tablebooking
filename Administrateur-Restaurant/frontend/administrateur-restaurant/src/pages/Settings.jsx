import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import useRestaurantSettings from '../hooks/settings/useRestaurantSettings.js'
import FadeUp  from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'
import { useTranslation } from 'react-i18next'
import {
  page, header, headerLeft, h1, divider, errorBanner
} from '../styles/dashboard/dashboard.styles'
import {
  DARK, LIGHT_BROWN, DARK_LIGHT, WHITE, BORDER, RADIUS, FONT_URL
} from '../styles/dashboard/tokens'

function Label({ children }) {
  return (
    <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: '900', color: DARK, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
      {children}
    </p>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text', icon: Icon, disabled, readOnly }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input type={type} value={value ?? ''} onChange={e => { if (!readOnly) onChange(e.target.value) }}
        placeholder={placeholder} disabled={disabled} readOnly={readOnly}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '12px 16px',
          borderWidth: 1, borderStyle: 'solid', borderColor: BORDER,
          borderRadius: RADIUS.sm,
          fontSize: '13px', fontWeight: '800', color: DARK,
          fontFamily: 'inherit', outline: 'none',
          background: disabled || readOnly ? '#FAF7F4' : WHITE,
          cursor: readOnly ? 'text' : (disabled ? 'not-allowed' : 'text'),
          boxShadow: 'none',
          transition: 'none',
        }}
        onFocus={e => !readOnly && !disabled && (e.target.style.borderColor = LIGHT_BROWN)}
        onBlur={e => e.target.style.borderColor = BORDER}
      />
    </div>
  )
}

function TimeInput({ value, onChange, max }) {
  return (
    <input type="number" min="0" max={max} value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      style={{
        width: 60, textAlign: 'center',
        borderWidth: 1, borderStyle: 'solid', borderColor: BORDER,
        padding: '10px 6px',
        borderRadius: RADIUS.sm,
        fontSize: '15px', fontWeight: '900', color: DARK,
        fontFamily: 'inherit', outline: 'none',
        background: WHITE,
        boxShadow: 'none',
        transition: 'none',
      }}
      onFocus={e => e.target.style.borderColor = LIGHT_BROWN}
      onBlur={e => e.target.style.borderColor = BORDER}
    />
  )
}

function SaveBtn({ onClick, saving }) {
  const { t } = useTranslation()
  return (
    <button onClick={onClick} disabled={saving}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
        background: LIGHT_BROWN,
        borderRadius: RADIUS.sm,
        border: 'none', color: WHITE, fontSize: '12px', fontWeight: '900',
        cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
        whiteSpace: 'nowrap',
        transition: 'none',
        boxShadow: 'none',
      }}
    >
      <span className="save-btn-label">{saving ? t('settings_module.saving') : t('settings_module.save_btn')}</span>
    </button>
  )
}

function Section({ title, action, children }) {
  return (
    <div style={{
      background: WHITE,
      borderRadius: RADIUS.sm,
      border: `1px solid ${BORDER}`,
      overflow: 'hidden',
      boxShadow: 'none',
    }}>
      <div style={{
        padding: '16px 24px',
        background: WHITE,
        borderBottom: `1px solid ${BORDER}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        userSelect: 'none', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
          <span style={{
            fontSize: '15px', fontWeight: '900', color: DARK,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {action && <div onClick={e => e.stopPropagation()}>{action}</div>}
        </div>
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  )
}

function Grid({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function TabBtn({ active, onClick, children, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        padding: '8px 16px',
        background: active ? DARK : WHITE,
        border: `1px solid ${active ? DARK : BORDER}`,
        borderRadius: RADIUS.sm,
        color: active ? WHITE : DARK,
        fontSize: '12px', fontWeight: '900',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1, whiteSpace: 'nowrap',
        transition: 'none',
        boxShadow: 'none',
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

  useEffect(() => { if (!loading) window.dispatchEvent(new CustomEvent("app-ready")) }, [loading]); if (loading) return <Spinner fullPage />

  const currentSvc  = servicesOnActiveDay[activeService]
  const ohindex     = currentSvc?.ohindex ?? 0
  const currentOH   = hours.allOH?.[ohindex]
  const currentSlot = currentOH?.openhours?.[activeDay]
  const isDayOpen   = hours.working_dates?.[activeDay] ?? false

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .save-btn-label { display: none !important; }
        }
      `}</style>

      <div style={page}>
        <FadeUp delay={0}>
          <div style={header}>
            <div style={headerLeft}>
              <h1 style={h1}>{t('settings_module.title')}</h1>
            </div>
          </div>
        </FadeUp>

        <div style={divider} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1000 }}>

          {/* ══ 1. INFOS ══ */}
          <FadeUp delay={10}>
            <Section title={t('settings_module.restaurant_info')} action={<SaveBtn onClick={saveInfo} saving={savingInfo} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Grid>
                  <Field label={t('settings_module.restaurant_name')}>
                    <TextInput value={info.form_name} onChange={v => setInfoField('form_name', v)} placeholder={t('settings_module.restaurant_name_placeholder')} />
                  </Field>
                  <Field label={t('settings_module.capacity')}>
                    <TextInput value={info.capacity} onChange={v => setInfoField('capacity', v)} placeholder={t('settings_module.capacity_placeholder')} type="number" />
                  </Field>
                </Grid>
                <Field label={t('settings_module.address')}>
                  <TextInput value={info.address} onChange={v => setInfoField('address', v)} placeholder={t('settings_module.address_placeholder')} />
                </Field>
                <Grid>
                  <Field label={t('settings_module.google_maps')}>
                    <TextInput value={info.google_maps_link} onChange={v => setInfoField('google_maps_link', v)} placeholder={t('settings_module.google_maps_placeholder')} />
                  </Field>
                  <Field label={t('settings_module.website')}>
                    <TextInput value={info.website} onChange={v => setInfoField('website', v)} placeholder={t('settings_module.website_placeholder')} />
                  </Field>
                </Grid>
                <Grid>
                  <Field label={t('settings_module.phone')}>
                    <TextInput value={info.phone} onChange={v => setInfoField('phone', v)} placeholder={t('settings_module.phone_placeholder')} type="tel" />
                  </Field>
                  <Field label={t('settings_module.contact_email')}>
                    <TextInput value={info.contact_email} onChange={v => setInfoField('contact_email', v)} placeholder={t('settings_module.contact_email_placeholder')} type="email" />
                  </Field>
                </Grid>
                <Field label={t('settings_module.description')}>
                  <textarea value={info.description ?? ''} onChange={e => setInfoField('description', e.target.value)}
                    placeholder={t('settings_module.description_placeholder')} rows={4}
                    style={{
                      width: '100%', padding: '12px 16px',
                      borderWidth: 1, borderStyle: 'solid', borderColor: BORDER, borderRadius: RADIUS.sm,
                      fontSize: '13px', fontWeight: '800', color: DARK,
                      fontFamily: 'inherit', outline: 'none', background: WHITE,
                      resize: 'vertical',
                      boxShadow: 'none',
                      transition: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = LIGHT_BROWN}
                    onBlur={e => e.target.style.borderColor = BORDER}
                  />
                </Field>
              </div>
            </Section>
          </FadeUp>

          {/* ══ 2. PLANNING ══ */}
          <FadeUp delay={10}>
            <Section title={t('settings_module.hours_planning')} action={<SaveBtn onClick={saveHours} saving={savingHours} />}>
              <Label>{t('settings_module.opening_days')}</Label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))', gap: 8, marginTop: 4, marginBottom: 24 }}>
                {DAYS.map((day, i) => {
                  const isOpen   = hours.working_dates?.[i] ?? false
                  const isActive = activeDay === i
                  return (
                    <button key={i}
                      onClick={() => { setActiveDay(i); setActiveServiceIdx(0) }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        padding: '12px 8px',
                        background: isActive ? DARK : WHITE,
                        border: `1px solid ${isActive ? DARK : BORDER}`,
                        borderRadius: RADIUS.sm,
                        color: isActive ? WHITE : DARK,
                        cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'none',
                        boxShadow: 'none',
                      }}
                    >
                      <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>{day}</span>
                    </button>
                  )
                })}
              </div>

              <div style={{
                background: WHITE, border: `1px solid ${BORDER}`, borderRadius: RADIUS.sm, padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: DARK }}>{DAYS_FULL[activeDay]}</h3>
                    <span style={{
                      fontSize: '10px', fontWeight: '900', color: WHITE,
                      background: isDayOpen ? '#22C55E' : RED,
                      padding: '4px 12px', borderRadius: '4px',
                      letterSpacing: '0.04em', textTransform: 'uppercase'
                    }}>
                      {isDayOpen ? t('settings_module.open') : t('settings_module.closed')}
                    </span>
                  </div>

                  <button onClick={() => toggleWorkingDay(activeDay)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', fontSize: '12px', fontWeight: '900', borderRadius: RADIUS.sm,
                      background: isDayOpen ? RED : '#22C55E',
                      border: 'none',
                      color: WHITE,
                      cursor: 'pointer',
                      transition: 'none',
                    }}
                  >
                    {isDayOpen ? <><X size={14} strokeWidth={2.5} /> {t('settings_module.mark_closed')}</> : <><Check size={14} strokeWidth={2.5} /> {t('settings_module.mark_open')}</>}
                  </button>
                </div>

                {isDayOpen && servicesOnActiveDay.length > 0 ? (
                  <>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                      {servicesOnActiveDay.map((svc, i) => (
                        <TabBtn key={svc.idx} active={activeService === i} onClick={() => setActiveServiceIdx(i)}>
                          {svc.name}
                        </TabBtn>
                      ))}
                    </div>

                    {currentSlot && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, alignItems: 'end' }}>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <Field label={t('settings_module.opening')}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <TimeInput max={23} value={currentSlot.h1} onChange={v => updateDayOH(ohindex, activeDay, 'h1', v)} />
                              <span style={{ fontWeight: '900', color: DARK }}>:</span>
                              <TimeInput max={59} value={currentSlot.m1} onChange={v => updateDayOH(ohindex, activeDay, 'm1', v)} />
                            </div>
                          </Field>
                          <div style={{ paddingBottom: 12, alignSelf: 'end', color: LIGHT_BROWN }}>
                            <ArrowRight size={22} />
                          </div>
                          <Field label={t('settings_module.closing')}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <TimeInput max={23} value={currentSlot.h2} onChange={v => updateDayOH(ohindex, activeDay, 'h2', v)} />
                              <span style={{ fontWeight: '900', color: DARK }}>:</span>
                              <TimeInput max={59} value={currentSlot.m2} onChange={v => updateDayOH(ohindex, activeDay, 'm2', v)} />
                            </div>
                          </Field>
                        </div>
                        <div style={{
                          background: DARK, borderRadius: RADIUS.sm, padding: '12px 20px',
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                          <span style={{ color: LIGHT_BROWN, fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>{t('settings_module.preview')}</span>
                          <span style={{ color: WHITE, fontSize: '18px', fontWeight: '900' }}>
                            {String(currentSlot.h1 ?? 0).padStart(2,'0')}:{String(currentSlot.m1 ?? 0).padStart(2,'0')} - {String(currentSlot.h2 ?? 0).padStart(2,'0')}:{String(currentSlot.m2 ?? 0).padStart(2,'0')}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{
                    padding: '40px 24px', textAlign: 'center', background: '#FAF7F4',
                    borderRadius: RADIUS.sm, border: `1px solid ${BORDER}`, color: DARK, fontSize: '14px', fontWeight: '800'
                  }}>
                    {isDayOpen ? t('settings_module.no_service_on_day', { day: DAYS_FULL[activeDay] }) : t('settings_module.closed_day_msg')}
                  </div>
                )}
              </div>
            </Section>
          </FadeUp>

          {/* ══ 3. NOTIFICATIONS ══ */}
          <FadeUp delay={20}>
            <Section title={t('settings_module.email_notifications')} defaultOpen={false} action={<SaveBtn onClick={saveNotif} saving={savingNotif} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Grid>
                  <Field label={t('settings_module.sender_name')}>
                    <TextInput readOnly value={notifications.fp_from_name} onChange={v => setNotifField('fp_from_name', v)} placeholder={t('settings_module.sender_name_placeholder')} />
                  </Field>
                  <Field label={t('settings_module.sender_email')}>
                    <TextInput readOnly value={notifications.fp_from_email} onChange={v => setNotifField('fp_from_email', v)} placeholder={t('settings_module.sender_email_placeholder')} type="email" />
                  </Field>
                </Grid>
                <Field label={t('settings_module.dest_emails')}>
                  <TextInput value={notifications.fp_destination_emails} onChange={v => setNotifField('fp_destination_emails', v)} placeholder={t('settings_module.dest_emails_placeholder')} />
                </Field>
                <div style={{ height: 1, background: BORDER }} />
                <div>
                  <Label>{t('settings_module.default_status')}</Label>
                  <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
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
    </div>
  )
}

function ArrowRight({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  )
}

const RED = '#EF4444'
