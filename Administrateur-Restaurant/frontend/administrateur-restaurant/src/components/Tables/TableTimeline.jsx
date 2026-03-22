import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  ChevronLeft, ChevronRight, LayoutGrid,
  Users, MapPin, Clock, CalendarDays, Utensils,
} from 'lucide-react'
import useTablesTimeline from '../../hooks/Tables/useTablesTimeline'
import { GREEN, RED } from '../../styles/dashboard/tokens'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const CREAM     = '#faf8f5'
const BORDER    = 'rgba(43,33,24,0.10)'

const STATUS_BLOCK = {
  Confirmed: { bg: '#16A34A', border: '#bbf7d0', text: '#fff', label: 'Confirmée'  },
  Pending:   { bg: '#b45309', border: '#fde68a', text: '#fff', label: 'En attente' },
}

const LOC_COLORS = {
  'Intérieur':   { bg: '#eef2ff', color: '#4338ca' },
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

function decimalToTime(dec) {
  const h = Math.floor(dec % 24)
  const m = Math.round((dec - Math.floor(dec)) * 60)
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatDateShort(iso) {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'short', day: 'numeric', month: 'short',
  })
}

function offsetDate(iso, days) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function getOpenHoursForDate(allOH, dateISO) {
  if (!allOH?.length || !dateISO) return { hStart: 11, hEnd: 23 }
  const dt     = new Date(dateISO + 'T00:00:00')
  const jsDay  = dt.getDay()
  const appDay = jsDay === 0 ? 6 : jsDay - 1
  let minStart = Infinity
  let maxEnd   = -Infinity
  allOH.forEach(oh => {
    const slot  = oh.openhours?.[appDay] ?? oh.openhours?.[0]
    if (!slot) return
    const start = parseInt(slot.h1 ?? 11) + parseInt(slot.m1 ?? 0) / 60
    const end   = parseInt(slot.h2 ?? 23) + parseInt(slot.m2 ?? 0) / 60
    if (start < minStart) minStart = start
    if (end   > maxEnd)   maxEnd   = end
  })
  if (!isFinite(minStart)) return { hStart: 11, hEnd: 23 }
  return {
    hStart: Math.max(0,  Math.floor(minStart)),
    hEnd:   Math.min(24, Math.ceil(maxEnd)),
  }
}

function getServiceDurationH(services, serviceName) {
  const svc = services.find(s => s.name === serviceName)
  if (!svc?.duration) return 1.5
  return Math.max(0.25, parseInt(svc.duration) / 60)
}

function blockPct(startTime, endTime, hStart, hEnd) {
  const start  = toDecimal(startTime)
  if (start === null) return null
  const end    = toDecimal(endTime) ?? (start + 1.5)
  const totalH = hEnd - hStart
  if (totalH <= 0) return null
  const left   = ((start - hStart) / totalH) * 100
  const width  = ((end - start)    / totalH) * 100
  return {
    left:  `${Math.max(0, left).toFixed(3)}%`,
    width: `${Math.max(0.5, Math.min(width, 100 - Math.max(0, left))).toFixed(3)}%`,
    widthNum: width,
  }
}

function assignLanes(reservations, services) {
  const sorted = [...reservations].sort(
    (a, b) => (toDecimal(a.start_time) ?? 0) - (toDecimal(b.start_time) ?? 0)
  )
  const laneEnds = []
  return sorted.map(res => {
    const start = toDecimal(res.start_time) ?? 0
    const durH  = getServiceDurationH(services, res.service)
    const end   = toDecimal(res.end_time) ?? (start + durH)
    let   lane  = laneEnds.findIndex(e => e <= start + 0.01)
    if (lane === -1) lane = laneEnds.length
    laneEnds[lane] = end
    return { ...res, _end: end, lane }
  })
}

// ── Tooltip ───────────────────────────────────────────────────────
function Tooltip({ res, endTime }) {
  const scheme = STATUS_BLOCK[res.status] ?? STATUS_BLOCK.Pending
  return (
    <div style={{
      position:      'absolute',
      bottom:        'calc(100% + 8px)',
      left:          '50%',
      transform:     'translateX(-50%)',
      background:    DARK,
      padding:       '10px 14px',
      zIndex:        200,
      pointerEvents: 'none',
      boxShadow:     '0 8px 24px rgba(0,0,0,0.4)',
      minWidth:      180,
      maxWidth:      260,
    }}>
      {/* Status badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', background: scheme.bg, marginBottom: 8 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: scheme.border }} />
        <span style={{ fontSize: 9, fontWeight: 900, color: scheme.text, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {scheme.label}
        </span>
      </div>

      {/* Name */}
      <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px', marginBottom: 8 }}>
        {res.customer_name}
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Clock size={10} color={GOLD} strokeWidth={2.5} />
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
            {res.start_time}{endTime ? ` – ${endTime}` : ''}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Users size={10} color={GOLD} strokeWidth={2.5} />
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
            {res.guests} personne{res.guests > 1 ? 's' : ''}
          </span>
        </div>
        {res.service && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Utensils size={10} color={GOLD} strokeWidth={2.5} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
              {res.service}
            </span>
          </div>
        )}
        {res.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 10, color: GOLD }}>📞</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>
              {res.phone}
            </span>
          </div>
        )}
      </div>

      {/* Arrow */}
      <div style={{
        position:    'absolute',
        bottom:      -5,
        left:        '50%',
        transform:   'translateX(-50%)',
        width: 0, height: 0,
        borderLeft:  '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop:   `5px solid ${DARK}`,
      }} />
    </div>
  )
}

// ── Reservation block ──────────────────────────────────────────────
function ResBlock({ res, laneCount, laneIndex, hStart, hEnd, services }) {
  const [hov, setHov] = useState(false)

  const durH    = getServiceDurationH(services, res.service)
  const startD  = toDecimal(res.start_time) ?? 0
  const endDec  = toDecimal(res.end_time) ?? (startD + durH)
  const endTime = res.end_time ?? decimalToTime(endDec)
  const pos     = blockPct(res.start_time, endTime, hStart, hEnd)
  if (!pos) return null

  const scheme   = STATUS_BLOCK[res.status] ?? STATUS_BLOCK.Pending
  const pctH     = Math.floor(88 / laneCount)
  const topPct   = laneCount === 1
    ? 50
    : (laneIndex / laneCount) * 100 + (100 / laneCount - pctH) / 2
  const isWide   = pos.widthNum > 6  // enough space for text
  const isNarrow = pos.widthNum <= 3 // only show a sliver

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:     'absolute',
        left:         pos.left,
        width:        pos.width,
        top:          laneCount === 1 ? '50%' : `${topPct}%`,
        transform:    laneCount === 1 ? 'translateY(-50%)' : 'none',
        height:       laneCount === 1 ? '72%' : `${pctH}%`,
        minHeight:    20,
        background:   scheme.bg,
        borderLeft:   `3px solid ${scheme.border}`,
        borderRadius: '0 3px 3px 0',
        display:      'flex',
        flexDirection:'column',
        justifyContent:'center',
        padding:      isNarrow ? '0 2px' : '0 8px',
        overflow:     'hidden',
        cursor:       'default',
        transition:   'box-shadow 0.12s, filter 0.12s',
        zIndex:       hov ? 50 : laneIndex + 2,
        boxShadow:    hov
          ? '0 6px 20px rgba(0,0,0,0.35)'
          : '0 1px 4px rgba(0,0,0,0.18)',
        filter:       hov ? 'brightness(1.1)' : 'none',
        whiteSpace:   'nowrap',
      }}
    >
      {hov && <Tooltip res={res} endTime={endTime} />}

      {isWide && (
        <>
          {/* Name */}
          <span style={{
            fontSize:     laneCount > 2 ? 9 : 11,
            fontWeight:   900,
            color:        scheme.text,
            overflow:     'hidden',
            textOverflow: 'ellipsis',
            lineHeight:   1.2,
          }}>
            {res.customer_name}
          </span>

          {/* Time + guests + service in one line when space allows */}
          {laneCount <= 3 && pos.widthNum > 10 && (
            <span style={{
              fontSize:   9,
              fontWeight: 600,
              color:      'rgba(255,255,255,0.65)',
              overflow:   'hidden',
              textOverflow:'ellipsis',
              marginTop:  1,
            }}>
              {res.start_time}–{endTime} · {res.guests}p
              {res.service && pos.widthNum > 18 ? ` · ${res.service}` : ''}
            </span>
          )}
        </>
      )}
    </div>
  )
}

// ── Timeline row ───────────────────────────────────────────────────
function TimelineRow({ row, isLast, hStart, hEnd, hours, totalH, services }) {
  const locStyle  = LOC_COLORS[row.location] ?? { bg: '#f5f5f5', color: '#888' }
  const hasRes    = row.reservations.length > 0
  const lanedRes  = assignLanes(row.reservations, services)
  const laneCount = lanedRes.length > 0
    ? Math.max(...lanedRes.map(r => r.lane)) + 1
    : 1
  const rowH      = Math.max(56, laneCount * 46)

  return (
    <div style={{
      display:             'grid',
      gridTemplateColumns: '180px 1fr',
      borderBottom:        isLast ? 'none' : `1px solid ${BORDER}`,
      minHeight:           rowH,
    }}>

      {/* Info cell */}
      <div style={{
        padding:        '10px 14px',
        borderRight:    `2px solid rgba(43,33,24,0.12)`,
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'center',
        background:     hasRes ? '#fdfcfb' : '#fff',
        flexShrink:     0,
        gap:            6,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, flexShrink: 0, background: hasRes ? GOLD : '#f0ebe4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutGrid size={13} color={hasRes ? DARK : 'rgba(43,33,24,0.3)'} strokeWidth={2.5} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: DARK, letterSpacing: '-0.3px' }}>
                {row.table_name}
              </span>
              {hasRes && (
                <span style={{ fontSize: 9, fontWeight: 900, padding: '1px 5px', background: DARK, color: GOLD, flexShrink: 0 }}>
                  {row.reservations.length}
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', background: '#fdf6ec', fontSize: 9, fontWeight: 800, color: GOLD_DARK }}>
            <Users size={8} strokeWidth={2.5} />
            {row.capacity}p
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, padding: '2px 7px', background: locStyle.bg, fontSize: 9, fontWeight: 700, color: locStyle.color }}>
            <MapPin size={8} strokeWidth={2.5} />
            {row.location}
          </span>
        </div>
      </div>

      {/* Timeline track */}
      <div style={{
        position:   'relative',
        overflow:   'visible',
        background: hasRes ? '#fff' : '#fafaf8',
        minHeight:  rowH,
      }}>
        {/* Alternating hour backgrounds */}
        {hours.map((h, i) => (
          <div key={`bg-${h}`} style={{
            position:      'absolute',
            left:          `${(i / totalH) * 100}%`,
            width:         `${(1 / totalH) * 100}%`,
            top: 0, bottom: 0,
            background:    i % 2 === 0 ? 'transparent' : 'rgba(43,33,24,0.018)',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Hour grid lines */}
        {hours.map((h, i) => i > 0 && (
          <div key={`line-${h}`} style={{
            position:      'absolute',
            left:          `${(i / totalH) * 100}%`,
            top: 0, bottom: 0, width: 1,
            background:    'rgba(43,33,24,0.08)',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Half-hour ticks */}
        {hours.map((h, i) => (
          <div key={`half-${h}`} style={{
            position:      'absolute',
            left:          `${((i + 0.5) / totalH) * 100}%`,
            top: 0, bottom: 0, width: 1,
            background:    'rgba(43,33,24,0.03)',
            pointerEvents: 'none',
          }} />
        ))}

        {/* Current time line */}
        {(() => {
          const now = new Date()
          const dec = now.getHours() + now.getMinutes() / 60
          if (dec < hStart || dec > hEnd) return null
          return (
            <div style={{
              position:      'absolute',
              left:          `${((dec - hStart) / totalH) * 100}%`,
              top: 0, bottom: 0, width: 2,
              background:    RED,
              zIndex:        40,
              pointerEvents: 'none',
              boxShadow:     `0 0 6px ${RED}88`,
            }} />
          )
        })()}

        {/* Free label */}
        {!hasRes && (
          <span style={{
            position:      'absolute',
            top:           '50%', left: '50%',
            transform:     'translate(-50%,-50%)',
            fontSize:      9, fontWeight: 800,
            color:         'rgba(43,33,24,0.1)',
            letterSpacing: '0.25em', textTransform: 'uppercase',
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
            hStart={hStart}
            hEnd={hEnd}
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

  // ── Sync external date ─────────────────────────────────────────
  useEffect(() => {
    if (controlledDate && controlledDate !== date) {
      setDate(controlledDate)
    }
  }, [controlledDate]) // eslint-disable-line

  const today    = new Date().toISOString().slice(0, 10)
  const occupied = timeline.filter(t => t.reservations.length > 0).length
  const free     = timeline.length - occupied
  const totalRes = timeline.reduce((s, t) => s + t.reservations.length, 0)

  // ── Dynamic hour range ─────────────────────────────────────────
  const { hStart, hEnd } = useMemo(
    () => getOpenHoursForDate(allOH, date),
    [allOH, date]
  )
  const totalH = Math.max(1, hEnd - hStart)
  const hours  = Array.from({ length: hEnd - hStart }, (_, i) => hStart + i)

  // ── Navigate date ──────────────────────────────────────────────
  const goDate = useCallback((iso) => {
    setDate(iso)
  }, [setDate])

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif", marginTop: 24 }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 0, flexWrap: 'wrap' }}>

        {/* Title + stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: DARK }}>
            <LayoutGrid size={13} color={GOLD} strokeWidth={2.5} />
            <span style={{ fontSize: 12, fontWeight: 900, color: '#fff', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
              Occupation des tables
            </span>
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
      </div>

      {/* ── Date navigation bar — always visible ── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        gap:            6,
        margin:         '12px 0 14px',
        flexWrap:       'wrap',
      }}>
        {/* Prev */}
        <button
          onClick={() => goDate(offsetDate(date, -1))}
          style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: `2px solid ${DARK}`, cursor: 'pointer', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = CREAM}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <ChevronLeft size={16} strokeWidth={2.5} color={DARK} />
        </button>

        {/* Date display */}
        <div style={{
          flex:           1,
          minWidth:       220,
          display:        'flex',
          alignItems:     'center',
          gap:            8,
          padding:        '8px 14px',
          background:     DARK,
          border:         `2px solid ${DARK}`,
        }}>
          <CalendarDays size={13} color={GOLD} strokeWidth={2.5} />
          <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
            {formatDate(date)}
          </span>
          {date === today && (
            <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase', flexShrink: 0 }}>
              Aujourd'hui
            </span>
          )}
        </div>

        {/* Next */}
        <button
          onClick={() => goDate(offsetDate(date, 1))}
          style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: `2px solid ${DARK}`, cursor: 'pointer', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = CREAM}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <ChevronRight size={16} strokeWidth={2.5} color={DARK} />
        </button>

        {/* Date picker input */}
        <input
          type="date"
          value={date}
          onChange={e => { if (e.target.value) goDate(e.target.value) }}
          style={{
            padding:     '7px 10px',
            border:      `2px solid ${DARK}`,
            fontSize:    12,
            fontWeight:  700,
            color:       DARK,
            fontFamily:  'inherit',
            background:  '#fff',
            cursor:      'pointer',
            outline:     'none',
            height:      36,
          }}
        />

        {/* Today button */}
        {date !== today && (
          <button
            onClick={() => goDate(today)}
            style={{ padding: '7px 14px', background: GOLD, border: 'none', fontSize: 11, fontWeight: 900, color: DARK, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', height: 36 }}
            onMouseEnter={e => e.currentTarget.style.background = GOLD_DARK}
            onMouseLeave={e => e.currentTarget.style.background = GOLD}
          >
            Aujourd'hui
          </button>
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
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', background: DARK }}>
          <div style={{ padding: '10px 14px', borderRight: `2px solid rgba(200,169,126,0.15)`, display: 'flex', alignItems: 'center', gap: 7 }}>
            <Clock size={11} color={GOLD} strokeWidth={2.5} />
            <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Table</span>
          </div>
          <div style={{ position: 'relative', height: 36, overflowX: 'hidden' }}>
            {hours.map((h, i) => {
              const isNow = new Date().getHours() === h && date === today
              return (
                <div key={h} style={{
                  position:    'absolute',
                  left:        `${(i / totalH) * 100}%`,
                  width:       `${(1 / totalH) * 100}%`,
                  top: 0, bottom: 0,
                  display:     'flex',
                  alignItems:  'center',
                  paddingLeft: 5,
                  borderLeft:  i > 0 ? '1px solid rgba(200,169,126,0.12)' : 'none',
                  background:  isNow ? 'rgba(239,68,68,0.1)' : 'transparent',
                }}>
                  <span style={{ fontSize: 9, fontWeight: isNow ? 900 : 600, color: isNow ? RED : 'rgba(200,169,126,0.65)', whiteSpace: 'nowrap' }}>
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

        {/* Empty tables */}
        {!loading && timeline.length === 0 && (
          <div style={{ padding: '52px 24px', textAlign: 'center', background: '#fff' }}>
            <LayoutGrid size={32} color={DARK} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 12px', opacity: 0.15 }} />
            <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 900, color: DARK }}>Aucune table active</p>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'rgba(43,33,24,0.35)' }}>Configurez vos tables dans la section Tables.</p>
          </div>
        )}

        {/* No reservations for this date */}
        {!loading && timeline.length > 0 && totalRes === 0 && (
          <div style={{ padding: '28px 24px', textAlign: 'center', background: '#fafaf8', borderTop: `1px solid ${BORDER}` }}>
            <CalendarDays size={28} color={DARK} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 10px', opacity: 0.15 }} />
            <p style={{ margin: '0 0 3px', fontSize: 13, fontWeight: 900, color: 'rgba(43,33,24,0.3)' }}>
              Aucune réservation le {formatDateShort(date)}
            </p>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: 'rgba(43,33,24,0.2)' }}>
              Toutes les tables sont libres ce jour-là
            </p>
          </div>
        )}

        {/* Rows */}
        {!loading && timeline.map((row, i) => (
          <TimelineRow
            key={row.table_id}
            row={row}
            isLast={i === timeline.length - 1}
            hStart={hStart}
            hEnd={hEnd}
            hours={hours}
            totalH={totalH}
            services={services}
          />
        ))}
      </div>

      {/* ── Legend ── */}
      {!loading && timeline.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 8, padding: '9px 14px', background: CREAM, border: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 9, fontWeight: 900, color: DARK, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Légende</span>
          {[
            { bg: '#16A34A', border: '#bbf7d0', label: 'Confirmée'  },
            { bg: '#b45309', border: '#fde68a', label: 'En attente' },
          ].map(s => (
            <span key={s.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: DARK }}>
              <span style={{ width: 16, height: 12, background: s.bg, borderLeft: `3px solid ${s.border}`, flexShrink: 0, borderRadius: '0 2px 2px 0' }} />
              {s.label}
            </span>
          ))}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: DARK }}>
            <span style={{ width: 2, height: 14, background: RED, flexShrink: 0 }} />
            Maintenant
          </span>
          {allOH.length > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color: GOLD_DARK }}>
              {String(hStart).padStart(2,'0')}h – {String(hEnd % 24).padStart(2,'0')}h · Survolez pour les détails
            </span>
          )}
        </div>
      )}
    </div>
  )
}