import { useState } from 'react'
import useRestaurantSettings from '../hooks/useRestaurantSettings'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const CREAM   = '#faf8f5'
const BORDER  = '#2b2118'

const FR_DAYS      = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
const FR_DAYS_FULL = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']

function Label({ children }) {
  return (
    <p style={{ margin: '0 0 6px', fontSize: 10, fontWeight: 900, color: DARK, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
      {children}
    </p>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text', disabled }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled}
        style={{
          width: '100%', boxSizing: 'border-box',
          padding: '12px 14px',
          border: `2px solid ${DARK}`,
          fontSize: 14, fontWeight: 700, color: DARK,
          fontFamily: 'inherit', outline: 'none',
          background: disabled ? '#F5F5F5' : '#fff',
          borderRadius: 0,
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
        width: 58, textAlign: 'center',
        border: `2px solid ${DARK}`, padding: '10px 6px',
        fontSize: 16, fontWeight: 900, color: DARK,
        fontFamily: 'inherit', outline: 'none',
        background: '#fff', borderRadius: 0,
      }}
    />
  )
}

function SaveBtn({ onClick, saving, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled || saving}
      style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
        background: DARK,
        border: 'none', color: GOLD, fontSize: 12, fontWeight: 900,
        cursor: (disabled || saving) ? 'not-allowed' : 'pointer',
        opacity: (disabled || saving) ? 0.6 : 1,
        fontFamily: 'inherit', letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
      {saving ? 'Enregistrement…' : 'Enregistrer'}
    </button>
  )
}

function Section({ title, action, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ background: '#fff', border: `2px solid ${DARK}`, marginBottom: 24 }}>
      <div onClick={() => setOpen(o => !o)} style={{
        padding: '16px 20px', background: DARK,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'pointer', userSelect: 'none', gap: 8,
      }}>
        <span style={{ fontSize: 12, fontWeight: 900, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          {title}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {action && <div onClick={e => e.stopPropagation()}>{action}</div>}
          <span style={{ fontSize: 11, fontWeight: 900, color: GOLD, textTransform: 'uppercase' }}>
            {open ? 'Masquer' : 'Afficher'}
          </span>
        </div>
      </div>
      {open && <div style={{ padding: '24px' }}>{children}</div>}
    </div>
  )
}

function Grid({ children }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
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
  return (
    <button onClick={onClick} disabled={disabled}
      style={{
        padding: '10px 20px',
        background: active ? DARK : '#FFFFFF',
        border: `2px solid ${DARK}`,
        color: active ? GOLD : DARK,
        fontSize: 13, fontWeight: 900,
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: 'inherit',
        textTransform: 'uppercase',
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
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: DARK, textTransform: 'uppercase' }}>
      Chargement…
    </div>
  )

  const currentSvc  = servicesOnActiveDay[activeService]
  const ohindex     = currentSvc?.ohindex ?? 0
  const currentOH   = hours.allOH?.[ohindex]
  const currentSlot = currentOH?.openhours?.[activeDay]
  const isDayOpen   = hours.working_dates?.[activeDay] ?? false

  return (
    <div style={{
      minHeight: '100vh', background: '#fff',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      padding: '40px 24px', width: '100%',
    }}>
      <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, color: DARK, letterSpacing: '-1.5px', textTransform: 'uppercase', marginBottom: 32 }}>
        Paramètres
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 960 }}>

        {/* 1. INFOS */}
        <Section title="Informations du restaurant" action={<SaveBtn onClick={saveInfo} saving={savingInfo} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Grid>
              <Field label="Nom du restaurant">
                <TextInput value={info.form_name} onChange={v => setInfoField('form_name', v)} placeholder="Ex: Dal Corso" />
              </Field>
              <Field label="Capacité totale">
                <TextInput value={info.capacity} onChange={v => setInfoField('capacity', v)} type="number" />
              </Field>
            </Grid>
            <Field label="Adresse physique">
              <TextInput value={info.address} onChange={v => setInfoField('address', v)} />
            </Field>
            <Grid>
              <Field label="Google Maps">
                <TextInput value={info.google_maps_link} onChange={v => setInfoField('google_maps_link', v)} />
              </Field>
              <Field label="Site web">
                <TextInput value={info.website} onChange={v => setInfoField('website', v)} />
              </Field>
            </Grid>
            <Grid>
              <Field label="Téléphone">
                <TextInput value={info.phone} onChange={v => setInfoField('phone', v)} type="tel" />
              </Field>
              <Field label="Email contact">
                <TextInput value={info.contact_email} onChange={v => setInfoField('contact_email', v)} type="email" />
              </Field>
            </Grid>
            <Field label="Description">
              <textarea value={info.description ?? ''} onChange={e => setInfoField('description', e.target.value)}
                rows={4}
                style={{
                  width: '100%', padding: '12px 14px',
                  border: `2px solid ${DARK}`, fontSize: 14, fontWeight: 700, color: DARK,
                  fontFamily: 'inherit', outline: 'none', background: '#fff',
                  borderRadius: 0, resize: 'vertical',
                }}
              />
            </Field>
          </div>
        </Section>

        {/* 2. HOURS */}
        <Section title="Jours & Horaires d'ouverture" action={<SaveBtn onClick={saveHours} saving={savingHours} />}>
          <Label>Jours disponibles</Label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
            {FR_DAYS.map((day, i) => {
              const open     = hours.working_dates?.[i] ?? false
              const isActive = activeDay === i
              return (
                <button key={i}
                  onClick={() => { setActiveDay(i); setActiveServiceIdx(0) }}
                  style={{
                    padding: '12px 18px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                    background: isActive ? GOLD : (open ? DARK : '#fff'),
                    border: `2px solid ${DARK}`,
                    color: isActive ? DARK : (open ? GOLD : DARK),
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>{day}</span>
                  <span style={{ fontSize: 9, fontWeight: 900, opacity: 0.8 }}>{open ? 'OUVERT' : 'FERMÉ'}</span>
                </button>
              )
            })}
          </div>

          <div style={{ border: `2px solid ${DARK}`, padding: 20, background: CREAM }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: DARK, textTransform: 'uppercase' }}>{FR_DAYS_FULL[activeDay]}</span>
                <span style={{ padding: '4px 12px', background: isDayOpen ? '#16A34A' : '#FF0000', color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>
                  {isDayOpen ? 'Ouvert' : 'Fermé'}
                </span>
              </div>
              <button onClick={() => toggleWorkingDay(activeDay)}
                style={{ padding: '10px 16px', background: isDayOpen ? '#FF0000' : '#16A34A', color: '#fff', border: 'none', fontSize: 11, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase' }}>
                {isDayOpen ? 'Marquer Fermé' : 'Marquer Ouvert'}
              </button>
            </div>

            {isDayOpen && servicesOnActiveDay.length > 0 && (
              <>
                <Label>Service sélectionné</Label>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 20 }}>
                  {servicesOnActiveDay.map((svc, i) => (
                    <TabBtn key={svc.idx} active={activeService === i} onClick={() => setActiveServiceIdx(i)}>
                      {svc.name}
                    </TabBtn>
                  ))}
                </div>

                {currentSlot && (
                  <div style={{ borderTop: `2px solid ${DARK}`, paddingTop: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                      <div>
                        <Label>Début</Label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <TimeInput max={23} value={currentSlot.h1} onChange={v => updateDayOH(ohindex, activeDay, 'h1', v)} />
                          <span style={{ fontWeight: 900 }}>:</span>
                          <TimeInput max={59} value={currentSlot.m1} onChange={v => updateDayOH(ohindex, activeDay, 'm1', v)} />
                        </div>
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 900, paddingTop: 20 }}>→</div>
                      <div>
                        <Label>Fin</Label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <TimeInput max={23} value={currentSlot.h2} onChange={v => updateDayOH(ohindex, activeDay, 'h2', v)} />
                          <span style={{ fontWeight: 900 }}>:</span>
                          <TimeInput max={59} value={currentSlot.m2} onChange={v => updateDayOH(ohindex, activeDay, 'm2', v)} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Section>

        {/* 3. NOTIF */}
        <Section title="Emails & Notifications" action={<SaveBtn onClick={saveNotif} saving={savingNotif} />}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Grid>
              <Field label="Nom d'expéditeur">
                <TextInput value={notifications.fp_from_name} onChange={v => setNotifField('fp_from_name', v)} />
              </Field>
              <Field label="Email d'expéditeur">
                <TextInput value={notifications.fp_from_email} onChange={v => setNotifField('fp_from_email', v)} type="email" />
              </Field>
            </Grid>
            <Field label="Destinataires (séparés par des virgules)">
              <TextInput value={notifications.fp_destination_emails} onChange={v => setNotifField('fp_destination_emails', v)} />
            </Field>
            <div>
              <Label>Statut par défaut des réservations</Label>
              <div style={{ display: 'flex', gap: 6 }}>
                {['Pending', 'Confirmed'].map(s => (
                  <TabBtn key={s} active={notifications.defaultstatus === s} onClick={() => setNotifField('defaultstatus', s)}>
                    {s === 'Pending' ? 'En attente' : 'Confirmée'}
                  </TabBtn>
                ))}
              </div>
            </div>
          </div>
        </Section>

      </div>
    </div>
  )
}