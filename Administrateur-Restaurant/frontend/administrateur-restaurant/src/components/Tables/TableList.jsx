import { useState } from 'react'
import { Pencil, Trash2, LayoutGrid, Users, MapPin, ToggleLeft, ToggleRight } from 'lucide-react'

const DARK    = '#2b2118'
const GOLD    = '#c8a97e'
const GOLD_DK = '#a8834e'
const BORDER  = '#2b2118'
const CREAM   = '#faf8f5'
const RED     = '#b94040'
const RED_BG  = '#fdf0f0'
const GREEN   = '#16a34a'
const GREEN_BG = '#f0f7f0'

const LOC_COLORS = {
  'Intérieur':    { bg: '#f0f4ff', color: '#3b5bdb' },
  'Terrasse':     { bg: '#f0fdf4', color: '#16a34a' },
  'Bar':          { bg: '#fdf6ec', color: '#a8834e' },
  'Salon privé':  { bg: '#fdf0f0', color: '#b94040' },
}

function TableRow({ tbl, isEditing, onEdit, onDelete, onToggle, idx }) {
  const bg      = isEditing ? '#fdf6ec' : idx % 2 === 0 ? '#fff' : CREAM
  const locStyle = LOC_COLORS[tbl.location] || { bg: '#f5f5f5', color: '#666' }

  return (
    <div className="tbl-row" style={{
      display: 'grid', gridTemplateColumns: '1fr auto',
      background: bg,
      borderBottom: `1px solid #e8e0d8`,
      borderLeft: `3px solid ${isEditing ? GOLD : tbl.active ? GOLD : '#e8e0d8'}`,
      opacity: tbl.active ? 1 : 0.55,
      transition: 'background 0.12s, opacity 0.15s',
    }}>
      {/* Content */}
      <div style={{ padding: '13px 16px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7, flexWrap: 'wrap' }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: DARK, letterSpacing: '-0.4px' }}>
            Table {tbl.number}
          </p>
          {!tbl.active && (
            <span style={{ padding: '2px 8px', background: '#f5f5f5', fontSize: 10, fontWeight: 900, color: '#999', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Inactive
            </span>
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: '#fdf6ec', fontSize: 11, fontWeight: 800, color: GOLD_DK }}>
            <Users size={10} strokeWidth={2.5} color={GOLD} />
            {tbl.capacity} pers. max
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: locStyle.bg, fontSize: 11, fontWeight: 700, color: locStyle.color }}>
            <MapPin size={10} strokeWidth={2.5} color={locStyle.color} />
            {tbl.location}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', borderLeft: `1px solid #e8e0d8` }}>
        <button onClick={() => onToggle(tbl)} title={tbl.active ? 'Désactiver' : 'Activer'}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 14px', background: 'none',
            border: 'none', borderBottom: '1px solid #e8e0d8',
            color: tbl.active ? GREEN : '#bbb',
            cursor: 'pointer', transition: 'all 0.15s', minHeight: 36,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = tbl.active ? GREEN_BG : '#f5f5f5' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
        >
          {tbl.active
            ? <ToggleRight size={16} strokeWidth={2} />
            : <ToggleLeft  size={16} strokeWidth={2} />
          }
        </button>
        <button onClick={() => onEdit(tbl)} title="Modifier"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 14px',
            background: isEditing ? '#fdf6ec' : 'none',
            border: 'none', borderBottom: '1px solid #e8e0d8',
            color: isEditing ? GOLD : DARK,
            cursor: 'pointer', transition: 'all 0.15s', minHeight: 36,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = DARK; e.currentTarget.style.color = GOLD }}
          onMouseLeave={e => { e.currentTarget.style.background = isEditing ? '#fdf6ec' : 'none'; e.currentTarget.style.color = isEditing ? GOLD : DARK }}
        >
          <Pencil size={13} strokeWidth={2.5} />
        </button>
        <button onClick={() => onDelete(tbl)} title="Supprimer"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 14px', background: 'none',
            border: 'none', color: DARK,
            cursor: 'pointer', transition: 'all 0.15s', minHeight: 36,
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

export default function TableList({ tables, editingTbl, onEdit, onDelete, onToggle }) {
  if (tables.length === 0) {
    return (
      <div style={{ padding: '56px 16px', textAlign: 'center', background: '#fff', border: `1.5px solid ${BORDER}` }}>
        <LayoutGrid size={40} color={DARK} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 14px' }} />
        <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: DARK }}>Aucune table configurée</p>
        <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 600, color: DARK }}>
          Utilisez le formulaire pour ajouter une table.
        </p>
      </div>
    )
  }

  const active   = tables.filter(t => t.active)
  const inactive = tables.filter(t => !t.active)

  return (
    <>
      <style>{`@media (hover: hover) { .tbl-row:hover { background: #fdf6ec !important; } }`}</style>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 12 }}>
        <div style={{ flex: 1, padding: '10px 14px', background: DARK, borderRight: `1px solid #3d2d1e` }}>
          <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Actives</p>
          <p style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 900, color: '#fff' }}>{active.length}</p>
        </div>
        <div style={{ flex: 1, padding: '10px 14px', background: '#3d2d1e' }}>
          <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Inactives</p>
          <p style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 900, color: '#fff' }}>{inactive.length}</p>
        </div>
        <div style={{ flex: 1, padding: '10px 14px', background: '#4a3525' }}>
          <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Capacité totale</p>
          <p style={{ margin: '2px 0 0', fontSize: 20, fontWeight: 900, color: '#fff' }}>
            {active.reduce((s, t) => s + parseInt(t.capacity || 0), 0)} pers.
          </p>
        </div>
      </div>

      <div style={{ border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto',
          padding: '10px 16px', background: DARK,
        }}>
          <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Table</span>
          <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Actions</span>
        </div>

        {tables.map((tbl, i) => (
          <TableRow
            key={tbl.idx}
            tbl={tbl}
            idx={i}
            isEditing={editingTbl?.idx === tbl.idx}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        ))}
      </div>
    </>
  )
}