import { useState, useEffect } from 'react'
import { X, User, Phone, CalendarDays, Clock, Users, Utensils, FileText, Mail, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { getToken } from '../../utils/auth'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'

const STATUS_CONFIG = {
  Confirmed: { bg: '#f0f7f0', color: '#2d6a2d', label: 'Confirmée'  },
  Pending:   { bg: '#fdf6ec', color: GOLD_DARK,  label: 'En attente' },
  Cancelled: { bg: '#fdf0f0', color: '#b94040',  label: 'Annulée'   },
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  border: '2px solid #e8e0d8', background: '#fff',
  padding: '10px 14px', fontSize: 14, fontWeight: 600,
  color: DARK, fontFamily: 'inherit', outline: 'none',
}

// ── Mini Calendar with blocked dates ─────────────────────────────────
function DatePicker({ value, onChange, blockedDates }) {
  const today   = new Date(); today.setHours(0,0,0,0)
  const initDate = value ? new Date(value + 'T00:00:00') : today
  const [cursor, setCursor] = useState({ year: initDate.getFullYear(), month: initDate.getMonth() })
  const [open, setOpen]     = useState(false)

  const DAYS   = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
  const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

  function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate() }
  function firstDayOfMonth(y, m) {
    const d = new Date(y, m, 1).getDay()
    return d === 0 ? 6 : d - 1 // Mon=0
  }

  const totalDays = daysInMonth(cursor.year, cursor.month)
  const firstDay  = firstDayOfMonth(cursor.year, cursor.month)

  function toISO(y, m, d) {
    return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
  }

  function handleDay(day) {
    const iso  = toISO(cursor.year, cursor.month, day)
    const date = new Date(iso + 'T00:00:00')
    if (date < today) return
    if (blockedDates.includes(iso)) return
    onChange(iso)
    setOpen(false)
  }

  function prevMonth() {
    setCursor(c => {
      const m = c.month === 0 ? 11 : c.month - 1
      const y = c.month === 0 ? c.year - 1 : c.year
      return { year: y, month: m }
    })
  }
  function nextMonth() {
    setCursor(c => {
      const m = c.month === 11 ? 0 : c.month + 1
      const y = c.month === 11 ? c.year + 1 : c.year
      return { year: y, month: m }
    })
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)

  return (
    <div style={{ position: 'relative', gridColumn: '1/-1' }}>
      <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 900, color: DARK, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Date <span style={{ color: GOLD }}>*</span>
      </p>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{ ...inputStyle, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <span style={{ color: value ? DARK : '#bbb' }}>{value || 'Choisir une date…'}</span>
        <CalendarDays size={16} color={GOLD_DARK} />
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
          background: '#fff', border: `2px solid ${DARK}`, marginTop: 2,
          boxShadow: '0 8px 32px rgba(43,33,24,0.18)',
        }}>
          {/* Month nav */}
          <div style={{ background: DARK, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
              <ChevronLeft size={16} color={GOLD} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
              {MONTHS[cursor.month]} {cursor.year}
            </span>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
              <ChevronRight size={16} color={GOLD} />
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', background: '#faf8f5', borderBottom: `1px solid #e8e0d8` }}>
            {DAYS.map(d => (
              <div key={d} style={{ padding: '6px 0', textAlign: 'center', fontSize: 10, fontWeight: 900, color: GOLD_DARK, letterSpacing: '0.1em' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '6px' }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`e${i}`} />
              const iso      = toISO(cursor.year, cursor.month, day)
              const dateObj  = new Date(iso + 'T00:00:00')
              const isPast   = dateObj < today
              const isBlocked = blockedDates.includes(iso)
              const isSelected = iso === value
              const isToday  = iso === today.toISOString().slice(0,10)
              const disabled = isPast || isBlocked

              return (
                <button
                  key={day}
                  onClick={() => handleDay(day)}
                  disabled={disabled}
                  title={isBlocked ? 'Date bloquée' : isPast ? 'Date passée' : ''}
                  style={{
                    padding: '7px 4px',
                    border: 'none',
                    background: isSelected ? DARK : isBlocked ? '#fdf0f0' : 'transparent',
                    color: isSelected ? GOLD : isBlocked ? '#e0a0a0' : isPast ? '#ccc' : isToday ? GOLD_DARK : DARK,
                    fontSize: 13, fontWeight: isSelected ? 900 : 600,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    position: 'relative',
                    textDecoration: isBlocked ? 'line-through' : 'none',
                    borderRadius: 2,
                    transition: 'background 0.1s',
                  }}
                >
                  {day}
                  {isBlocked && (
                    <span style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#b94040' }} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ padding: '8px 14px', borderTop: `1px solid #f0ebe4`, display: 'flex', gap: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#b94040', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#b94040', display: 'inline-block' }} />
              Date bloquée
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, color: GOLD_DARK, display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: GOLD_DARK, display: 'inline-block' }} />
              Aujourd'hui
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <div>
      <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 900, color: DARK, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        {label}{required && <span style={{ color: GOLD }}> *</span>}
      </p>
      <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)}
        style={inputStyle} />
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ width: 32, height: 32, background: '#f5f0eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={14} color={GOLD_DARK} strokeWidth={2} />
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
        <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 800, color: DARK }}>{value}</p>
      </div>
    </div>
  )
}

export default function ReservationModal({ modalMode, editing, form, setForm, handleSubmit, handleCreate, handleDelete, setModalMode }) {
  const [hovSave,      setHovSave]      = useState(false)
  const [hovDel,       setHovDel]       = useState(false)
  const [services,     setServices]     = useState([])
  const [blockedDates, setBlockedDates] = useState([])

  const close = () => setModalMode(null)

  useEffect(() => {
    fetch('http://localhost:8000/api/restaurant/services', {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${getToken()}` }
    })
      .then(r => r.json())
      .then(data => Array.isArray(data) ? setServices(data) : setServices([]))
      .catch(() => setServices([]))
  }, [])

  useEffect(() => {
    fetch('http://localhost:8000/api/blocked-dates', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      }
    })
      .then(r => r.json())
      .then(data => setBlockedDates(Array.isArray(data) ? data.map(d => d.date) : []))
      .catch(() => setBlockedDates([]))
  }, [])

  const titles = { view: 'Détail', edit: 'Modifier le statut', create: 'Nouvelle réservation' }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(43,33,24,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ background: '#fff', width: '100%', maxWidth: 460, maxHeight: '90vh', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ background: DARK, padding: '20px 26px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              {titles[modalMode]}
            </p>
            <h2 style={{ margin: '3px 0 0', fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
              {modalMode === 'create' ? 'Nouvelle réservation' : (editing?.name || '—')}
            </h2>
          </div>
          <button onClick={close} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={17} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* ── VIEW ──────────────────────────────────────────── */}
          {modalMode === 'view' && editing && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <InfoRow icon={User}         label="Nom"      value={editing.name}       />
                <InfoRow icon={Phone}        label="Tél"      value={editing.phone}      />
                <InfoRow icon={Mail}         label="Email"    value={editing.email}      />
                <InfoRow icon={CalendarDays} label="Date"     value={editing.date}       />
                <InfoRow icon={Clock}        label="Heure"    value={editing.start_time} />
                <InfoRow icon={Users}        label="Couverts" value={editing.guests}     />
                <InfoRow icon={Utensils}     label="Service"  value={editing.service}    />
                <InfoRow icon={FileText}     label="Notes"    value={editing.notes}      />
              </div>

              {editing.status && (() => {
                const s = STATUS_CONFIG[editing.status] || { bg: '#f5f5f5', color: '#888', label: editing.status }
                return (
                  <div style={{ padding: '10px 16px', background: s.bg, display: 'inline-flex' }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: s.color }}>{s.label}</span>
                  </div>
                )
              })()}

              <div style={{ height: 2, background: '#f0ebe4' }} />

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setForm({ ...editing }); setModalMode('edit') }}
                  style={{ flex: 1, padding: '12px', background: DARK, border: 'none', fontSize: 13, fontWeight: 800, color: GOLD, cursor: 'pointer' }}>
                  Modifier le statut
                </button>
                <button onClick={() => handleDelete(editing.id)}
                  onMouseEnter={() => setHovDel(true)} onMouseLeave={() => setHovDel(false)}
                  style={{ padding: '12px 16px', background: hovDel ? '#b94040' : '#fdf0f0', border: 'none', cursor: 'pointer', transition: 'background 0.15s', display: 'flex', alignItems: 'center' }}>
                  <Trash2 size={16} strokeWidth={2.5} color={hovDel ? '#fff' : '#b94040'} />
                </button>
              </div>
            </>
          )}

          {/* ── EDIT ──────────────────────────────────────────── */}
          {modalMode === 'edit' && (
            <>
              <div style={{ background: '#faf8f5', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['Date', editing?.date], ['Heure', editing?.start_time], ['Couverts', editing?.guests]].map(([l, v]) => v ? (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#aaa' }}>{l}</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: DARK }}>{v}</span>
                  </div>
                ) : null)}
              </div>

              <div>
                <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 900, color: DARK, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Statut</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Confirmed', 'Pending', 'Cancelled'].map(s => {
                    const active = form.status === s
                    return (
                      <button key={s} onClick={() => setForm({ ...form, status: s })}
                        style={{ flex: 1, padding: '11px 6px', background: active ? DARK : '#f5f0eb', border: 'none', fontSize: 12, fontWeight: 900, color: active ? GOLD : '#888', cursor: 'pointer', transition: 'all 0.15s' }}>
                        {STATUS_CONFIG[s]?.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={close} style={{ flex: 1, padding: '12px', background: '#f5f0eb', border: 'none', fontSize: 13, fontWeight: 800, color: DARK, cursor: 'pointer' }}>Annuler</button>
                <button onClick={handleSubmit}
                  onMouseEnter={() => setHovSave(true)} onMouseLeave={() => setHovSave(false)}
                  style={{ flex: 2, padding: '12px', background: hovSave ? GOLD_DARK : GOLD, border: 'none', fontSize: 14, fontWeight: 900, color: DARK, cursor: 'pointer', transition: 'background 0.15s' }}>
                  Enregistrer
                </button>
              </div>
            </>
          )}

          {/* ── CREATE ────────────────────────────────────────── */}
          {modalMode === 'create' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

                <div style={{ gridColumn: '1/-1' }}>
                  <Field label="Nom" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
                </div>

                <Field label="Téléphone" value={form.phone}  onChange={v => setForm({ ...form, phone: v })} />
                <Field label="Email"     value={form.email}  onChange={v => setForm({ ...form, email: v })} type="email" />

                {/* Custom date picker — blocked dates disabled */}
                <DatePicker
                  value={form.date}
                  onChange={v => setForm({ ...form, date: v })}
                  blockedDates={blockedDates}
                />

                <Field label="Heure"    value={form.start_time} onChange={v => setForm({ ...form, start_time: v })} type="time" required />
                <Field label="Couverts" value={form.guests}     onChange={v => setForm({ ...form, guests: v })}     type="number" required />

                {/* Service dropdown */}
                <div style={{ gridColumn: '1/-1' }}>
                  <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 900, color: DARK, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Service</p>
                  <select value={form.service ?? ''} onChange={e => setForm({ ...form, service: e.target.value })}
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                    <option value="">— Choisir un service —</option>
                    {services.map(s => (
                      <option key={s.name} value={s.name}>{s.name}{s.price > 0 ? ` — ${s.price} dh` : ''}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Notes */}
              <div>
                <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 900, color: DARK, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Notes</p>
                <textarea value={form.notes ?? ''} onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>

              {/* Status */}
              <div>
                <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 900, color: DARK, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Statut</p>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['Confirmed', 'Pending', 'Cancelled'].map(s => {
                    const active = form.status === s
                    return (
                      <button key={s} onClick={() => setForm({ ...form, status: s })}
                        style={{ flex: 1, padding: '11px 6px', background: active ? DARK : '#f5f0eb', border: 'none', fontSize: 12, fontWeight: 900, color: active ? GOLD : '#888', cursor: 'pointer', transition: 'all 0.15s' }}>
                        {STATUS_CONFIG[s]?.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={close} style={{ flex: 1, padding: '12px', background: '#f5f0eb', border: 'none', fontSize: 13, fontWeight: 800, color: DARK, cursor: 'pointer' }}>Annuler</button>
                <button
                  onClick={() => {
                    if (!form.name || !form.date || !form.start_time || !form.guests) {
                      alert('Nom, date, heure et couverts sont obligatoires.')
                      return
                    }
                    handleCreate()
                  }}
                  onMouseEnter={() => setHovSave(true)} onMouseLeave={() => setHovSave(false)}
                  style={{ flex: 2, padding: '12px', background: hovSave ? GOLD_DARK : GOLD, border: 'none', fontSize: 14, fontWeight: 900, color: DARK, cursor: 'pointer', transition: 'background 0.15s' }}>
                  Créer la réservation
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}