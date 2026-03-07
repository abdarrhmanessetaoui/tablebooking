const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'

const STATUS_CONFIG = {
  Confirmed: { bg: '#f0f7f0', color: '#2d6a2d', label: 'Confirmée'  },
  Pending:   { bg: '#fdf6ec', color: GOLD_DARK,  label: 'En attente' },
  Cancelled: { bg: '#fdf0f0', color: '#b94040',  label: 'Annulée'   },
}

import { useState } from 'react'
import { X, User, Phone, CalendarDays, Clock, Users, Utensils, FileText } from 'lucide-react'

export default function ReservationModal({ editing, form, setForm, handleSubmit, setShowModal }) {
  const [hovSave, setHovSave] = useState(false)
  const [hovCancel, setHovCancel] = useState(false)
  const cfg = STATUS_CONFIG[form.status] || { bg: '#f5f5f5', color: '#888', label: form.status }

  const info = [
    { icon: User,        label: 'Nom',      value: editing.name       },
    { icon: Phone,       label: 'Téléphone',value: editing.phone      },
    { icon: CalendarDays,label: 'Date',     value: editing.date       },
    { icon: Clock,       label: 'Heure',    value: editing.start_time },
    { icon: Users,       label: 'Couverts', value: editing.guests     },
    { icon: Utensils,    label: 'Service',  value: editing.service    },
    ...(editing.notes ? [{ icon: FileText, label: 'Notes', value: editing.notes }] : []),
  ]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(43,33,24,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{
        background: '#fff', width: '100%', maxWidth: 440,
        borderRadius: 0,
        overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          background: DARK, padding: '22px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: GOLD, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Réservation
            </p>
            <h2 style={{ margin: '4px 0 0', fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
              {editing.name || '—'}
            </h2>
          </div>
          <button
            onClick={() => setShowModal(false)}
            onMouseEnter={() => setHovCancel(true)}
            onMouseLeave={() => setHovCancel(false)}
            style={{
              background: hovCancel ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
              border: 'none', borderRadius: 0,
              width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.15s',
            }}
          >
            <X size={18} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        <div style={{ padding: '24px 28px' }}>

          {/* Info grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {info.map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, background: '#f5f0eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={14} color={GOLD_DARK} strokeWidth={2} />
                </div>
                <span style={{ fontSize: 12, color: '#999', fontWeight: 700, width: 80, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: DARK }}>{value || '—'}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: 2, background: DARK, marginBottom: 24 }} />

          {/* Status selector */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 900, color: DARK, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Statut
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              {['Confirmed', 'Pending', 'Cancelled'].map(s => {
                const c = STATUS_CONFIG[s]
                const active = form.status === s
                return (
                  <button
                    key={s}
                    onClick={() => setForm({ ...form, status: s })}
                    style={{
                      flex: 1, padding: '10px 8px',
                      background: active ? DARK : '#f5f0eb',
                      border: 'none', borderRadius: 0,
                      fontSize: 12, fontWeight: 900,
                      color: active ? GOLD : '#888',
                      cursor: 'pointer',
                      transition: 'background 0.15s, color 0.15s',
                      letterSpacing: '-0.1px',
                    }}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowModal(false)}
              style={{
                flex: 1, padding: '13px',
                background: '#f5f0eb', border: 'none',
                fontSize: 14, fontWeight: 800, color: DARK,
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              onMouseEnter={() => setHovSave(true)}
              onMouseLeave={() => setHovSave(false)}
              style={{
                flex: 2, padding: '13px',
                background: hovSave ? GOLD_DARK : GOLD,
                border: 'none',
                fontSize: 14, fontWeight: 900, color: DARK,
                cursor: 'pointer', letterSpacing: '-0.2px',
                transition: 'background 0.15s',
              }}
            >
              Enregistrer
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}