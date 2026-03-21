import { useState, useEffect } from 'react'
import {
  ChevronLeft, ChevronRight, LayoutGrid,
  Users, MapPin, Clock, CalendarDays,
} from 'lucide-react'
import useTablesTimeline from '../../hooks/Tables/useTablesTimeline'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const CREAM     = '#faf8f5'
const BORDER    = 'rgba(43,33,24,0.10)'

const HOUR_START = 11
const HOUR_END   = 24
const HOURS      = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i)

const STATUS_BLOCK = {
  Confirmed: { bg: '#1a6e42', border: '#22c55e' },
  Pending:   { bg: '#7a5c1e', border: '#c8a97e' },
}

const LOC_COLORS = {
  'Intérieur':   { bg: '#f0f4ff', color: '#3b5bdb' },
  'Terrasse':    { bg: '#f0fdf4', color: '#16a34a' },
  'Bar':         { bg: '#fdf6ec', color: '#a8834e' },
  'Salon privé': { bg: '#fdf0f0', color: '#b94040' },
}

function toDecimal(time) {
  if (!time) return null
  const [h, m] = time.split(':').map(Number)
  return h + (m || 0) / 60
}

function blockPosition(startTime, endTime) {
  const start = toDecimal(startTime)
  if (start === null) return null
  const end        = toDecimal(endTime) ?? (start + 2)
  const totalHours = HOUR_END - HOUR_START
  const left       = ((start - HOUR_START) / totalHours) * 100
  const width      = ((end - start) / totalHours) * 100
  return {
    left:  Math.max(0, Math.min(left, 100)).toFixed(2) + '%',
    width: Math.max(1, Math.min(width, 100 - parseFloat(left))).toFixed(2) + '%',
  }
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

function offsetDate(iso, days) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

// ── Reservation block ──────────────────────────────────────────────

function ResBlock({ res }) {
  const [hov, setHov] = useState(false)
  const pos    = blockPosition(res.start_time, res.end_time)
  if (!pos) return null
  const scheme = STATUS_BLOCK[res.status] ?? STATUS_BLOCK.Pending

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'absolute',
        left: pos.left, width: pos.width,
        top: '50%', transform: 'translateY(-50%)',
        height: hov ? 32 : 26,
        background: scheme.bg,
        borderLeft: `3px solid ${scheme.border}`,
        display: 'flex', alignItems: 'center',
        padding: '0 8px', overflow: 'hidden',
        cursor: 'default',
        transition: 'height 0.12s ease, box-shadow 0.12s ease',
        zIndex: hov ? 10 : 1,
        boxShadow: hov ? `0 4px 14px rgba(0,0,0,0.25)` : '0 1px 3px rgba(0,0,0,0.15)',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {res.customer_name}
      </span>
      <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.55)', marginLeft: 5, flexShrink: 0 }}>
        {res.start_time}{res.end_time ? `–${res.end_time}` : ''}{res.guests ? ` · ${res.guests}p` : ''}
      </span>
    </div>
  )
}

// ── Table row ──────────────────────────────────────────────────────

function TimelineRow({ row, isLast }) {
  const locStyle = LOC_COLORS[row.location] ?? { bg: '#f5f5f5', color: '#666' }
  const hasRes   = row.reservations.length > 0

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '160px 1fr',
      borderBottom: isLast ? 'none' : `1px solid ${BORDER}`,
      minHeight: 54,
    }}>

      {/* Info cell */}
      <div style={{
        padding: '10px 14px',
        borderRight: `1px solid rgba(43,33,24,0.15)`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        background: hasRes ? CREAM : '#fff',
        flexShrink: 0, gap: 6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <LayoutGrid size={12} color={hasRes ? GOLD_DARK : 'rgba(43,33,24,0.3)'} strokeWidth={2.5} />
          <span style={{ fontSize: 13, fontWeight: 900, color: DARK, letterSpacing: '-0.3px' }}>
            {row.table_name}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            padding: '2px 6px', background: '#fdf6ec',
            fontSize: 9, fontWeight: 800, color: GOLD_DARK,
          }}>
            <Users size={8} strokeWidth={2.5} />
            {row.capacity} 
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            padding: '2px 6px', background: locStyle.bg,
            fontSize: 9, fontWeight: 700, color: locStyle.color,
          }}>
            <MapPin size={8} strokeWidth={2.5} />
            {row.location}
          </span>
        </div>
      </div>

      {/* Timeline track */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: hasRes ? '#fff' : '#fafaf9',
      }}>
        {/* Hour grid lines */}
        {HOURS.map((h, i) => (
          <div key={h} style={{
            position: 'absolute',
            left: `${(i / (HOUR_END - HOUR_START)) * 100}%`,
            top: 0, bottom: 0, width: 1,
            background: i === 0 ? 'transparent' : 'rgba(43,33,24,0.06)',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Current time indicator */}
        {(() => {
          const now = new Date()
          const dec = now.getHours() + now.getMinutes() / 60
          if (dec < HOUR_START || dec > HOUR_END) return null
          const left = ((dec - HOUR_START) / (HOUR_END - HOUR_START)) * 100
          return (
            <div style={{
              position: 'absolute', left: `${left}%`,
              top: 0, bottom: 0, width: 2,
              background: '#ef4444', zIndex: 5, pointerEvents: 'none',
            }} />
          )
        })()}

        {/* Free label */}
        {!hasRes && (
          <span style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            fontSize: 9, fontWeight: 800,
            color: 'rgba(43,33,24,0.12)',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            pointerEvents: 'none', userSelect: 'none',
          }}>
            disponible
          </span>
        )}

        {/* Blocks */}
        {row.reservations.map(res => (
          <ResBlock key={res.id} res={res} />
        ))}
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────

export default function TableTimeline({ controlledDate = null }) {
  const { timeline, loading, error, date, setDate } = useTablesTimeline()
  const isControlled = !!controlledDate

  // Sync when Calendar controls the date
  useEffect(() => {
    if (controlledDate && controlledDate !== date) {
      setDate(controlledDate)
    }
  }, [controlledDate]) // eslint-disable-line

  const today    = new Date().toISOString().slice(0, 10)
  const occupied = timeline.filter(t => t.reservations.length > 0).length
  const free     = timeline.length - occupied

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif", marginTop: 24 }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* ── Header ── */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10, marginBottom: 14, flexWrap: 'wrap',
      }}>

        {/* Left: title + stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 14px', background: DARK,
          }}>
            <LayoutGrid size={13} color={GOLD} strokeWidth={2.5} />
            <span style={{ fontSize: 12, fontWeight: 900, color: '#fff', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
              Occupation des tables
            </span>
            {isControlled && (
              <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(200,169,126,0.6)', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                · {formatDate(date)}
              </span>
            )}
          </div>

          {!loading && timeline.length > 0 && (
            <>
              <span style={{
                padding: '5px 10px',
                background: occupied > 0 ? '#1a6e42' : CREAM,
                border: `1px solid ${occupied > 0 ? '#22c55e40' : BORDER}`,
                fontSize: 11, fontWeight: 900,
                color: occupied > 0 ? '#4ade80' : 'rgba(43,33,24,0.35)',
              }}>
                {occupied} occupée{occupied !== 1 ? 's' : ''}
              </span>
              <span style={{
                padding: '5px 10px',
                background: CREAM, border: `1px solid ${BORDER}`,
                fontSize: 11, fontWeight: 900, color: 'rgba(43,33,24,0.4)',
              }}>
                {free} libre{free !== 1 ? 's' : ''}
              </span>
            </>
          )}
        </div>

        {/* Right: date nav — standalone only */}
        {!isControlled && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={() => setDate(offsetDate(date, -1))}
              style={{
                width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#fff', border: `2px solid ${DARK}`, cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = CREAM}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <ChevronLeft size={15} strokeWidth={2.5} color={DARK} />
            </button>

            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '6px 12px', background: '#fff',
              border: `2px solid ${DARK}`,
            }}>
              <CalendarDays size={12} color={GOLD} strokeWidth={2.5} />
              <span style={{ fontSize: 12, fontWeight: 900, color: DARK, whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
                {formatDate(date)}
              </span>
            </div>

            <button
              onClick={() => setDate(offsetDate(date, 1))}
              style={{
                width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#fff', border: `2px solid ${DARK}`, cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = CREAM}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <ChevronRight size={15} strokeWidth={2.5} color={DARK} />
            </button>

            {date !== today && (
              <button
                onClick={() => setDate(today)}
                style={{
                  padding: '6px 12px', background: GOLD, border: 'none',
                  fontSize: 11, fontWeight: 900, color: DARK,
                  cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => e.currentTarget.style.background = GOLD_DARK}
                onMouseLeave={e => e.currentTarget.style.background = GOLD}
              >
                Aujourd'hui
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fdf0f0', borderLeft: '3px solid #b94040', fontSize: 12, fontWeight: 700, color: '#b94040' }}>
          {error}
        </div>
      )}

      {/* ── Grid ── */}
      <div style={{ border: `2px solid ${DARK}`, overflow: 'hidden' }}>

        {/* Hour header */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', background: DARK }}>
          <div style={{
            padding: '9px 14px',
            borderRight: `1px solid rgba(200,169,126,0.15)`,
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <Clock size={11} color={GOLD} strokeWidth={2.5} />
            <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Table
            </span>
          </div>
          <div style={{ position: 'relative', height: 34 }}>
            {HOURS.map((h, i) => {
              const nowH = new Date().getHours()
              const isNow = nowH === h
              return (
                <div key={h} style={{
                  position: 'absolute',
                  left: `${(i / (HOUR_END - HOUR_START)) * 100}%`,
                  top: 0, bottom: 0,
                  display: 'flex', alignItems: 'center', paddingLeft: 5,
                  borderLeft: i > 0 ? '1px solid rgba(200,169,126,0.1)' : 'none',
                }}>
                  <span style={{
                    fontSize: 9, fontWeight: isNow ? 900 : 700,
                    color: isNow ? '#ef4444' : 'rgba(200,169,126,0.6)',
                    whiteSpace: 'nowrap',
                  }}>
                    {String(h % 24).padStart(2, '0')}h
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ padding: '52px 0', textAlign: 'center', background: '#fff' }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              border: `2.5px solid ${BORDER}`, borderTopColor: GOLD,
              animation: 'spin 0.8s linear infinite', margin: '0 auto 10px',
            }} />
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'rgba(43,33,24,0.3)' }}>
              Chargement…
            </p>
          </div>
        )}

        {/* No tables */}
        {!loading && timeline.length === 0 && (
          <div style={{ padding: '52px 24px', textAlign: 'center', background: '#fff' }}>
            <LayoutGrid size={32} color={DARK} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 12px', opacity: 0.2 }} />
            <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 900, color: DARK }}>Aucune table active</p>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'rgba(43,33,24,0.4)' }}>
              Configurez vos tables dans la section Tables.
            </p>
          </div>
        )}

        {/* Rows */}
        {!loading && timeline.map((row, i) => (
          <TimelineRow
            key={row.table_id}
            row={row}
            isLast={i === timeline.length - 1}
          />
        ))}
      </div>

      {/* Legend */}
      {!loading && timeline.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 14, flexWrap: 'wrap',
          marginTop: 8, padding: '8px 14px',
          background: CREAM, border: `1px solid ${BORDER}`,
        }}>
          <span style={{ fontSize: 9, fontWeight: 900, color: DARK, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Légende
          </span>
          {[
            { bg: '#1a6e42', border: '#22c55e', label: 'Confirmée'  },
            { bg: '#7a5c1e', border: '#c8a97e', label: 'En attente' },
          ].map(s => (
            <span key={s.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: DARK }}>
              <span style={{ width: 14, height: 11, background: s.bg, borderLeft: `3px solid ${s.border}`, flexShrink: 0 }} />
              {s.label}
            </span>
          ))}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: DARK }}>
            <span style={{ width: 2, height: 14, background: '#ef4444', flexShrink: 0 }} />
            Maintenant
          </span>
        </div>
      )}
    </div>
  )
}