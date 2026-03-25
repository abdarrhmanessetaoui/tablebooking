import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { getToken } from '../../utils/auth'
import { GREEN, RED } from '../../styles/dashboard/tokens'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const BORDER    = '#2b2118'
const CREAM     = '#faf8f5'
const BASE      = 'http://localhost:8000/api'

const LOC_COLORS = {
  'Intérieur':   { bg: '#eef2ff', color: '#4f6ef7' },
  'Terrasse':    { bg: '#f0fdf4', color: '#16a34a' },
  'Bar':         { bg: '#fdf6ec', color: '#a8834e' },
  'Salon privé': { bg: '#fdf0f0', color: '#b94040' },
}

export default function AssignTableModal({ reservation, onClose, onAssigned }) {
  const [tables,   setTables]   = useState([])
  const [busyIdxs, setBusyIdxs] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState(null)
  const [selected, setSelected] = useState(reservation?.table_idx ?? null)

  const guestCount = parseInt(reservation?.guests ?? 1)

  const hdrs = () => ({
    'Content-Type':  'application/json',
    'Accept':        'application/json',
    'Authorization': `Bearer ${getToken()}`,
  })

  useEffect(() => {
    const params = new URLSearchParams({
      date:       reservation?.date       ?? '',
      start_time: reservation?.start_time ?? '',
      ...(reservation?.end_time ? { end_time: reservation.end_time } : {}),
      exclude_id: reservation?.id ?? 0,
    })

    Promise.all([
      fetch(`${BASE}/tables`,               { headers: hdrs() }).then(r => r.json()),
      fetch(`${BASE}/tables/busy?${params}`, { headers: hdrs() }).then(r => r.json()),
    ])
      .then(([tableData, busyData]) => {
        setTables(Array.isArray(tableData) ? tableData.filter(t => t.active) : [])
        setBusyIdxs(Array.isArray(busyData) ? busyData : [])
      })
      .catch(() => setError('Impossible de charger les tables.'))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line

  const sortedTables = [...tables].sort((a, b) => {
    const aOk = !busyIdxs.includes(a.idx) && parseInt(a.capacity) >= guestCount
    const bOk = !busyIdxs.includes(b.idx) && parseInt(b.capacity) >= guestCount
    if (aOk && !bOk) return -1
    if (!aOk && bOk) return 1
    return String(a.number).localeCompare(String(b.number))
  })

  function tableState(table) {
    const isBusy         = busyIdxs.includes(table.idx)
    const isInsufficient = parseInt(table.capacity) < guestCount
    const isSelected     = selected === table.idx
    const isCurrent      = reservation?.table_idx === table.idx
    if (isBusy)         return 'busy'
    if (isInsufficient) return 'insufficient'
    if (isSelected)     return 'selected'
    if (isCurrent)      return 'current'
    return 'available'
  }

  const stateConfig = {
    busy: {
      border:        RED,
      background:    '#fff5f5',
      cursor:        'not-allowed',
      iconBg:        '#fef2f2',
      iconColor:     RED,
      textColor:     'rgba(43,33,24,0.45)',
      badge:         { bg: RED, color: '#fff', text: 'Occupée' },
      capacityBg:    '#fef2f2',
      capacityColor: RED,
    },
    insufficient: {
      border:        'rgba(43,33,24,0.1)',
      background:    '#fafafa',
      cursor:        'not-allowed',
      iconBg:        '#f0f0f0',
      iconColor:     'rgba(43,33,24,0.25)',
      textColor:     'rgba(43,33,24,0.35)',
      badge:         { bg: '#e5e7eb', color: '#9ca3af', text: 'Insuffisante' },
      capacityBg:    '#fef2f2',
      capacityColor: RED,
    },
    selected: {
      border:        GOLD,
      background:    DARK,
      cursor:        'pointer',
      iconBg:        'rgba(200,169,126,0.15)',
      iconColor:     GOLD,
      textColor:     '#fff',
      capacityBg:    'rgba(200,169,126,0.15)',
      capacityColor: GOLD,
    },
    current: {
      border:        GREEN,
      background:    '#f0fdf4',
      cursor:        'pointer',
      iconBg:        '#dcfce7',
      iconColor:     GREEN,
      textColor:     DARK,
      badge:         { bg: GREEN, color: '#fff', text: 'Actuelle' },
      capacityBg:    '#dcfce7',
      capacityColor: '#16a34a',
    },
    available: {
      border:        DARK,
      background:    '#fff',
      cursor:        'pointer',
      iconBg:        '#f5f0eb',
      iconColor:     DARK,
      textColor:     DARK,
      capacityBg:    '#f0fdf4',
      capacityColor: '#16a34a',
    },
  }

  async function handleAssign() {
    if (saving || selected === reservation?.table_idx) return
    setSaving(true)
    setError(null)
    try {
      const res  = await fetch(
        `${BASE}/restaurant/reservations/${reservation.id}/assign-table`,
        { method: 'PATCH', headers: hdrs(), body: JSON.stringify({ table_idx: selected }) }
      )
      const data = await res.json()
      if (!res.ok) { setError(data.message ?? `Erreur ${res.status}`); return }
      onAssigned(data)
      onClose()
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setSaving(false)
    }
  }

  const hasChanged = selected !== reservation?.table_idx

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(43,33,24,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', width: '100%', maxWidth: 420,
        maxHeight: '88vh', overflow: 'auto',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 64px rgba(43,33,24,0.35)',
      }}>

        {/* Header */}
        <div style={{
          background: DARK, padding: '18px 22px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Assigner une table
            </p>
            <h2 style={{ margin: '3px 0 0', fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '-0.4px' }}>
              {reservation?.name ?? '—'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: GOLD, border: 'none', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 10, fontWeight: 900, color: DARK, textTransform: 'uppercase' }}>
            Fermer
          </button>
        </div>

        {/* Summary */}
        <div style={{ background: CREAM, padding: '10px 22px', borderBottom: `2px solid ${DARK}`, display: 'flex', gap: 20, flexShrink: 0 }}>
          {[
            ['Date',     reservation?.date       ?? '—'],
            ['Heure',    reservation?.start_time ?? '—'],
            ['Couverts', `${guestCount} pers.`        ],
          ].map(([label, val]) => (
            <div key={label}>
              <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{label}</p>
              <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 900, color: DARK }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ margin: '14px 22px 0', padding: '10px 12px', background: '#fef2f2', borderLeft: `6px solid ${RED}`, fontSize: 12, fontWeight: 900, color: RED, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 900 }}>!</span>
            {error}
          </div>
        )}

        {/* Table list */}
        <div style={{ padding: '14px 22px', flex: 1 }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 900, color: DARK, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Tables disponibles
            </p>
            {reservation?.table_idx && (
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 11, fontWeight: 900, color: RED, textDecoration: 'underline', fontFamily: 'inherit', textTransform: 'uppercase' }}>
                Retirer la table
              </button>
            )}
          </div>

          {!loading && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12, padding: '7px 10px', background: CREAM, border: `2px solid ${DARK}` }}>
              {[
                { dot: GREEN,                 label: 'Disponible'    },
                { dot: RED,                   label: 'Occupée'       },
                { dot: 'rgba(43,33,24,0.18)', label: 'Capac. insuf.' },
              ].map(s => (
                <span key={s.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 900, color: DARK, textTransform: 'uppercase' }}>
                  <span style={{ width: 8, height: 8, background: s.dot, flexShrink: 0 }} />
                  {s.label}
                </span>
              ))}
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0', fontSize: 11, fontWeight: 900, color: DARK, textTransform: 'uppercase' }}>
              Chargement…
            </div>
          ) : sortedTables.length === 0 ? (
            <p style={{ fontSize: 13, fontWeight: 900, color: DARK, textAlign: 'center', padding: '32px 0', textTransform: 'uppercase' }}>
              Aucune table active configurée.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {sortedTables.map(table => {
                const state       = tableState(table)
                const cfg         = stateConfig[state]
                const locStyle    = LOC_COLORS[table.location] ?? { bg: '#f5f5f5', color: '#666' }
                const isClickable = state === 'available' || state === 'current' || state === 'selected'
                const isDisabled  = state === 'busy' || state === 'insufficient'

                return (
                  <div
                    key={table.idx}
                    onClick={() => {
                      if (!isClickable) return
                      setError(null)
                      setSelected(selected === table.idx ? null : table.idx)
                    }}
                    style={{
                      position: 'relative', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', padding: '10px 14px',
                      cursor: cfg.cursor, background: cfg.background,
                      border: `2px solid ${DARK}`,
                      borderLeft: `6px solid ${state === 'selected' ? GOLD : cfg.border}`,
                    }}
                  >
                    {/* Left */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, flexShrink: 0, background: cfg.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isDisabled ? 0.7 : 1, fontSize: 10, fontWeight: 900, color: cfg.iconColor }}>
                        {state === 'busy' ? '!' : 'T'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: cfg.textColor }}>
                            Table {table.number}
                          </p>
                          {cfg.badge && (
                            <span style={{ fontSize: 9, fontWeight: 900, padding: '1px 6px', background: cfg.badge.bg, color: cfg.badge.color, textTransform: 'uppercase' }}>
                              {cfg.badge.text}
                            </span>
                          )}
                        </div>
                        {state === 'busy' && (
                          <p style={{ margin: '2px 0 0', fontSize: 10, fontWeight: 900, color: RED, textTransform: 'uppercase' }}>
                            Déjà assignée
                          </p>
                        )}
                        {state === 'insufficient' && (
                          <p style={{ margin: '2px 0 0', fontSize: 10, fontWeight: 900, color: 'rgba(43,33,24,0.4)' }}>
                            Max {table.capacity}P · Besoin {guestCount}P
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, opacity: isDisabled ? 0.5 : 1 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', background: cfg.capacityBg, fontSize: 10, fontWeight: 900, color: cfg.capacityColor }}>
                        {table.capacity}P
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', background: locStyle.bg, fontSize: 10, fontWeight: 900, color: locStyle.color }}>
                        {table.location}
                      </span>
                      {state === 'selected' && (
                        <div style={{ padding: '2px 7px', background: GOLD, fontSize: 10, fontWeight: 900, color: DARK }}>
                          OK
                        </div>
                      )}
                    </div>

                    {/* Stripe overlays */}
                    {state === 'busy' && (
                      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(220,38,38,0.05) 5px, rgba(220,38,38,0.05) 10px)` }} />
                    )}
                    {state === 'insufficient' && (
                      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(0,0,0,0.03) 5px, rgba(0,0,0,0.03) 10px)` }} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 22px', borderTop: `2px solid ${DARK}`, background: CREAM, display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: '11px', background: '#fff', border: `2px solid ${DARK}`, fontSize: 12, fontWeight: 900, color: DARK, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase' }}
          >
            Annuler
          </button>
          <button
            onClick={handleAssign}
            disabled={saving || !hasChanged}
            style={{ flex: 2, padding: '11px', background: DARK, border: `2px solid ${DARK}`, fontSize: 13, fontWeight: 900, color: GOLD, cursor: saving || !hasChanged ? 'not-allowed' : 'pointer', opacity: saving || !hasChanged ? 0.5 : 1, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textTransform: 'uppercase' }}
          >
            {saving ? 'Enregistrement…' : selected === null ? 'Retirer la table' : 'Confirmer'}
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}