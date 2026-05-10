import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { X, LayoutGrid, Users, MapPin, Check, AlertTriangle, Clock } from 'lucide-react'
import { ThreeDot } from 'react-loading-indicators'
import { apiPath, getHeaders } from '../../utils/api'
import { GREEN, RED } from '../../styles/dashboard/tokens'

const DARK      = '#2D2926'
const LIGHT_BROWN      = '#C19A6B'
const BORDER    = '#E5E0DA'
const CREAM     = '#ffffff'

const LOC_COLORS = {
  'Intérieur':   { bg: '#eef2ff', color: '#4f6ef7' },
  'Terrasse':    { bg: '#f0fdf4', color: '#16a34a' },
  'Bar':         { bg: '#ffffff', color: '#a8834e' },
  'Salon privé': { bg: '#ffffff', color: '#DC2626' },
}

export default function AssignTableModal({ reservation, onClose, onAssigned }) {
  const { t } = useTranslation()
  const [tables,   setTables]   = useState([])
  const [busyIdxs, setBusyIdxs] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState(null)
  const [selected, setSelected] = useState(reservation?.table_idx ?? null)

  const guestCount = parseInt(reservation?.guests ?? 1)


  useEffect(() => {
    const params = new URLSearchParams({
      date:       reservation?.date       ?? '',
      start_time: reservation?.start_time ?? '',
      ...(reservation?.end_time ? { end_time: reservation.end_time } : {}),
      exclude_id: reservation?.id ?? 0,
    })

    Promise.all([
      fetch(apiPath('tables'),               { headers: getHeaders() }).then(r => r.json()),
      fetch(apiPath(`tables/busy?${params}`), { headers: getHeaders() }).then(r => r.json()),
    ])
      .then(([tableData, busyData]) => {
        setTables(Array.isArray(tableData) ? tableData.filter(t => t.active) : [])
        setBusyIdxs(Array.isArray(busyData) ? busyData : [])
      })
      .catch(() => setError(t('impossible_load_tables')))
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
      iconBg:        '#ffffff',
      iconColor:     RED,
      textColor:     'rgba(66,52,40,0.45)',
      badge:         { bg: RED, color: '#fff', text: t('busy') },
      capacityBg:    '#ffffff',
      capacityColor: RED,
    },
    insufficient: {
      border:        'rgba(66,52,40,0.1)',
      background:    '#fafafa',
      cursor:        'not-allowed',
      iconBg:        '#f0f0f0',
      iconColor:     'rgba(66,52,40,0.25)',
      textColor:     'rgba(66,52,40,0.35)',
      badge:         { bg: '#e5e7eb', color: '#9ca3af', text: t('insufficient') },
      capacityBg:    '#ffffff',
      capacityColor: RED,
    },
    selected: {
      border:        LIGHT_BROWN,
      background:    LIGHT_BROWN,
      cursor:        'pointer',
      iconBg:        'rgba(200,169,126,0.08)',
      iconColor:     LIGHT_BROWN,
      textColor:     '#fff',
      capacityBg:    'rgba(200,169,126,0.08)',
      capacityColor: LIGHT_BROWN,
    },
    current: {
      border:        GREEN,
      background:    '#f0fdf4',
      cursor:        'pointer',
      iconBg:        '#dcfce7',
      iconColor:     GREEN,
      textColor:     DARK,
      badge:         { bg: GREEN, color: '#fff', text: t('current') },
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
        apiPath(`restaurant/reservations/${reservation.id}/assign-table`),
        { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ table_idx: selected }) }
      )
      const data = await res.json()
      if (!res.ok) { setError(data.message ?? `Error ${res.status}`); return }
      onAssigned(data)
      onClose()
    } catch {
      setError(t('error_connection_retry'))
    } finally {
      setSaving(false)
    }
  }

  const hasChanged = selected !== reservation?.table_idx

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(66,52,40,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      
      <div style={{
        background: '#fff', width: '100%', maxWidth: 420,
        maxHeight: '88vh', overflow: 'auto',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 24px 64px rgba(66,52,40,0.35)',
        borderRadius: 12, overflow: 'hidden',
      }}>

        {/* Header */}
        <div style={{
          background: LIGHT_BROWN, padding: '18px 22px', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ margin: '3px 0 0', fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '-0.4px' }}>
              {reservation?.name ?? ' '}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: GOLD, border: 'none', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 10, fontWeight: 900, color: DARK, textTransform: 'uppercase' }}>
            Fermer
          </button>
        </div>


        {/* Error */}
        {error && (
          <div style={{ margin: '10px 22px 0', padding: '10px 12px', background: '#ffffff', borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED, display: 'flex', alignItems: 'center', gap: 8 }}>
            {error}
          </div>
        )}

        {/* Table list */}
        <div style={{ padding: '14px 22px', flex: 1 }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10 }}>
            {reservation?.table_idx && (
              <button onClick={() => setSelected(null)} style={{ 
                background: 'rgba(239, 68, 68, 0.08)', border: 'none', 
                cursor: 'pointer', padding: '6px 10px', 
                fontSize: 10, fontWeight: 900, color: RED, 
                textTransform: 'uppercase', letterSpacing: '0.05em', 
                borderRadius: 8, fontFamily: 'inherit' 
              }}>
                {t('remove_table')}
              </button>
            )}
          </div>


          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 0', fontSize: 10, fontWeight: 900, color: 'rgba(66,52,40,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {t('calendar.loading_tables')}
            </div>
          ) : sortedTables.length === 0 ? (
            <p style={{ fontSize: 13, fontWeight: 700, color: DARK, textAlign: 'center', padding: '32px 0' }}>
              {t('no_active_tables_found')}
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
                      justifyContent: 'space-between', padding: '12px 14px',
                      cursor: cfg.cursor, background: cfg.background,
                      borderBottom: `1px solid ${BORDER}`,
                      transition: 'all 0.12s',
                      filter: isDisabled ? 'grayscale(0.2)' : 'none',
                    }}
                  >
                    {/* Left */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: cfg.textColor }}>
                            {t('table_number', { number: table.number })}
                          </p>
                          {cfg.badge && (
                            <span style={{ fontSize: 9, fontWeight: 900, padding: '1px 6px', background: cfg.badge.bg, color: cfg.badge.color, textTransform: 'uppercase' }}>
                              {cfg.badge.text}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, opacity: isDisabled ? 0.5 : 1 }}>
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
        <div style={{ padding: '16px 22px', background: CREAM, display: 'flex', gap: 10, flexShrink: 0 }}>
          <button onClick={onClose}
            style={{ 
              flex: 1, padding: '14px', background: '#f5f0eb', border: 'none', 
              fontSize: 12, fontWeight: 900, color: '#888', 
              cursor: 'pointer', borderRadius: 8, textTransform: 'uppercase', letterSpacing: '0.05em' 
            }}
          >
            {t('cancel_btn')}
          </button>
          <button
            onClick={handleAssign}
            disabled={saving || !hasChanged}
            style={{ 
              flex: 2, padding: '14px', 
              background: saving || !hasChanged 
                ? '#D1D5DB' 
                : (selected === null ? RED : LIGHT_BROWN), 
              border: 'none', 
              fontSize: 12, fontWeight: 900, color: '#ffffff', 
              cursor: saving || !hasChanged ? 'not-allowed' : 'pointer', 
              borderRadius: 12,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              transition: 'none' 
            }}
          >
            {saving ? (
              t('calendar.registering')
            ) : selected === null ? (
              t('remove_table')
            ) : (
              t('confirm_btn')
            )}
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}
