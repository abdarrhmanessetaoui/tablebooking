import { useState } from 'react'
import { Pencil, Trash2, Utensils, Users, Clock, DollarSign } from 'lucide-react'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const BORDER  = '#2b2118'
const CREAM   = '#faf8f5'
const RED     = '#b94040'
const RED_BG  = '#fdf0f0'

const DAYS_SHORT = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']

function ServiceRow({ svc, isEditing, onEdit, onDelete, idx }) {
  const bg          = isEditing ? '#fdf6ec' : idx % 2 === 0 ? '#fff' : CREAM
  const availDays   = svc.available_days ?? [0,1,2,3,4,5,6]
  const allDays     = availDays.length === 7

  return (
    <div className="svc-row" style={{
      display: 'grid', gridTemplateColumns: '1fr auto',
      background: bg,
      borderBottom: `1px solid #e8e0d8`,
      borderLeft: `3px solid ${isEditing ? GOLD : 'transparent'}`,
      transition: 'background 0.12s',
    }}>
      {/* Content */}
      <div style={{ padding: '14px 16px', minWidth: 0 }}>
        <p style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 900, color: DARK, letterSpacing: '-0.4px' }}>
          {svc.name}
        </p>

        {/* Info badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: '#fdf6ec', fontSize: 11, fontWeight: 800, color: GOLD_DK }}>
            <DollarSign size={10} strokeWidth={2.5} color={GOLD} />
            {Number(svc.price) > 0 ? `${svc.price} dh` : 'Gratuit'}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: '#fdf6ec', fontSize: 11, fontWeight: 700, color: GOLD_DK }}>
            <Users size={10} strokeWidth={2.5} color={GOLD} />
            {svc.capacity} pers. max
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: '#fdf6ec', fontSize: 11, fontWeight: 700, color: GOLD_DK }}>
            <Clock size={10} strokeWidth={2.5} color={GOLD} />
            {svc.duration} min
          </span>
        </div>

        {/* Days row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          {allDays ? (
            <span style={{ fontSize: 10, fontWeight: 800, color: GOLD_DK, padding: '2px 8px', background: '#fdf6ec' }}>
              Tous les jours
            </span>
          ) : (
            DAYS_SHORT.map((day, i) => {
              const on = availDays.includes(i)
              return (
                <span key={i} style={{
                  fontSize: 9, fontWeight: 900,
                  padding: '2px 6px',
                  background: on ? DARK : '#f0f0f0',
                  color: on ? GOLD : '#ccc',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  {day}
                </span>
              )
            })
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: `1px solid #e8e0d8` }}>
        <button onClick={() => onEdit(svc)} title="Modifier"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 18px',
            background: isEditing ? '#fdf6ec' : 'none',
            border: 'none', borderBottom: '1px solid #e8e0d8',
            color: isEditing ? GOLD : DARK,
            cursor: 'pointer', transition: 'all 0.15s', minHeight: 44,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = DARK; e.currentTarget.style.color = GOLD }}
          onMouseLeave={e => { e.currentTarget.style.background = isEditing ? '#fdf6ec' : 'none'; e.currentTarget.style.color = isEditing ? GOLD : DARK }}
        >
          <Pencil size={13} strokeWidth={2.5} />
        </button>
        <button onClick={() => onDelete(svc)} title="Supprimer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 18px', background: 'none',
            border: 'none', color: DARK,
            cursor: 'pointer', transition: 'all 0.15s', minHeight: 44,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = RED_BG; e.currentTarget.style.color = RED }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = DARK }}
        >
          <Trash2 size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}

export default function ServiceList({ services, editingSvc, onEdit, onDelete }) {
  if (services.length === 0) {
    return (
      <div style={{ padding: '56px 16px', textAlign: 'center', background: '#fff', border: `1.5px solid ${BORDER}` }}>
        <Utensils size={40} color={DARK} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 14px' }} />
        <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: DARK }}>Aucun service configuré</p>
        <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 600, color: DARK }}>
          Utilisez le formulaire pour ajouter un service.
        </p>
      </div>
    )
  }

  return (
    <>
      <style>{`@media (hover: hover) { .svc-row:hover { background: #fdf6ec !important; } }`}</style>
      <div style={{ border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '10px 16px', background: DARK }}>
          <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Nom du service</span>
          <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Actions</span>
        </div>
        {services.map((svc, i) => (
          <ServiceRow
            key={svc.idx} svc={svc} idx={i}
            isEditing={editingSvc?.idx === svc.idx}
            onEdit={onEdit} onDelete={onDelete}
          />
        ))}
      </div>
    </>
  )
}