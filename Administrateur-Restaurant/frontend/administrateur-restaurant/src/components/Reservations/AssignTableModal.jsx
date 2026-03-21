import { useState, useEffect } from 'react'
import { X, LayoutGrid, Users, MapPin, Check, Loader, AlertTriangle } from 'lucide-react'
import { getToken } from '../../utils/auth'
import { GREEN, RED } from '../../styles/dashboard/tokens'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const BORDER    = 'rgba(43,33,24,0.12)'
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
    fetch(`${BASE}/tables`, { headers: hdrs() })
      .then(r => r.json())
      .then(d => setTables(Array.isArray(d) ? d.filter(t => t.active) : []))
      .catch(() => setError('Impossible de charger les tables.'))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line

  // ── Sort: sufficient capacity first, then by number ──────────────
  const sortedTables = [...tables].sort((a, b) => {
    const aOk = parseInt(a.capacity) >= guestCount
    const bOk = parseInt(b.capacity) >= guestCount
    if (aOk && !bOk) return -1
    if (!aOk && bOk) return 1
    return String(a.number).localeCompare(String(b.number))
  })

  async function handleAssign() {
    if (selected !== null) {
      const table = tables.find(t => t.idx === selected)
      if (table && parseInt(table.capacity) < guestCount) {
        setError(`La table ${table.number} ne peut accueillir que ${table.capacity} personnes pour ${guestCount} invités.`)
        return
      }
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(
        `${BASE}/restaurant/reservations/${reservation.id}/assign-table`,
        { method: 'PATCH', headers: hdrs(), body: JSON.stringify({ table_idx: selected }) }
      )
      const data = await res.json()
  
      if (!res.ok) {
        // ── Show backend conflict message directly ─────────────────
        setError(data.message ?? `Erreur ${res.status}`)
        return
      }
  
      onAssigned(data)
      onClose()
    } catch (e) {
      setError("Erreur de connexion. Veuillez réessayer.")
    } finally {
      setSaving(false)
    }
  }

  const hasChanged = selected !== reservation?.table_idx

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(43,33,24,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', width: '100%', maxWidth: 420,
        maxHeight: '88vh', overflow: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{ background: DARK, padding: '18px 22px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Assigner une table
            </p>
            <h2 style={{ margin: '3px 0 0', fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '-0.4px' }}>
              {reservation?.name ?? '—'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        {/* Reservation summary */}
        <div style={{ background: CREAM, padding: '10px 22px', borderBottom: `1px solid ${BORDER}`, display: 'flex', gap: 20, flexShrink: 0 }}>
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
          <div style={{ margin: '10px 22px 0', padding: '10px 12px', background: '#fdf0f0', borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={14} strokeWidth={2.5} />
            {error}
          </div>
        )}

        {/* Table list */}
        <div style={{ padding: '14px 22px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: DARK, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Tables disponibles
            </p>
            {reservation?.table_idx && (
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 11, fontWeight: 800, color: RED, textDecoration: 'underline', fontFamily: 'inherit' }}>
                Retirer la table
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
              <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
              <Loader size={22} color={GOLD} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : sortedTables.length === 0 ? (
            <p style={{ fontSize: 13, fontWeight: 700, color: DARK, textAlign: 'center', padding: '32px 0' }}>
              Aucune table active configurée.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {sortedTables.map(table => {
                const isSelected   = selected === table.idx
                const sufficient   = parseInt(table.capacity) >= guestCount
                const locStyle     = LOC_COLORS[table.location] ?? { bg: '#f5f5f5', color: '#666' }
                const isCurrently  = reservation?.table_idx === table.idx

                return (
                  <div
                    key={table.idx}
                    onClick={() => {
                      // ── Block insufficient capacity ──────────────
                      if (!sufficient) {
                        setError(`Table ${table.number} : capacité ${table.capacity} insuffisante pour ${guestCount} personne${guestCount > 1 ? 's' : ''}.`)
                        return
                      }
                      setError(null)
                      setSelected(isSelected ? null : table.idx)
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '11px 14px',
                      cursor: sufficient ? 'pointer' : 'not-allowed',
                      background: isSelected ? DARK : '#fff',
                      border: `1.5px solid ${isSelected ? DARK : sufficient ? BORDER : '#fecaca'}`,
                      borderLeft: `4px solid ${isSelected ? GOLD : sufficient ? GREEN : RED}`,
                      opacity: sufficient ? 1 : 0.6,
                      transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { if (sufficient && !isSelected) e.currentTarget.style.background = CREAM }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = '#fff' }}
                  >
                    {/* Left */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, flexShrink: 0, background: isSelected ? 'rgba(200,169,126,0.15)' : sufficient ? '#f5f0eb' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LayoutGrid size={14} color={isSelected ? GOLD : sufficient ? DARK : RED} strokeWidth={2.5} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: isSelected ? '#fff' : DARK }}>
                            Table {table.number}
                          </p>
                          {isCurrently && (
                            <span style={{ fontSize: 9, fontWeight: 900, padding: '1px 6px', background: GOLD, color: DARK }}>
                              ACTUELLE
                            </span>
                          )}
                        </div>
                        {!sufficient && (
                          <p style={{ margin: '2px 0 0', fontSize: 10, fontWeight: 700, color: RED, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <AlertTriangle size={10} strokeWidth={2.5} />
                            Capacité insuffisante
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: tags + check */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', background: isSelected ? 'rgba(200,169,126,0.15)' : sufficient ? '#f0fdf4' : '#fef2f2', fontSize: 10, fontWeight: 800, color: isSelected ? GOLD : sufficient ? '#16a34a' : RED }}>
                        <Users size={9} strokeWidth={2.5} />
                        {table.capacity}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', background: isSelected ? 'rgba(200,169,126,0.1)' : locStyle.bg, fontSize: 10, fontWeight: 700, color: isSelected ? 'rgba(200,169,126,0.8)' : locStyle.color }}>
                        <MapPin size={9} strokeWidth={2.5} />
                        {table.location}
                      </span>
                      {isSelected && (
                        <div style={{ width: 20, height: 20, background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={11} color={DARK} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 22px', borderTop: `2px solid ${BORDER}`, background: CREAM, display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', background: '#fff', border: `2px solid ${DARK}`, fontSize: 13, fontWeight: 800, color: DARK, cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={e => e.currentTarget.style.background = CREAM}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            Annuler
          </button>
          <button
            onClick={handleAssign}
            disabled={saving || !hasChanged}
            style={{ flex: 2, padding: '11px', background: DARK, border: 'none', fontSize: 13, fontWeight: 800, color: GOLD, cursor: saving || !hasChanged ? 'not-allowed' : 'pointer', opacity: saving || !hasChanged ? 0.5 : 1, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.15s' }}
          >
            {saving ? (
              <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />Enregistrement…</>
            ) : selected === null ? 'Retirer la table' : (
              <><Check size={14} strokeWidth={2.5} />Confirmer</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}