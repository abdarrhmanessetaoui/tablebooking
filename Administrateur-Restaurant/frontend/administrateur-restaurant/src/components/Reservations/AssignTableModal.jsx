import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { X, LayoutGrid, Users, MapPin, Check, Loader, AlertTriangle, Clock } from 'lucide-react'
import { getToken } from '../../utils/auth'
import { GREEN, RED } from '../../styles/dashboard/tokens'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const BORDER    = 'rgba(43,33,24,0.12)'
const CREAM     = '#ffffff'
const BASE      = 'http://localhost:8000/api'

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
      textColor:     'rgba(43,33,24,0.45)',
      badge:         { bg: RED, color: '#fff', text: t('busy') },
      capacityBg:    '#ffffff',
      capacityColor: RED,
    },
    insufficient: {
      border:        'rgba(43,33,24,0.1)',
      background:    '#fafafa',
      cursor:        'not-allowed',
      iconBg:        '#f0f0f0',
      iconColor:     'rgba(43,33,24,0.25)',
      textColor:     'rgba(43,33,24,0.35)',
      badge:         { bg: '#e5e7eb', color: '#9ca3af', text: t('insufficient') },
      capacityBg:    '#ffffff',
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
      badge:         { bg: GREEN, color: '#fff', text: t('current') },
      capacityBg:    '#dcfce7',
      capacityColor: '#16a34a',
    },
    available: {
      border:        BORDER,
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
    setSaving(true)
    setError(null)
    try {
      const res  = await fetch(
        `${BASE}/restaurant/reservations/${reservation.id}/assign-table`,
        { method: 'PATCH', headers: hdrs(), body: JSON.stringify({ table_idx: selected }) }
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
        background: 'rgba(43,33,24,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        fontFamily: "'Inter',system-ui,-apple-system,sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

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
              {t('assign_table')}
            </p>
            <h2 style={{ margin: '3px 0 0', fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '-0.4px' }}>
              {reservation?.name ?? '—'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color="#fff" strokeWidth={2.5} />
          </button>
        </div>

        {/* Summary */}
        <div style={{ background: CREAM, padding: '10px 22px', borderBottom: `1px solid ${BORDER}`, display: 'flex', gap: 20, flexShrink: 0 }}>
          {[
            [t('date'),     reservation?.date       ?? '—'],
            [t('time'),    reservation?.start_time ?? '—'],
            [t('pers_header'), `${guestCount} ${t(guestCount > 1 ? 'persons' : 'person')}`],
          ].map(([label, val]) => (
            <div key={label}>
              <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{label}</p>
              <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 900, color: DARK }}>{val}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ margin: '10px 22px 0', padding: '10px 12px', background: '#ffffff', borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={14} strokeWidth={2.5} />
            {error}
          </div>
        )}

        {/* Table list */}
        <div style={{ padding: '14px 22px', flex: 1 }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 900, color: DARK, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              {t('available_tables')}
            </p>
            {reservation?.table_idx && (
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 11, fontWeight: 800, color: RED, textDecoration: 'underline', fontFamily: 'inherit' }}>
                {t('remove_table')}
              </button>
            )}
          </div>

          {!loading && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12, padding: '7px 10px', background: CREAM, border: `1px solid ${BORDER}` }}>
              {[
                { dot: GREEN,                 label: t('available')    },
                { dot: RED,                   label: t('busy')       },
                { dot: 'rgba(43,33,24,0.18)', label: t('insufficient_capacity_short') },
              ].map(s => (
                <span key={s.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: DARK }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                  {s.label}
                </span>
              ))}
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
              <Loader size={22} color={GOLD} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : sortedTables.length === 0 ? (
            <p style={{ fontSize: 13, fontWeight: 700, color: DARK, textAlign: 'center', padding: '32px 0' }}>
              {t('no_active_tables_found')}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
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
                      border: `4px solid ${cfg.border}`,
                      borderLeft: `6px solid ${cfg.border}`,
                      transition: 'all 0.12s',
                      filter: isDisabled ? 'grayscale(0.2)' : 'none',
                    }}
                    onMouseEnter={e => { if (isClickable && state !== 'selected') e.currentTarget.style.background = CREAM }}
                    onMouseLeave={e => { if (state !== 'selected') e.currentTarget.style.background = cfg.background }}
                  >
                    {/* Left */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 30, height: 30, flexShrink: 0, background: cfg.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isDisabled ? 0.7 : 1 }}>
                        {state === 'busy'
                          ? <Clock size={14} color={RED} strokeWidth={2.5} />
                          : <LayoutGrid size={14} color={cfg.iconColor} strokeWidth={2.5} />
                        }
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: cfg.textColor }}>
                            {t('table_number', { number: table.number })}
                          </p>
                          {cfg.badge && (
                            <span style={{ fontSize: 9, fontWeight: 900, padding: '1px 6px', background: cfg.badge.bg, color: cfg.badge.color }}>
                              {cfg.badge.text}
                            </span>
                          )}
                        </div>
                        {state === 'busy' && (
                          <p style={{ margin: '2px 0 0', fontSize: 10, fontWeight: 700, color: RED }}>
                            {t('assigned_at_time')}
                          </p>
                        )}
                        {state === 'insufficient' && (
                          <p style={{ margin: '2px 0 0', fontSize: 10, fontWeight: 600, color: 'rgba(43,33,24,0.35)' }}>
                            {t('max_capacity_needed', { max: table.capacity, needed: guestCount })}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0, opacity: isDisabled ? 0.5 : 1 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', background: cfg.capacityBg, fontSize: 10, fontWeight: 800, color: cfg.capacityColor }}>
                        <Users size={9} strokeWidth={2.5} />
                        {table.capacity}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', background: state === 'selected' ? 'rgba(200,169,126,0.1)' : locStyle.bg, fontSize: 10, fontWeight: 700, color: state === 'selected' ? 'rgba(200,169,126,0.8)' : locStyle.color }}>
                        <MapPin size={9} strokeWidth={2.5} />
                        {table.location}
                      </span>
                      {state === 'selected' && (
                        <div style={{ width: 20, height: 20, background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Check size={11} color={DARK} strokeWidth={3} />
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
        <div style={{ padding: '12px 22px', borderTop: `4px solid ${BORDER}`, background: CREAM, display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: '11px', background: '#fff', border: `4px solid ${DARK}`, fontSize: 13, fontWeight: 800, color: DARK, cursor: 'pointer', fontFamily: 'inherit' }}
            onMouseEnter={e => e.currentTarget.style.background = CREAM}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            {t('cancel_btn')}
          </button>
          <button
            onClick={handleAssign}
            disabled={saving || !hasChanged}
            style={{ flex: 2, padding: '11px', background: DARK, border: 'none', fontSize: 13, fontWeight: 800, color: GOLD, cursor: saving || !hasChanged ? 'not-allowed' : 'pointer', opacity: saving || !hasChanged ? 0.5 : 1, fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.15s' }}
          >
            {saving ? (
              <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />{t('saving')}</>
            ) : selected === null ? (
              t('remove_table')
            ) : (
              <><Check size={14} strokeWidth={2.5} />{t('confirm_btn')}</>
            )}
          </button>
        </div>

      </div>
    </div>,
    document.body
  )
}