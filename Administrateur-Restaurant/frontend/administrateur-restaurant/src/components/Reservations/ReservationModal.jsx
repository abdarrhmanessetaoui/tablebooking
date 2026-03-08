import { useState, useEffect } from 'react'
import { X, User, Phone, CalendarDays, Clock, Users, Utensils, FileText, Mail, Trash2 } from 'lucide-react'
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
  const [hovSave, setHovSave] = useState(false)
  const [hovDel,  setHovDel]  = useState(false)
  const [services, setServices] = useState([])

  const close = () => setModalMode(null)

  // Fetch services from API
  useEffect(() => {
    fetch('http://localhost:8000/api/restaurant/services', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      }
    })
      .then(r => r.json())
      .then(data => Array.isArray(data) ? setServices(data) : setServices([]))
      .catch(() => setServices([]))
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

          {/* ── VIEW MODE ─────────────────────────────────────── */}
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
                  <div style={{ padding: '10px 16px', background: s.bg, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
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
                <button
                  onClick={() => handleDelete(editing.id)}
                  onMouseEnter={() => setHovDel(true)}
                  onMouseLeave={() => setHovDel(false)}
                  style={{ padding: '12px 16px', background: hovDel ? '#b94040' : '#fdf0f0', border: 'none', cursor: 'pointer', transition: 'background 0.15s', display: 'flex', alignItems: 'center' }}>
                  <Trash2 size={16} strokeWidth={2.5} color={hovDel ? '#fff' : '#b94040'} />
                </button>
              </div>
            </>
          )}

          {/* ── EDIT MODE ─────────────────────────────────────── */}
          {modalMode === 'edit' && (
            <>
              <div style={{ background: '#faf8f5', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { l: 'Date',     v: editing?.date       },
                  { l: 'Heure',    v: editing?.start_time },
                  { l: 'Couverts', v: editing?.guests     },
                ].map(({ l, v }) => v ? (
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
                <button onClick={close} style={{ flex: 1, padding: '12px', background: '#f5f0eb', border: 'none', fontSize: 13, fontWeight: 800, color: DARK, cursor: 'pointer' }}>
                  Annuler
                </button>
                <button onClick={handleSubmit}
                  onMouseEnter={() => setHovSave(true)}
                  onMouseLeave={() => setHovSave(false)}
                  style={{ flex: 2, padding: '12px', background: hovSave ? GOLD_DARK : GOLD, border: 'none', fontSize: 14, fontWeight: 900, color: DARK, cursor: 'pointer', transition: 'background 0.15s' }}>
                  Enregistrer
                </button>
              </div>
            </>
          )}

          {/* ── CREATE MODE ───────────────────────────────────── */}
          {modalMode === 'create' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

                {/* Nom — full width */}
                <div style={{ gridColumn: '1/-1' }}>
                  <Field label="Nom" value={form.name} onChange={v => setForm({ ...form, name: v })} required />
                </div>

                <Field label="Téléphone" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
                <Field label="Email"     value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" />
                <Field label="Date"      value={form.date}  onChange={v => setForm({ ...form, date: v })}  type="date" required />
                <Field label="Heure"     value={form.start_time} onChange={v => setForm({ ...form, start_time: v })} type="time" />
                <Field label="Couverts"  value={form.guests} onChange={v => setForm({ ...form, guests: v })} type="number" required />

                {/* Service dropdown */}
                <div style={{ gridColumn: '1/-1' }}>
                  <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 900, color: DARK, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Service
                  </p>
                  <select
                    value={form.service ?? ''}
                    onChange={e => setForm({ ...form, service: e.target.value })}
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                  >
                    <option value="">— Choisir un service —</option>
                    {services.map(s => (
                      <option key={s.name} value={s.name}>
                        {s.name}{s.price > 0 ? ` — ${s.price} dh` : ''}
                      </option>
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
                <button onClick={close} style={{ flex: 1, padding: '12px', background: '#f5f0eb', border: 'none', fontSize: 13, fontWeight: 800, color: DARK, cursor: 'pointer' }}>
                  Annuler
                </button>
                <button
                  onClick={() => {
                    if (!form.name || !form.date || !form.start_time || !form.guests) {
                      alert('Nom, date, heure et couverts sont obligatoires.')
                      return
                    }
                    handleCreate()
                  }}
                  onMouseEnter={() => setHovSave(true)}
                  onMouseLeave={() => setHovSave(false)}
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