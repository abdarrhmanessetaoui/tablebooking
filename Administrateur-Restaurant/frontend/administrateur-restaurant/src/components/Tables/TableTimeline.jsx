import { useState, useEffect, useMemo } from 'react'
import {
  ChevronLeft, ChevronRight, LayoutGrid,
  Users, MapPin, Clock, CalendarDays,
} from 'lucide-react'
import useTablesTimeline from '../../hooks/Tables/useTablesTimeline'
import { GREEN, RED } from '../../styles/dashboard/tokens'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const CREAM     = '#faf8f5'
const BORDER    = 'rgba(43,33,24,0.10)'

const STATUS_BLOCK = {
  Confirmed: { bg: GREEN,    border: '#4ade80', text: '#fff' },
  Pending:   { bg: '#92400e', border: GOLD,     text: '#fff' },
}

const LOC_COLORS = {
  'Intérieur':   { bg: '#eef2ff', color: '#4f6ef7' },
  'Terrasse':    { bg: '#f0fdf4', color: '#16a34a' },
  'Bar':         { bg: '#fdf6ec', color: '#a8834e' },
  'Salon privé': { bg: '#fdf0f0', color: '#b94040' },
}

// ── Helpers ────────────────────────────────────────────────────────
function toDecimal(time) {
  if (!time) return null
  const [h, m] = time.split(':').map(Number)
  return h + (m || 0) / 60
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

// ── Compute open hours for a given date from allOH ────────────────
// Returns { hStart, hEnd } in decimal hours e.g. { hStart: 12, hEnd: 23 }
function getOpenHoursForDate(allOH, dateISO) {
  if (!allOH?.length || !dateISO) return { hStart: 10, hEnd: 24 }

  const dt     = new Date(dateISO + 'T00:00:00')
  const jsDay  = dt.getDay()                    // 0=Sun..6=Sat
  const appDay = jsDay === 0 ? 6 : jsDay - 1   // Mon=0..Sun=6

  // Collect all open/close times across all OH blocks for this day
  let minStart = Infinity
  let maxEnd   = -Infinity

  allOH.forEach(oh => {
    const slot = oh.openhours?.[appDay] ?? oh.openhours?.[0]
    if (!slot) return
    const h1 = parseInt(slot.h1 ?? 12)
    const m1 = parseInt(slot.m1 ?? 0)
    const h2 = parseInt(slot.h2 ?? 23)
    const m2 = parseInt(slot.m2 ?? 0)
    const start = h1 + m1 / 60
    const end   = h2 + m2 / 60
    if (start < minStart) minStart = start
    if (end   > maxEnd)   maxEnd   = end
  })

  if (!isFinite(minStart)) return { hStart: 10, hEnd: 24 }

  // Add 30min buffer on each side for visual breathing room
  return {
    hStart: Math.max(0,  Math.floor(minStart - 0.5)),
    hEnd:   Math.min(24, Math.ceil(maxEnd   + 0.5)),
  }
}

// ── Get service duration in hours ─────────────────────────────────
function getServiceDuration(services, serviceName) {
  const svc = services.find(s => s.name === serviceName)
  if (!svc?.duration) return 1.5 // default fallback
  return parseInt(svc.duration) / 60
}

// ── Block position on timeline ────────────────────────────────────
function blockPosition(startTime, endTime, HOUR_START, HOUR_END) {
  const start   = toDecimal(startTime)
  if (start === null) return null
  const end     = toDecimal(endTime) ?? (start + 1.5)
  const totalH  = HOUR_END - HOUR_START
  const left    = ((start - HOUR_START) / totalH) * 100
  const width   = ((end - start) / totalH) * 100
  return {
    left:  Math.max(0, Math.min(left, 100)).toFixed(3) + '%',
    width: Math.max(0.5, Math.min(width, 100 - Math.max(0, parseFloat(left)))).toFixed(3) + '%',
  }
}

// ── Lane assignment ────────────────────────────────────────────────
function assignLanes(reservations, services) {
  const sorted = [...reservations].sort((a, b) =>
    (toDecimal(a.start_time) ?? 0) - (toDecimal(b.start_time) ?? 0)
  )
  const lanes = []

  return sorted.map(res => {
    const start    = toDecimal(res.start_time) ?? 0
    const durH     = getServiceDuration(services, res.service)
    const end      = toDecimal(res.end_time) ?? (start + durH)
    let lane = lanes.findIndex(laneEnd => laneEnd <= start)
    if (lane === -1) lane = lanes.length
    lanes[lane] = end
    return { ...res, _computedEnd: end, lane }
  })
}

// ── Reservation block ──────────────────────────────────────────────
function ResBlock({ res, laneCount, laneIndex, HOUR_START, HOUR_END, services }) {
  const [hov, setHov] = useState(false)

  // Use computed end from lane assignment, fall back to service duration
  const durH   = getServiceDuration(services, res.service)
  const endTime = res.end_time || (() => {
    const start = toDecimal(res.start_time)
    if (start === null) return null
    const endDec = start + durH
    const hh = Math.floor(endDec)
    const mm = Math.round((endDec - hh) * 60)
    return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`
  })()

  const pos    = blockPosition(res.start_time, endTime, HOUR_START, HOUR_END)
  if (!pos) return null

  const scheme = STATUS_BLOCK[res.status] ?? STATUS_BLOCK.Pending

  return (
    <div
      title={`${res.customer_name} · ${res.guests} pers. · ${res.start_time}${endTime ? '–' + endTime : ''}${res.service ? ' · ' + res.service : ''}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:     'absolute',
        left:         pos.left,
        width:        pos.width,
        top:          laneCount === 1 ? '50%' : `${laneIndex * (100 / laneCount)}%`,
        transform:    laneCount === 1 ? 'translateY(-50%)' : 'none',
        height:       `${Math.floor(96 / laneCount) - 4}%`,
        minHeight:    16,
        background:   scheme.bg,
        borderLeft:   `3px solid ${scheme.border}`,
        borderRadius: '0 2px 2px 0',
        display:      'flex',
        alignItems:   'center',
        padding:      '0 6px',
        overflow:     'hidden',
        cursor:       'default',
        transition:   'box-shadow 0.12s, filter 0.12s',
        zIndex:       hov ? 20 : laneIndex + 1,
        boxShadow:    hov ? '0 4px 12px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.15)',
        filter:       hov ? 'brightness(1.12)' : 'none',
        whiteSpace:   'nowrap',
      }}
    >
      <span style={{ fontSize: laneCount > 2 ? 9 : 10, fontWeight: 800, color: scheme.text, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {res.customer_name}
      </span>
      {laneCount <= 2 && (
        <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginLeft: 4, flexShrink: 0 }}>
          {res.start_time}{endTime ? `–${endTime}` : ''} · {res.guests}p
        </span>
      )}
    </div>
  )
}

// ── Table row ──────────────────────────────────────────────────────
function TimelineRow({ row, isLast, HOUR_START, HOUR_END, HOURS, TOTAL_H, services }) {
  const locStyle  = LOC_COLORS[row.location] ?? { bg: '#f5f5f5', color: '#666' }
  const hasRes    = row.reservations.length > 0
  const lanedRes  = assignLanes(row.reservations, services)
  const laneCount = lanedRes.length > 0 ? Math.max(...lanedRes.map(r => r.lane)) + 1 : 1
  const rowHeight = Math.max(52, laneCount * 30)

  return (
    <div style={{
      display:             'grid',
      gridTemplateColumns: '160px 1fr',
      borderBottom:        isLast ? 'none' : `1px solid ${BORDER}`,
      minHeight:           rowHeight,
    }}>
      {/* Info cell */}
      <div style={{
        padding:        '10px 14px',
        borderRight:    `1px solid rgba(43,33,24,0.15)`,
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'center',
        background:     hasRes ? CREAM : '#fff',
        flexShrink:     0,
        gap:            5,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <LayoutGrid size={12} color={hasRes ? GOLD_DARK : 'rgba(43,33,24,0.3)'} strokeWidth={2.5} />
          <span style={{ fontSize: 13, fontWeight: 900, color: DARK, letterSpacing: '-0.3px' }}>
            {row.table_name}
          </span>
          {hasRes && (
            <span style={{ fontSize: 9, fontWeight: 900, padding: '1px 5px', background: DARK, color: GOLD }}>
              {row.reservations.length}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 6px', background: '#fdf6ec', fontSize: 9, fontWeight: 800, color: GOLD_DARK }}>
            <Users size={8} strokeWidth={2.5} />
            {row.capacity} pers.
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 6px', background: locStyle.bg, fontSize: 9, fontWeight: 700, color: locStyle.color }}>
            <MapPin size={8} strokeWidth={2.5} />
            {row.location}
          </span>
        </div>
      </div>

      {/* Timeline track */}
      <div style={{ position: 'relative', overflow: 'visible', background: hasRes ? '#fff' : '#fafaf9', minHeight: rowHeight }}>

        {/* Hour grid lines */}
        {HOURS.map((h, i) => (
          <div key={h} style={{
            position:      'absolute',
            left:          `${(i / TOTAL_H) * 100}%`,
            top: 0, bottom: 0, width: 1,
            background:    i === 0 ? 'transparent' : 'rgba(43,33,24,0.06)',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Current time line */}
        {(() => {
          const now = new Date()
          const dec = now.getHours() + now.getMinutes() / 60
          if (dec < HOUR_START || dec > HOUR_END) return null
          const left = ((dec - HOUR_START) / TOTAL_H) * 100
          return (
            <div style={{
              position: 'absolute', left: `${left}%`,
              top: 0, bottom: 0, width: 2,
              background: RED, zIndex: 30, pointerEvents: 'none',
            }} />
          )
        })()}

        {/* Free watermark */}
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
        {lanedRes.map(res => (
          <ResBlock
            key={res.id}
            res={res}
            laneCount={laneCount}
            laneIndex={res.lane}
            HOUR_START={HOUR_START}
            HOUR_END={HOUR_END}
            services={services}
          />
        ))}
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────
export default function TableTimeline({ controlledDate = null }) {
  const { timeline, loading, error, date, setDate, allOH, services } = useTablesTimeline()
  const isControlled = !!controlledDate

  useEffect(() => {
    if (controlledDate && controlledDate !== date) setDate(controlledDate)
  }, [controlledDate]) // eslint-disable-line

  const today    = new Date().toISOString().slice(0, 10)
  const occupied = timeline.filter(t => t.reservations.length > 0).length
  const free     = timeline.length - occupied
  const totalRes = timeline.reduce((s, t) => s + t.reservations.length, 0)

  // ── Compute dynamic hour range from actual open hours ──────────
  const { hStart, hEnd } = useMemo(
    () => getOpenHoursForDate(allOH, date),
    [allOH, date]
  )

  const HOUR_START = hStart
  const HOUR_END   = hEnd
  const TOTAL_H    = HOUR_END - HOUR_START
  const HOURS      = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i)

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif", marginTop: 24 }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: DARK }}>
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
              <span style={{ padding: '5px 10px', background: occupied > 0 ? GREEN : CREAM, border: `1px solid ${occupied > 0 ? '#4ade8040' : BORDER}`, fontSize: 11, fontWeight: 900, color: occupied > 0 ? '#fff' : 'rgba(43,33,24,0.35)' }}>
                {occupied} occupée{occupied !== 1 ? 's' : ''}
              </span>
              <span style={{ padding: '5px 10px', background: CREAM, border: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 900, color: 'rgba(43,33,24,0.4)' }}>
                {free} libre{free !== 1 ? 's' : ''}
              </span>
              {totalRes > 0 && (
                <span style={{ padding: '5px 10px', background: '#fdf6ec', border: `1px solid rgba(200,169,126,0.3)`, fontSize: 11, fontWeight: 900, color: GOLD_DARK }}>
                  {totalRes} résa
                </span>
              )}
            </>
          )}
        </div>

        {/* Standalone date nav */}
        {!isControlled && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button onClick={() => setDate(offsetDate(date, -1))}
              style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: `2px solid ${DARK}`, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = CREAM}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <ChevronLeft size={15} strokeWidth={2.5} color={DARK} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 12px', background: '#fff', border: `2px solid ${DARK}` }}>
              <CalendarDays size={12} color={GOLD} strokeWidth={2.5} />
              <span style={{ fontSize: 12, fontWeight: 900, color: DARK, whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
                {formatDate(date)}
              </span>
            </div>
            <button onClick={() => setDate(offsetDate(date, 1))}
              style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: `2px solid ${DARK}`, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = CREAM}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <ChevronRight size={15} strokeWidth={2.5} color={DARK} />
            </button>
            {date !== today && (
              <button onClick={() => setDate(today)}
                style={{ padding: '6px 12px', background: GOLD, border: 'none', fontSize: 11, fontWeight: 900, color: DARK, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}
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
        <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fef2f2', borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED }}>
          {error}
        </div>
      )}

      {/* ── Grid ── */}
      <div style={{ border: `2px solid ${DARK}`, overflow: 'hidden' }}>

        {/* Hour header */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', background: DARK }}>
          <div style={{ padding: '9px 14px', borderRight: `1px solid rgba(200,169,126,0.15)`, display: 'flex', alignItems: 'center', gap: 7 }}>
            <Clock size={11} color={GOLD} strokeWidth={2.5} />
            <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Table</span>
          </div>
          <div style={{ position: 'relative', height: 34, overflowX: 'hidden' }}>
            {HOURS.map((h, i) => {
              const isNow = new Date().getHours() === h
              return (
                <div key={h} style={{
                  position:   'absolute',
                  left:       `${(i / TOTAL_H) * 100}%`,
                  top: 0, bottom: 0,
                  display:    'flex', alignItems: 'center', paddingLeft: 4,
                  borderLeft: i > 0 ? '1px solid rgba(200,169,126,0.1)' : 'none',
                }}>
                  <span style={{ fontSize: 9, fontWeight: isNow ? 900 : 600, color: isNow ? RED : 'rgba(200,169,126,0.7)', whiteSpace: 'nowrap' }}>
                    {String(h % 24).padStart(2,'0')}h
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ padding: '52px 0', textAlign: 'center', background: '#fff' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2.5px solid ${BORDER}`, borderTopColor: GOLD, animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'rgba(43,33,24,0.3)' }}>Chargement…</p>
          </div>
        )}

        {/* Empty */}
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
            HOUR_START={HOUR_START}
            HOUR_END={HOUR_END}
            HOURS={HOURS}
            TOTAL_H={TOTAL_H}
            services={services}
          />
        ))}
      </div>

      {/* Legend */}
      {!loading && timeline.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 8, padding: '8px 14px', background: CREAM, border: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 9, fontWeight: 900, color: DARK, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Légende</span>
          {[
            { bg: GREEN,     border: '#4ade80', label: 'Confirmée'  },
            { bg: '#92400e', border: GOLD,      label: 'En attente' },
          ].map(s => (
            <span key={s.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: DARK }}>
              <span style={{ width: 14, height: 11, background: s.bg, borderLeft: `3px solid ${s.border}`, flexShrink: 0 }} />
              {s.label}
            </span>
          ))}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: DARK }}>
            <span style={{ width: 2, height: 14, background: RED, flexShrink: 0 }} />
            Maintenant
          </span>
          {!loading && allOH.length > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: GOLD_DARK }}>
              {String(HOUR_START).padStart(2,'0')}h – {String(HOUR_END % 24).padStart(2,'0')}h
            </span>
          )}
        </div>
      )}
    </div>
  )
}