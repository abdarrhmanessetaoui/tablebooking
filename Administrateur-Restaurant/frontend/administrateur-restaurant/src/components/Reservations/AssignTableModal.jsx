import { useState, useEffect } from 'react'
import { X, LayoutGrid, Users, MapPin, Check, Loader } from 'lucide-react'
import { getToken } from '../../utils/auth'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const BORDER    = 'rgba(43,33,24,0.12)'
const CREAM     = '#faf8f5'

const BASE = 'http://localhost:8000/api'

const LOC_COLORS = {
  'Intérieur':   { bg: '#f0f4ff', color: '#3b5bdb' },
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

  const headers = () => ({
    'Content-Type':  'application/json',
    'Accept':        'application/json',
    'Authorization': `Bearer ${getToken()}`,
  })

  useEffect(() => {
    fetch(`${BASE}/tables`, { headers: headers() })
      .then(r => r.json())
      .then(d => setTables(Array.isArray(d) ? d.filter(t => t.active) : []))
      .catch(() => setError('Impossible de charger les tables.'))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line

  async function handleAssign() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(
        `${BASE}/restaurant/reservations/${reservation.id}/assign-table`,
        {
          method:  'PATCH',
          headers: headers(),
          body:    JSON.stringify({ table_idx: selected }),
        }
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? `HTTP ${res.status}`)
      }
      const updated = await res.json()
      onAssigned(updated)
      onClose()
    } catch (e) {
      setError(e.message ?? "Erreur lors de l'assignation.")
    } finally {
      setSaving(false)
    }
  }

  function isSuitable(table) {
    return parseInt(table.capacity) >= parseInt(reservation?.guests ?? 1)
  }

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
        background: '#fff', width: '100%', maxWidth: 440,
        maxHeight: '88vh', overflow: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Header */}
        <div style={{
          background: DARK, padding: '18px 22px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <p style={{
              margin: 0, fontSize: 9, fontWeight: 700, color: GOLD,
              letterSpacing: '0.18em', textTransform: 'uppercase',
            }}>
              Assigner une table
            </p>
            <h2 style={{
              margin: '3px 0 0', fontSize: 17, fontWeight: 900,
              color: '#fff', letterSpacing: '-0.4px',
            }}>
              {reservation?.name ?? '—'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none',
              width: 32, height: 32, display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <X size={16} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        {/* Reservation summary */}
        <div style={{
          background: CREAM, padding: '12px 22px',
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex', gap: 20, flexShrink: 0,
        }}>
          {[
            ['Date',     reservation?.date       ?? '—'],
            ['Heure',    reservation?.start_time ?? '—'],
            ['Couverts', reservation?.guests     ?? '—'],
          ].map(([label, val]) => (
            <div key={label}>
              <p style={{
                margin: 0, fontSize: 9, fontWeight: 900, color: GOLD,
                letterSpacing: '0.14em', textTransform: 'uppercase',
              }}>
                {label}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 900, color: DARK }}>
                {val}
              </p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            margin: '12px 22px 0', padding: '10px 14px',
            background: '#fdf0f0', borderLeft: '3px solid #b94040',
            fontSize: 12, fontWeight: 700, color: '#b94040',
          }}>
            {error}
          </div>
        )}

        {/* Table list */}
        <div style={{ padding: '16px 22px', flex: 1 }}>

          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginBottom: 10,
          }}>
            <p style={{
              margin: 0, fontSize: 9, fontWeight: 900, color: DARK,
              letterSpacing: '0.18em', textTransform: 'uppercase',
            }}>
              Tables disponibles
            </p>
            {reservation?.table_idx && (
              <button
                onClick={() => setSelected(null)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  fontSize: 11, fontWeight: 800, color: '#b94040',
                  textDecoration: 'underline', fontFamily: 'inherit',
                }}
              >
                Retirer la table
              </button>
            )}
          </div>

          {loading ? (
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', padding: '32px 0',
            }}>
              <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
              <Loader size={22} color={GOLD} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : tables.length === 0 ? (
            <p style={{
              fontSize: 13, fontWeight: 700, color: DARK,
              textAlign: 'center', padding: '32px 0',
            }}>
              Aucune table active configurée.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {tables.map(table => {
                const isSelected = selected === table.idx
                const suitable   = isSuitable(table)
                const locStyle   = LOC_COLORS[table.location] ?? { bg: '#f5f5f5', color: '#666' }

                return (
                  <div
                    key={table.idx}
                    onClick={() => setSelected(isSelected ? null : table.idx)}
                    style={{
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px', cursor: 'pointer',
                      background: isSelected ? DARK : '#fff',
                      border: `2px solid ${isSelected ? DARK : BORDER}`,
                      borderLeft: `4px solid ${isSelected ? GOLD : suitable ? '#16a34a' : '#e8e0d8'}`,
                      transition: 'all 0.12s',
                      opacity: (!suitable && !isSelected) ? 0.55 : 1,
                    }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = CREAM }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = '#fff' }}
                  >
                    {/* Left */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 32, height: 32, flexShrink: 0,
                        background: isSelected ? 'rgba(200,169,126,0.15)' : '#f5f0eb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <LayoutGrid size={15} color={isSelected ? GOLD : DARK} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p style={{
                          margin: 0, fontSize: 14, fontWeight: 900,
                          color: isSelected ? '#fff' : DARK,
                          letterSpacing: '-0.3px',
                        }}>
                          Table {table.number}
                        </p>
                        {!suitable && (
                          <p style={{ margin: '1px 0 0', fontSize: 10, fontWeight: 700, color: '#b94040' }}>
                            Capacité insuffisante
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '3px 8px',
                        background: isSelected ? 'rgba(200,169,126,0.15)' : '#fdf6ec',
                        fontSize: 11, fontWeight: 800,
                        color: isSelected ? GOLD : GOLD_DARK,
                      }}>
                        <Users size={10} strokeWidth={2.5} />
                        {table.capacity}
                      </span>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '3px 8px',
                        background: isSelected ? 'rgba(200,169,126,0.1)' : locStyle.bg,
                        fontSize: 11, fontWeight: 700,
                        color: isSelected ? 'rgba(200,169,126,0.8)' : locStyle.color,
                      }}>
                        <MapPin size={10} strokeWidth={2.5} />
                        {table.location}
                      </span>
                      {isSelected && (
                        <div style={{
                          width: 22, height: 22, background: GOLD,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Check size={12} color={DARK} strokeWidth={3} />
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
        <div style={{
          padding: '14px 22px', borderTop: `2px solid ${BORDER}`,
          background: CREAM, display: 'flex', gap: 8, flexShrink: 0,
        }}>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: '12px', background: '#fff',
              border: `2px solid ${DARK}`, fontSize: 13, fontWeight: 800,
              color: DARK, cursor: 'pointer', fontFamily: 'inherit',
            }}
            onMouseEnter={e => e.currentTarget.style.background = CREAM}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            Annuler
          </button>
          <button
            onClick={handleAssign}
            disabled={saving || selected === reservation?.table_idx}
            style={{
              flex: 2, padding: '12px', background: DARK, border: 'none',
              fontSize: 13, fontWeight: 800, color: GOLD,
              cursor: saving || selected === reservation?.table_idx ? 'not-allowed' : 'pointer',
              opacity: saving || selected === reservation?.table_idx ? 0.5 : 1,
              fontFamily: 'inherit', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8, transition: 'opacity 0.15s',
            }}
          >
            {saving ? (
              <>
                <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                Enregistrement…
              </>
            ) : selected === null ? (
              'Retirer la table'
            ) : (
              <>
                <Check size={14} strokeWidth={2.5} />
                Confirmer l'assignation
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}