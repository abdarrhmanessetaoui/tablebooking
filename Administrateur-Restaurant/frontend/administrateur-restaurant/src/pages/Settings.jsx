import { useState } from 'react'
import { Store, MapPin, Mail, Users, Phone, Clock, Bell, Save, ChevronDown, ChevronUp, Globe } from 'lucide-react'
import useRestaurantSettings from '../hooks/useRestaurantSettings'
import FadeUp  from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const CREAM   = '#faf8f5'
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

function TextInput({ value, onChange, placeholder, type = 'text', icon: Icon, disabled }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {Icon && <Icon size={14} strokeWidth={2} color={focused ? GOLD : DARK}
        style={{ position: 'absolute', left: 12, flexShrink: 0, transition: 'color 0.15s', pointerEvents: 'none' }} />}
      <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: Icon ? '11px 14px 11px 36px' : '11px 14px',
          border: `2px solid ${focused ? GOLD : BORDER}`,
          fontSize: 13, fontWeight: 700, color: DARK,
          fontFamily: 'inherit', outline: 'none',
          background: disabled ? CREAM : '#fff',
          borderRadius: 0, transition: 'border-color 0.15s', WebkitAppearance: 'none',
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
        border: `2px solid ${BORDER}`, padding: '10px 6px',
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
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} disabled={saving}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px',
        background: saving ? '#3d2d1e' : hov ? GOLD_DK : GOLD,
        border: 'none', color: DARK, fontSize: 11, fontWeight: 900,
        cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
        fontFamily: 'inherit', letterSpacing: '0.05em', textTransform: 'uppercase',
        transition: 'background 0.15s', whiteSpace: 'nowrap',
      }}>
      <Save size={12} strokeWidth={2.5} />
      {saving ? 'Enregistrement…' : 'Enregistrer'}
    </button>
  )
}

function Section({ icon: Icon, title, action, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ background: '#fff', border: `2px solid ${DARK}`, overflow: 'hidden' }}>
      <div onClick={() => setOpen(o => !o)} style={{
        padding: '12px 16px', background: DARK,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer', userSelect: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {Icon && <Icon size={14} strokeWidth={2.5} color={GOLD} />}
          <span style={{ fontSize: 11, fontWeight: 900, color: GOLD, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
      {children}
    </div>
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
        border: `2px solid ${active ? DARK : BORDER}`,
        color: active ? GOLD : DARK,
        fontSize: 12, fontWeight: 800,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'inherit', transition: 'all 0.15s',
        opacity: disabled ? 0.4 : 1,
      }}>
      {children}
    </button>
  )
}

export default function Settings() {
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

  // Use only services available on the active day
  const currentSvc  = servicesOnActiveDay[activeService]
  const ohindex     = currentSvc?.ohindex ?? 0
  const currentOH   = hours.allOH?.[ohindex]
  const currentSlot = currentOH?.openhours?.[activeDay]
  const isDayOpen   = hours.working_dates?.[activeDay] ?? false

  return (
    <>
      <style>{`* { box-sizing: border-box; }`}</style>
      <div style={{
        minHeight: '100vh', background: CREAM,
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding: 'clamp(14px,3vw,40px) clamp(12px,4vw,36px)', width: '100%',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

        <FadeUp delay={0}>
          <h1 style={{ margin: 0, fontSize: 'clamp(20px,5vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
            Paramètres
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
            Restaurant · Horaires · Notifications
          </p>
        </FadeUp>

        <FadeUp delay={10}>
          <div style={{ height: 2, background: DARK, margin: '16px 0 32px' }} />
        </FadeUp>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>

          {/* ══ 1. INFOS ══ */}
          <FadeUp delay={20}>
            <Section icon={Store} title="Informations du restaurant" action={<SaveBtn onClick={saveInfo} saving={savingInfo} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Grid>
                  <Field label="Nom du restaurant">
                    <TextInput icon={Store} value={info.form_name} onChange={v => setInfoField('form_name', v)} placeholder="Ex: Dal Corso - Marrakech" />
                  </Field>
                  <Field label="Capacité (couverts)">
                    <TextInput icon={Users} value={info.capacity} onChange={v => setInfoField('capacity', v)} placeholder="Ex: 60" type="number" />
                  </Field>
                </Grid>
                <Field label="Adresse">
                  <TextInput icon={MapPin} value={info.address} onChange={v => setInfoField('address', v)} placeholder="Ex: 12 Rue de la Liberté, Guéliz, Marrakech" />
                </Field>
                <Grid>
                  <Field label="Lien Google Maps">
                    <TextInput icon={MapPin} value={info.google_maps_link} onChange={v => setInfoField('google_maps_link', v)} placeholder="https://maps.google.com/…" />
                  </Field>
                  <Field label="Site web">
                    <TextInput icon={Globe} value={info.website} onChange={v => setInfoField('website', v)} placeholder="https://monrestaurant.ma" />
                  </Field>
                </Grid>
                <Grid>
                  <Field label="Téléphone">
                    <TextInput icon={Phone} value={info.phone} onChange={v => setInfoField('phone', v)} placeholder="+212 6XX XXX XXX" type="tel" />
                  </Field>
                  <Field label="Email de contact">
                    <TextInput icon={Mail} value={info.contact_email} onChange={v => setInfoField('contact_email', v)} placeholder="contact@monrestaurant.ma" type="email" />
                  </Field>
                </Grid>
                <Field label="Description courte">
                  <textarea value={info.description ?? ''} onChange={e => setInfoField('description', e.target.value)}
                    placeholder="Quelques mots sur votre restaurant…" rows={3}
                    style={{
                      width: '100%', padding: '11px 14px',
                      border: `2px solid ${BORDER}`, fontSize: 13, fontWeight: 600, color: DARK,
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
            <Section icon={Clock} title="Jours & Horaires" action={<SaveBtn onClick={saveHours} saving={savingHours} />}>

              {/* ── Day pills ── */}
              <Label>Jours d'ouverture</Label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8, marginBottom: 24 }}>
                {FR_DAYS.map((day, i) => {
                  const open     = hours.working_dates?.[i] ?? false
                  const isActive = activeDay === i
                  const svcCount = services.filter(s => (s.available_days ?? [0,1,2,3,4,5,6]).includes(i)).length
                  return (
                    <button key={i}
                      onClick={() => { setActiveDay(i); setActiveServiceIdx(0) }}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        padding: '10px 14px', minWidth: 58, gap: 3,
                        background: isActive ? GOLD : open ? DARK : '#fff',
                        border: `2px solid ${isActive ? GOLD_DK : DARK}`,
                        color: isActive ? DARK : open ? GOLD : DARK,
                        cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = open ? '#3d2d1e' : CREAM }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = open ? DARK : '#fff' }}
                    >
                      <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {day}
                      </span>
                      <span style={{ fontSize: 9, fontWeight: 700, opacity: 0.75 }}>
                        {open ? `${svcCount} svc` : 'Fermé'}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* ── Selected day header + open toggle ── */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 16, fontWeight: 900, color: DARK }}>{FR_DAYS_FULL[activeDay]}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 800,
                    color: isDayOpen ? '#16a34a' : '#b94040',
                    background: isDayOpen ? '#f0f7f0' : '#fdf0f0',
                    padding: '3px 10px', border: `1.5px solid ${isDayOpen ? '#16a34a' : '#b94040'}`,
                  }}>
                    {isDayOpen ? 'Ouvert' : 'Fermé'}
                  </span>
                  {isDayOpen && servicesOnActiveDay.length > 0 && (
                    <span style={{
                      fontSize: 11, fontWeight: 800, color: GOLD_DK,
                      background: '#fdf6ec', padding: '3px 10px',
                      border: `1.5px solid #e8c87a`,
                    }}>
                      {servicesOnActiveDay.length} service{servicesOnActiveDay.length > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <button onClick={() => toggleWorkingDay(activeDay)}
                  style={{
                    padding: '8px 16px', fontSize: 11, fontWeight: 900,
                    background: isDayOpen ? '#fdf0f0' : '#f0f7f0',
                    border: `2px solid ${isDayOpen ? '#b94040' : '#16a34a'}`,
                    color: isDayOpen ? '#b94040' : '#16a34a',
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                  }}>
                  {isDayOpen ? '✕ Marquer Fermé' : '✓ Marquer Ouvert'}
                </button>
              </div>

              {/* ── Content depending on day state ── */}
              {!isDayOpen ? (
                <div style={{ padding: '20px 24px', background: '#fdf0f0', border: `2px solid #fecaca`, fontSize: 13, fontWeight: 700, color: '#b94040' }}>
                  Ce jour est marqué comme fermé — aucun horaire à configurer.
                </div>
              ) : servicesOnActiveDay.length === 0 ? (
                <div style={{ padding: '20px 24px', background: '#fdf6ec', border: `2px solid #e8c87a`, fontSize: 13, fontWeight: 700, color: GOLD_DK }}>
                  Aucun service n'est disponible le {FR_DAYS_FULL[activeDay].toLowerCase()}.
                  Configurez les jours disponibles depuis la page <strong>Services</strong>.
                </div>
              ) : (
                <>
                  {/* Service tabs — only services for this day */}
                  <Label>Horaires par service</Label>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8, marginBottom: 16 }}>
                    {servicesOnActiveDay.map((svc, i) => (
                      <TabBtn key={svc.idx} active={activeService === i} onClick={() => setActiveServiceIdx(i)}>
                        {svc.name}
                      </TabBtn>
                    ))}
                  </div>

                  {/* Time editor */}
                  {currentSlot ? (
                    <div style={{ background: CREAM, border: `2px solid ${DARK}`, padding: 'clamp(14px,3vw,24px)' }}>
                      <div style={{ marginBottom: 10, fontSize: 12, fontWeight: 800, color: GOLD_DK }}>
                        {currentSvc?.name ?? 'Service'} · {FR_DAYS_FULL[activeDay]}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
                        <div>
                          <Label>Ouverture</Label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <TimeInput max={23} value={currentSlot.h1} onChange={v => updateDayOH(ohindex, activeDay, 'h1', v)} />
                            <span style={{ fontSize: 18, fontWeight: 900, color: GOLD_DK }}>:</span>
                            <TimeInput max={59} value={currentSlot.m1} onChange={v => updateDayOH(ohindex, activeDay, 'm1', v)} />
                          </div>
                        </div>
                        <div style={{ paddingBottom: 12, fontSize: 20, color: DARK, fontWeight: 900 }}>→</div>
                        <div>
                          <Label>Fermeture</Label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <TimeInput max={23} value={currentSlot.h2} onChange={v => updateDayOH(ohindex, activeDay, 'h2', v)} />
                            <span style={{ fontSize: 18, fontWeight: 900, color: GOLD_DK }}>:</span>
                            <TimeInput max={59} value={currentSlot.m2} onChange={v => updateDayOH(ohindex, activeDay, 'm2', v)} />
                          </div>
                        </div>
                        <div>
                          <Label>Aperçu</Label>
                          <div style={{ padding: '10px 16px', background: DARK, fontSize: 14, fontWeight: 900, color: GOLD, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                            {String(currentSlot.h1 ?? 0).padStart(2,'0')}:{String(currentSlot.m1 ?? 0).padStart(2,'0')}
                            {' — '}
                            {String(currentSlot.h2 ?? 0).padStart(2,'0')}:{String(currentSlot.m2 ?? 0).padStart(2,'0')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </>
              )}

            </Section>
          </FadeUp>

          {/* ══ 3. NOTIFICATIONS ══ */}
          <FadeUp delay={40}>
            <Section icon={Bell} title="Notifications par email" defaultOpen={false} action={<SaveBtn onClick={saveNotif} saving={savingNotif} />}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Grid>
                  <Field label="Nom expéditeur">
                    <TextInput value={notifications.fp_from_name} onChange={v => setNotifField('fp_from_name', v)} placeholder="TableBooking.ma" />
                  </Field>
                  <Field label="Email expéditeur">
                    <TextInput icon={Mail} value={notifications.fp_from_email} onChange={v => setNotifField('fp_from_email', v)} placeholder="reservation@tablebooking.ma" type="email" />
                  </Field>
                </Grid>
                <Field label="Emails destinataires (séparés par des virgules)">
                  <TextInput icon={Mail} value={notifications.fp_destination_emails} onChange={v => setNotifField('fp_destination_emails', v)} placeholder="manager@resto.ma, chef@resto.ma" />
                </Field>
                <div style={{ height: 2, background: DARK, opacity: 0.08 }} />
                <div>
                  <Label>Statut par défaut des nouvelles réservations</Label>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    {['Pending', 'Confirmed'].map(s => (
                      <TabBtn key={s} active={notifications.defaultstatus === s} onClick={() => setNotifField('defaultstatus', s)}>
                        {s === 'Pending' ? 'En attente' : 'Confirmée'}
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