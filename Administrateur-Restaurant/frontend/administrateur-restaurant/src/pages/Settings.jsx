import { useState } from 'react'
import { Store, MapPin, Mail, Users, Phone, Clock, CalendarClock, Bell, Save, ChevronDown, ChevronUp, Globe } from 'lucide-react'
imp
import FadeUp  from '../components/Dashboard/FadeUp'
import Spinner from '../components/Dashboard/Spinner'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const CREAM   = '#faf8f5'
const BORDER  = '#2b2118'
const GREEN   = '#16a34a'
const GREEN_BG= '#f0f7f0'
const RED     = '#b94040'
const RED_BG  = '#fdf0f0'

const FR_DAYS = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']

// ── Primitives ───────────────────────────────────────────────────────────────

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
      {Icon && (
        <Icon size={14} strokeWidth={2} color={focused ? GOLD : DARK}
          style={{ position: 'absolute', left: 12, flexShrink: 0, transition: 'color 0.15s', pointerEvents: 'none' }} />
      )}
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
          borderRadius: 0, transition: 'border-color 0.15s',
          WebkitAppearance: 'none',
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
        border: 'none', color: DARK,
        fontSize: 11, fontWeight: 900,
        cursor: saving ? 'not-allowed' : 'pointer',
        opacity: saving ? 0.7 : 1,
        fontFamily: 'inherit', letterSpacing: '0.05em', textTransform: 'uppercase',
        transition: 'background 0.15s', whiteSpace: 'nowrap',
      }}>
      <Save size={12} strokeWidth={2.5} />
      {saving ? 'Enregistrement…' : 'Enregistrer'}
    </button>
  )
}

function Alert({ type, children }) {
  const isOk = type === 'success'
  return (
    <div style={{
      marginBottom: 16, padding: '10px 14px',
      background: isOk ? GREEN_BG : RED_BG,
      borderLeft: `3px solid ${isOk ? GREEN : RED}`,
      fontSize: 12, fontWeight: 700,
      color: isOk ? GREEN : RED,
    }}>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <div onClick={onChange} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
      <div style={{
        width: 40, height: 22, borderRadius: 11, position: 'relative',
        background: checked ? DARK : '#fff',
        border: `2px solid ${DARK}`,
        transition: 'background 0.2s', flexShrink: 0,
      }}>
        <div style={{
          position: 'absolute', top: 2, left: checked ? 18 : 2,
          width: 14, height: 14, borderRadius: '50%',
          background: checked ? GOLD : DARK,
          transition: 'left 0.2s',
        }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{label}</span>
    </div>
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

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Settings() {
  const {
    loading, error,
    info, hours, notifications, activeOH,
    setInfoField, setNotifField,
    toggleWorkingDay, setActiveService, updateOH,
    saveInfo,  savingInfo,  successInfo,  errorInfo,
    saveHours, savingHours, successHours, errorHours,
    saveNotif, savingNotif, successNotif, errorNotif,
  } = useRestaurantSettings()

  return (
    <>
      <style>{`* { box-sizing: border-box; }`}</style>
      <div style={{
        minHeight: '100vh', background: CREAM,
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding: 'clamp(14px,3vw,40px) clamp(12px,4vw,36px)',
        width: '100%',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* HEADER */}
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

        {error && <Alert type="error">{error}</Alert>}
        {loading ? <Spinner /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>

            {/* ══ 1. INFOS RESTAURANT ══ */}
            <FadeUp delay={20}>
              <Section icon={Store} title="Informations du restaurant" action={<SaveBtn onClick={saveInfo} saving={savingInfo} />}>
                {successInfo && <Alert type="success">✓ Informations enregistrées.</Alert>}
                {errorInfo   && <Alert type="error">{errorInfo}</Alert>}

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

            {/* ══ 2. JOURS D'OUVERTURE ══ */}
            <FadeUp delay={30}>
              <Section icon={CalendarClock} title="Jours d'ouverture" action={<SaveBtn onClick={saveHours} saving={savingHours} />}>
                {successHours && <Alert type="success">✓ Horaires enregistrés.</Alert>}
                {errorHours   && <Alert type="error">{errorHours}</Alert>}

                <Label>Jours d'ouverture</Label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {FR_DAYS.map((day, i) => {
                    const active = hours.working_dates?.[i] ?? false
                    return (
                      <button key={i} onClick={() => toggleWorkingDay(i)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          padding: '10px 14px', minWidth: 58, gap: 4,
                          background: active ? DARK : '#fff',
                          border: `2px solid ${DARK}`,
                          color: active ? GOLD : DARK,
                          cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = CREAM }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = '#fff' }}
                      >
                        <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          {day.slice(0, 3)}
                        </span>
                        <span style={{ fontSize: 9, fontWeight: 700, opacity: active ? 0.8 : 0.5 }}>
                          {active ? 'Ouvert' : 'Fermé'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </Section>
            </FadeUp>

            {/* ══ 3. HORAIRES DE SERVICE ══ */}
            <FadeUp delay={40}>
              <Section icon={Clock} title="Horaires de service" action={<SaveBtn onClick={saveHours} saving={savingHours} />}>
                {/* Service tabs */}
                <Label>Service</Label>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 20, marginTop: 8 }}>
                  {(hours.allOH ?? []).map((oh, i) => (
                    <button key={i} onClick={() => setActiveService(i)}
                      style={{
                        padding: '9px 18px',
                        background: activeOH === i ? DARK : '#fff',
                        border: `2px solid ${DARK}`,
                        color: activeOH === i ? GOLD : DARK,
                        fontSize: 12, fontWeight: 800,
                        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (activeOH !== i) e.currentTarget.style.background = CREAM }}
                      onMouseLeave={e => { if (activeOH !== i) e.currentTarget.style.background = '#fff' }}
                    >
                      {oh.name}
                    </button>
                  ))}
                </div>

                {hours.allOH?.[activeOH] && (
                  <div style={{ background: CREAM, border: `2px solid ${DARK}`, padding: 'clamp(14px,3vw,24px)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
                      <div>
                        <Label>Ouverture</Label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <TimeInput max={23} value={hours.allOH[activeOH].openhours[0]?.h1} onChange={v => updateOH(activeOH, 'h1', v)} />
                          <span style={{ fontSize: 18, fontWeight: 900, color: GOLD_DK }}>:</span>
                          <TimeInput max={59} value={hours.allOH[activeOH].openhours[0]?.m1} onChange={v => updateOH(activeOH, 'm1', v)} />
                        </div>
                      </div>

                      <div style={{ paddingBottom: 12, fontSize: 20, color: DARK, fontWeight: 900 }}>→</div>

                      <div>
                        <Label>Fermeture</Label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <TimeInput max={23} value={hours.allOH[activeOH].openhours[0]?.h2} onChange={v => updateOH(activeOH, 'h2', v)} />
                          <span style={{ fontSize: 18, fontWeight: 900, color: GOLD_DK }}>:</span>
                          <TimeInput max={59} value={hours.allOH[activeOH].openhours[0]?.m2} onChange={v => updateOH(activeOH, 'm2', v)} />
                        </div>
                      </div>

                      <div>
                        <Label>Aperçu</Label>
                        <div style={{ padding: '10px 16px', background: DARK, fontSize: 14, fontWeight: 900, color: GOLD, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                          {String(hours.allOH[activeOH].openhours[0]?.h1 ?? 0).padStart(2,'0')}:
                          {String(hours.allOH[activeOH].openhours[0]?.m1 ?? 0).padStart(2,'0')}
                          {' — '}
                          {String(hours.allOH[activeOH].openhours[0]?.h2 ?? 0).padStart(2,'0')}:
                          {String(hours.allOH[activeOH].openhours[0]?.m2 ?? 0).padStart(2,'0')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Section>
            </FadeUp>

            {/* ══ 4. NOTIFICATIONS ══ */}
            <FadeUp delay={50}>
              <Section icon={Bell} title="Notifications par email" defaultOpen={false} action={<SaveBtn onClick={saveNotif} saving={savingNotif} />}>
                {successNotif && <Alert type="success">✓ Notifications enregistrées.</Alert>}
                {errorNotif   && <Alert type="error">{errorNotif}</Alert>}

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
                        <button key={s} onClick={() => setNotifField('defaultstatus', s)}
                          style={{
                            padding: '9px 18px',
                            background: notifications.defaultstatus === s ? DARK : '#fff',
                            border: `2px solid ${DARK}`,
                            color: notifications.defaultstatus === s ? GOLD : DARK,
                            fontSize: 12, fontWeight: 800,
                            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                          }}>
                          {s === 'Pending' ? 'En attente' : 'Confirmée'}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </Section>
            </FadeUp>

          </div>
        )}
      </div>
    </>
  )
}