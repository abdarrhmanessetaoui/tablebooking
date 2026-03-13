import { useState } from 'react'
import { CalendarClock, Save, Store, Mail, MapPin, Clock, Users, Bell, ChevronDown, ChevronUp } from 'lucide-react'
import useTimeSlots from '../hooks/useTimeSlots'
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

// ── Shared primitives ────────────────────────────────────────────────────────

function Label({ children }) {
  return (
    <p style={{ margin: '0 0 6px', fontSize: 9, fontWeight: 900, color: DARK, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
      {children}
    </p>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text', icon: Icon }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {Icon && (
        <Icon size={14} strokeWidth={2} color={focused ? GOLD : DARK}
          style={{ position: 'absolute', left: 12, flexShrink: 0, transition: 'color 0.15s', pointerEvents: 'none' }} />
      )}
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: Icon ? '11px 14px 11px 36px' : '11px 14px',
          border: `2px solid ${focused ? GOLD : BORDER}`,
          fontSize: 13, fontWeight: 700, color: DARK,
          fontFamily: 'inherit', outline: 'none', background: '#fff',
          borderRadius: 0, transition: 'border-color 0.15s',
          WebkitAppearance: 'none',
        }}
      />
    </div>
  )
}

function TimeInput({ value, onChange, max }) {
  return (
    <input
      type="number" min="0" max={max}
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      style={{
        width: 52, textAlign: 'center',
        border: `2px solid ${BORDER}`,
        padding: '10px 6px',
        fontSize: 15, fontWeight: 900, color: DARK,
        fontFamily: 'inherit', outline: 'none',
        background: '#fff', borderRadius: 0,
        WebkitAppearance: 'none',
        transition: 'border-color 0.15s',
      }}
      onFocus={e => e.target.style.borderColor = GOLD}
      onBlur={e => e.target.style.borderColor = BORDER}
    />
  )
}

function SaveBtn({ onClick, saving, label = 'Enregistrer' }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} disabled={saving}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '8px 16px',
        background: saving ? '#3d2d1e' : hov ? GOLD_DK : GOLD,
        border: 'none', color: DARK,
        fontSize: 11, fontWeight: 900,
        cursor: saving ? 'not-allowed' : 'pointer',
        opacity: saving ? 0.7 : 1,
        fontFamily: 'inherit', letterSpacing: '0.05em', textTransform: 'uppercase',
        transition: 'background 0.15s', whiteSpace: 'nowrap',
      }}>
      <Save size={12} strokeWidth={2.5} />
      {saving ? 'Enregistrement…' : label}
    </button>
  )
}

// ── Section card (same border style as BlockedDates) ────────────────────────
function Section({ icon: Icon, title, action, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ background: '#fff', border: `2px solid ${DARK}`, overflow: 'hidden' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
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
          {open
            ? <ChevronUp size={14} strokeWidth={2.5} color={GOLD} />
            : <ChevronDown size={14} strokeWidth={2.5} color={GOLD} />
          }
        </div>
      </div>
      {open && (
        <div style={{ padding: 'clamp(16px,3vw,28px)' }}>
          {children}
        </div>
      )}
    </div>
  )
}

function FieldRow({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16 }}>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function Settings() {
  const {
    allOH, workingDates, activeOH, setActiveOH,
    loading, saving, error, success,
    updateOH, toggleWorkingDay, handleSave,
    DAYS,
  } = useTimeSlots()

  // Restaurant info state (saved separately via /api/restaurant-info or similar)
  const [info, setInfo] = useState({
    name:        '',
    address:     '',
    phone:       '',
    email:       '',
    description: '',
    capacity:    '',
    website:     '',
    maps_link:   '',
  })
  const [infoSaving, setInfoSaving]   = useState(false)
  const [infoSuccess, setInfoSuccess] = useState(false)
  const [infoError,   setInfoError]   = useState('')

  // Notification prefs state
  const [notif, setNotif] = useState({
    email_new:      true,
    email_confirm:  true,
    email_cancel:   true,
    dest_emails:    '',
    from_name:      'TableBooking.ma',
    from_email:     'reservation@tablebooking.ma',
  })
  const [notifSaving,  setNotifSaving]  = useState(false)
  const [notifSuccess, setNotifSuccess] = useState(false)
  const [notifError,   setNotifError]   = useState('')

  // French day names
  const FR_DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

  async function saveInfo() {
    setInfoSaving(true); setInfoError(''); setInfoSuccess(false)
    try {
      const res = await fetch('http://localhost:8000/api/restaurant/info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(info),
      })
      if (!res.ok) throw new Error()
      setInfoSuccess(true)
      setTimeout(() => setInfoSuccess(false), 3000)
    } catch { setInfoError('Impossible d\'enregistrer.') }
    finally { setInfoSaving(false) }
  }

  async function saveNotif() {
    setNotifSaving(true); setNotifError(''); setNotifSuccess(false)
    try {
      const res = await fetch('http://localhost:8000/api/restaurant/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(notif),
      })
      if (!res.ok) throw new Error()
      setNotifSuccess(true)
      setTimeout(() => setNotifSuccess(false), 3000)
    } catch { setNotifError('Impossible d\'enregistrer.') }
    finally { setNotifSaving(false) }
  }

  function Toggle({ checked, onChange, label }) {
    return (
      <div
        onClick={onChange}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
        <div style={{
          width: 40, height: 22, borderRadius: 11, position: 'relative',
          background: checked ? DARK : CREAM,
          border: `2px solid ${DARK}`,
          transition: 'background 0.2s', flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', top: 2,
            left: checked ? 18 : 2,
            width: 14, height: 14, borderRadius: '50%',
            background: checked ? GOLD : DARK,
            transition: 'left 0.2s',
          }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{label}</span>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @media (max-width: 480px) { .page-subtitle { display: none !important; } }
        @media (max-width: 600px) { .notif-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      <div style={{
        minHeight: '100vh', background: CREAM,
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
        padding: 'clamp(14px,3vw,40px) clamp(12px,4vw,36px)',
        boxSizing: 'border-box', width: '100%',
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

        {/* ── Header ── */}
        <FadeUp delay={0}>
          <div style={{ marginBottom: 8 }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(20px,5vw,36px)', fontWeight: 900, color: DARK, letterSpacing: '-1.5px', lineHeight: 1 }}>
              Paramètres
            </h1>
            <p className="page-subtitle" style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DK }}>
              Restaurant · Horaires · Notifications
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={10}>
          <div style={{ height: 2, background: DARK, margin: '16px 0 32px' }} />
        </FadeUp>

        {/* ── Global alerts (time slots) ── */}
        {success && (
          <FadeUp delay={0}>
            <div style={{ marginBottom: 20, padding: '11px 16px', background: GREEN_BG, borderLeft: `3px solid ${GREEN}`, fontSize: 12, fontWeight: 700, color: GREEN }}>
              ✓ Horaires enregistrés avec succès.
            </div>
          </FadeUp>
        )}
        {error && (
          <FadeUp delay={0}>
            <div style={{ marginBottom: 20, padding: '11px 16px', background: RED_BG, borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED }}>
              {error}
            </div>
          </FadeUp>
        )}

        {loading ? <Spinner /> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ══ 1. INFORMATIONS DU RESTAURANT ══ */}
            <FadeUp delay={20}>
              <Section icon={Store} title="Informations du restaurant"
                action={<SaveBtn onClick={saveInfo} saving={infoSaving} />}>

                {infoSuccess && (
                  <div style={{ marginBottom: 16, padding: '10px 14px', background: GREEN_BG, borderLeft: `3px solid ${GREEN}`, fontSize: 12, fontWeight: 700, color: GREEN }}>
                    ✓ Informations enregistrées.
                  </div>
                )}
                {infoError && (
                  <div style={{ marginBottom: 16, padding: '10px 14px', background: RED_BG, borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED }}>
                    {infoError}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <FieldRow>
                    <Field label="Nom du restaurant">
                      <TextInput icon={Store} value={info.name} onChange={v => setInfo(p => ({ ...p, name: v }))} placeholder="Ex: Dal Corso - Marrakech" />
                    </Field>
                    <Field label="Capacité (couverts)">
                      <TextInput icon={Users} value={info.capacity} onChange={v => setInfo(p => ({ ...p, capacity: v }))} placeholder="Ex: 60" type="number" />
                    </Field>
                  </FieldRow>

                  <Field label="Adresse">
                    <TextInput icon={MapPin} value={info.address} onChange={v => setInfo(p => ({ ...p, address: v }))} placeholder="Ex: 12 Rue de la Liberté, Guéliz, Marrakech" />
                  </Field>

                  <FieldRow>
                    <Field label="Lien Google Maps">
                      <TextInput icon={MapPin} value={info.maps_link} onChange={v => setInfo(p => ({ ...p, maps_link: v }))} placeholder="https://maps.google.com/…" />
                    </Field>
                    <Field label="Site web">
                      <TextInput value={info.website} onChange={v => setInfo(p => ({ ...p, website: v }))} placeholder="https://monrestaurant.ma" />
                    </Field>
                  </FieldRow>

                  <FieldRow>
                    <Field label="Téléphone">
                      <TextInput value={info.phone} onChange={v => setInfo(p => ({ ...p, phone: v }))} placeholder="+212 6XX XXX XXX" type="tel" />
                    </Field>
                    <Field label="Email de contact">
                      <TextInput icon={Mail} value={info.email} onChange={v => setInfo(p => ({ ...p, email: v }))} placeholder="contact@monrestaurant.ma" type="email" />
                    </Field>
                  </FieldRow>

                  <Field label="Description (courte)">
                    <textarea
                      value={info.description}
                      onChange={e => setInfo(p => ({ ...p, description: e.target.value }))}
                      placeholder="Quelques mots sur votre restaurant…"
                      rows={3}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '11px 14px',
                        border: `2px solid ${BORDER}`,
                        fontSize: 13, fontWeight: 600, color: DARK,
                        fontFamily: 'inherit', outline: 'none', background: '#fff',
                        borderRadius: 0, resize: 'vertical',
                        transition: 'border-color 0.15s',
                      }}
                      onFocus={e => e.target.style.borderColor = GOLD}
                      onBlur={e => e.target.style.borderColor = BORDER}
                    />
                  </Field>
                </div>
              </Section>
            </FadeUp>

            {/* ══ 2. JOURS DE TRAVAIL ══ */}
            <FadeUp delay={30}>
              <Section icon={CalendarClock} title="Jours d'ouverture"
                action={<SaveBtn onClick={handleSave} saving={saving} />}>

                <Label>Sélectionnez les jours d'ouverture</Label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                  {FR_DAYS.map((day, i) => {
                    const active = workingDates[i]
                    return (
                      <button key={day} onClick={() => toggleWorkingDay(i)}
                        style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          padding: '10px 14px', minWidth: 58, gap: 4,
                          background: active ? DARK : '#fff',
                          border: `2px solid ${active ? DARK : DARK}`,
                          color: active ? GOLD : DARK,
                          cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = CREAM }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = '#fff' }}
                      >
                        <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          {day.slice(0, 3)}
                        </span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: active ? GOLD : DARK, opacity: active ? 0.8 : 0.5 }}>
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
              <Section icon={Clock} title="Horaires de service"
                action={<SaveBtn onClick={handleSave} saving={saving} />}>

                {/* Service tabs */}
                <Label>Service</Label>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 20, marginTop: 8 }}>
                  {allOH.map((oh, i) => (
                    <button key={i} onClick={() => setActiveOH(i)}
                      style={{
                        padding: '9px 18px',
                        background: activeOH === i ? DARK : '#fff',
                        border: `2px solid ${DARK}`,
                        color: activeOH === i ? GOLD : DARK,
                        fontSize: 12, fontWeight: 800,
                        cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { if (activeOH !== i) e.currentTarget.style.background = CREAM }}
                      onMouseLeave={e => { if (activeOH !== i) e.currentTarget.style.background = '#fff' }}
                    >
                      {oh.name}
                    </button>
                  ))}
                </div>

                {/* Hour editor */}
                {allOH[activeOH] && (
                  <div style={{ background: CREAM, border: `2px solid ${DARK}`, padding: 'clamp(14px,3vw,24px)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>

                      <div>
                        <Label>Ouverture</Label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <TimeInput max={23} value={allOH[activeOH].openhours[0]?.h1} onChange={v => updateOH(activeOH, 'h1', v)} />
                          <span style={{ fontSize: 18, fontWeight: 900, color: GOLD_DK }}>:</span>
                          <TimeInput max={59} value={allOH[activeOH].openhours[0]?.m1} onChange={v => updateOH(activeOH, 'm1', v)} />
                        </div>
                      </div>

                      <div style={{ paddingBottom: 12, fontSize: 20, color: DARK, fontWeight: 900, lineHeight: 1 }}>→</div>

                      <div>
                        <Label>Fermeture</Label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <TimeInput max={23} value={allOH[activeOH].openhours[0]?.h2} onChange={v => updateOH(activeOH, 'h2', v)} />
                          <span style={{ fontSize: 18, fontWeight: 900, color: GOLD_DK }}>:</span>
                          <TimeInput max={59} value={allOH[activeOH].openhours[0]?.m2} onChange={v => updateOH(activeOH, 'm2', v)} />
                        </div>
                      </div>

                      <div>
                        <Label>Aperçu</Label>
                        <div style={{ padding: '10px 16px', background: DARK, fontSize: 14, fontWeight: 900, color: GOLD, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                          {String(allOH[activeOH].openhours[0]?.h1 ?? 0).padStart(2,'0')}:
                          {String(allOH[activeOH].openhours[0]?.m1 ?? 0).padStart(2,'0')}
                          {' — '}
                          {String(allOH[activeOH].openhours[0]?.h2 ?? 0).padStart(2,'0')}:
                          {String(allOH[activeOH].openhours[0]?.m2 ?? 0).padStart(2,'0')}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </Section>
            </FadeUp>

            {/* ══ 4. NOTIFICATIONS ══ */}
            <FadeUp delay={50}>
              <Section icon={Bell} title="Notifications par email" defaultOpen={false}
                action={<SaveBtn onClick={saveNotif} saving={notifSaving} />}>

                {notifSuccess && (
                  <div style={{ marginBottom: 16, padding: '10px 14px', background: GREEN_BG, borderLeft: `3px solid ${GREEN}`, fontSize: 12, fontWeight: 700, color: GREEN }}>
                    ✓ Notifications enregistrées.
                  </div>
                )}
                {notifError && (
                  <div style={{ marginBottom: 16, padding: '10px 14px', background: RED_BG, borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED }}>
                    {notifError}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                  {/* Toggles */}
                  <div>
                    <Label>Événements à notifier</Label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
                      <Toggle checked={notif.email_new}     onChange={() => setNotif(p => ({ ...p, email_new: !p.email_new }))}     label="Nouvelle réservation reçue" />
                      <Toggle checked={notif.email_confirm} onChange={() => setNotif(p => ({ ...p, email_confirm: !p.email_confirm }))} label="Réservation confirmée" />
                      <Toggle checked={notif.email_cancel}  onChange={() => setNotif(p => ({ ...p, email_cancel: !p.email_cancel }))}  label="Réservation annulée" />
                    </div>
                  </div>

                  <div style={{ height: 1, background: DARK, opacity: 0.1 }} />

                  <div className="notif-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Field label="Nom expéditeur">
                      <TextInput value={notif.from_name} onChange={v => setNotif(p => ({ ...p, from_name: v }))} placeholder="TableBooking.ma" />
                    </Field>
                    <Field label="Email expéditeur">
                      <TextInput icon={Mail} value={notif.from_email} onChange={v => setNotif(p => ({ ...p, from_email: v }))} placeholder="reservation@tablebooking.ma" type="email" />
                    </Field>
                  </div>

                  <Field label="Emails destinataires (séparés par des virgules)">
                    <TextInput icon={Mail} value={notif.dest_emails} onChange={v => setNotif(p => ({ ...p, dest_emails: v }))} placeholder="manager@restaurant.ma, chef@restaurant.ma" />
                  </Field>

                </div>
              </Section>
            </FadeUp>

          </div>
        )}
      </div>
    </>
  )
}