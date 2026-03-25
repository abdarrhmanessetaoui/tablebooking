import { useState, useEffect, useMemo, useRef } from 'react'
import {
  LayoutGrid, Clock, CalendarDays, Utensils,
  Users, ChevronLeft, ChevronRight, ChevronDown,
} from 'lucide-react'
import useTablesTimeline from '../../hooks/Tables/useTablesTimeline'
import { RED } from '../../styles/dashboard/tokens'

// ─── Design tokens ───────────────────────────────────────────────
const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const CREAM     = '#faf8f5'
const BORDER    = 'rgba(43,33,24,0.10)'
const GREEN     = '#16A34A'

const STATUS = {
  Confirmed: { bg: '#16A34A', border: '#86efac', text: '#fff', label: 'Confirmée'  },
  Pending:   { bg: '#b45309', border: '#fcd34d', text: '#fff', label: 'En attente' },
}

// ─── CRITICAL: compute today in LOCAL timezone, not UTC ──────────
// new Date().toISOString() is UTC — in UTC+1/+2 it returns "yesterday"
// after midnight local time. Always use getFullYear/Month/Date instead.
function localToday() {
  const d = new Date()
  return (
    d.getFullYear() +
    '-' + String(d.getMonth() + 1).padStart(2, '0') +
    '-' + String(d.getDate()).padStart(2, '0')
  )
}
// Computed once at module level so every render uses same value
const TODAY = localToday()

// ─── Helpers ─────────────────────────────────────────────────────
function toDecimal(t) {
  if (!t) return null
  const [h, m] = t.split(':').map(Number)
  return h + (m || 0) / 60
}
function decimalToTime(dec) {
  const h = Math.floor(dec % 24)
  const m = Math.round((dec - Math.floor(dec)) * 60)
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
}
function formatShort(iso) {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}
function formatMonthYear(y, m) {
  return new Date(y, m, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}
function toISO(y, m, d) {
  return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}
function getOpenHours(allOH, iso) {
  if (!allOH?.length || !iso) return { hS: 11, hE: 23 }
  const jsDay = new Date(iso + 'T00:00:00').getDay()
  let lo = Infinity, hi = -Infinity
  allOH.forEach(oh => {
    const s = oh.openhours?.[jsDay] ?? oh.openhours?.[0]
    if (!s) return
    const a = parseInt(s.h1 ?? 11) + parseInt(s.m1 ?? 0) / 60
    const b = parseInt(s.h2 ?? 23) + parseInt(s.m2 ?? 0) / 60
    if (a < lo) lo = a
    if (b > hi) hi = b
  })
  if (!isFinite(lo)) return { hS: 11, hE: 23 }
  return { hS: Math.max(0, Math.floor(lo)), hE: Math.min(24, Math.ceil(hi)) }
}
function getDur(services, name) {
  if (!name) return 1
  const s = services.find(x => x.name === name)
  return s?.duration ? Math.max(15 / 60, parseInt(s.duration) / 60) : 1
}
function getPos(startT, endT, hS, hE) {
  const s = toDecimal(startT)
  if (s === null) return null
  const e  = toDecimal(endT) ?? (s + 1)
  const tH = hE - hS
  if (tH <= 0) return null
  const l = ((s - hS) / tH) * 100
  const w = ((e - s)  / tH) * 100
  return {
    l:    Math.max(0, l),
    w:    Math.max(0, Math.min(w, 100 - Math.max(0, l))),
    wPct: w,
  }
}
function buildLanes(reservations, services) {
  const sorted = [...reservations].sort(
    (a, b) => (toDecimal(a.start_time) ?? 0) - (toDecimal(b.start_time) ?? 0)
  )
  const ends = []
  return sorted.map(r => {
    const s    = toDecimal(r.start_time) ?? 0
    const dur  = getDur(services, r.service)
    const e    = r.end_time ? (toDecimal(r.end_time) ?? (s + dur)) : (s + dur)
    let lane   = ends.findIndex(x => x <= s + 0.005)
    if (lane === -1) lane = ends.length
    ends[lane] = e
    return { ...r, _e: e, lane }
  })
}

// ─── Mini Calendar ────────────────────────────────────────────────
// NOTE: today is computed internally from LOCAL date — never trust a prop
// for correctness, but we still accept value/onChange from outside.
function MiniCal({ value, onChange }) {
  // Always compute today locally — no prop dependency
  const todayISO  = TODAY
  const todayDate = new Date(todayISO + 'T00:00:00')
  const init      = value ? new Date(value + 'T00:00:00') : todayDate
  const [cur, setCur] = useState({ y: init.getFullYear(), m: init.getMonth() })

  const DAYS  = ['L','M','M','J','V','S','D']
  const dim   = (y, m) => new Date(y, m + 1, 0).getDate()
  const first = (y, m) => { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1 }

  const cells = []
  for (let i = 0; i < first(cur.y, cur.m); i++) cells.push(null)
  for (let d = 1; d <= dim(cur.y, cur.m); d++) cells.push(d)

  const goToday = () => {
    onChange(todayISO)
    setCur({ y: todayDate.getFullYear(), m: todayDate.getMonth() })
  }

  return (
    <div style={{ background: '#fff', border: `2px solid ${DARK}`, userSelect: 'none' }}>
      {/* Month nav */}
      <div style={{ background: DARK, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px' }}>
        <button
          onClick={() => setCur(c => c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 })}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
        >
          <ChevronLeft size={14} color={GOLD} strokeWidth={2.5} />
        </button>
        <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', textTransform: 'capitalize', letterSpacing: '0.02em' }}>
          {formatMonthYear(cur.y, cur.m)}
        </span>
        <button
          onClick={() => setCur(c => c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 })}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
        >
          <ChevronRight size={14} color={GOLD} strokeWidth={2.5} />
        </button>
      </div>

      {/* Day names */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', background: CREAM, borderBottom: `1px solid ${BORDER}` }}>
        {DAYS.map((d, i) => (
          <div key={i} style={{ padding: '5px 0', textAlign: 'center', fontSize: 9, fontWeight: 900, color: GOLD_DARK }}>{d}</div>
        ))}
      </div>

      {/* Days */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '4px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />
          const iso   = toISO(cur.y, cur.m, day)
          const isSel = iso === value
          const isTdy = iso === todayISO
          return (
            <button
              key={day}
              onClick={() => onChange(iso)}
              style={{
                padding: '5px 0', border: 'none', borderRadius: 3,
                background: isSel ? DARK : 'transparent',
                color: isSel ? GOLD : isTdy ? GOLD_DARK : DARK,
                fontSize: 11, fontWeight: isSel || isTdy ? 900 : 500,
                cursor: 'pointer', textAlign: 'center', position: 'relative',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = CREAM }}
              onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent' }}
            >
              {day}
              {isTdy && !isSel && (
                <span style={{ position: 'absolute', bottom: 1, left: '50%', transform: 'translateX(-50%)', width: 3, height: 3, borderRadius: '50%', background: GOLD_DARK, display: 'block' }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Today button */}
      <div style={{ padding: '6px 8px', borderTop: `1px solid ${BORDER}` }}>
        <button
          onClick={goToday}
          style={{ width: '100%', padding: '6px', background: value === todayISO ? DARK : CREAM, border: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 800, color: value === todayISO ? GOLD : DARK, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
          onMouseEnter={e => { if (value !== todayISO) e.currentTarget.style.background = '#e8e0d8' }}
          onMouseLeave={e => { if (value !== todayISO) e.currentTarget.style.background = CREAM }}
        >
          Aujourd'hui
        </button>
      </div>
    </div>
  )
}

// ─── Tooltip ─────────────────────────────────────────────────────
function Tip({ res, endTime }) {
  const sc = STATUS[res.status] ?? STATUS.Pending
  return (
    <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', background: DARK, padding: '10px 14px', zIndex: 9999, pointerEvents: 'none', boxShadow: '0 8px 28px rgba(0,0,0,0.55)', minWidth: 200, maxWidth: 260, fontFamily: "inherit" }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', background: sc.bg, marginBottom: 8 }}>
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: sc.border }} />
        <span style={{ fontSize: 9, fontWeight: 900, color: sc.text, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{sc.label}</span>
      </div>
      <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 900, color: '#fff', whiteSpace: 'normal', wordBreak: 'break-word' }}>{res.customer_name}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[
          { Icon: Clock,    v: `${res.start_time}${endTime ? ` – ${endTime}` : ''}` },
          { Icon: Users,    v: `${res.guests} pers.` },
          { Icon: Utensils, v: res.service || null },
        ].filter(x => x.v).map(({ Icon, v }) => (
          <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon size={10} color={GOLD} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${DARK}` }} />
    </div>
  )
}

// ─── Timeline block (desktop) ─────────────────────────────────────
function Block({ res, laneCount, laneIdx, hS, hE, services, trackPx }) {
  const [hov, setHov] = useState(false)

  const dur     = getDur(services, res.service)
  const sD      = toDecimal(res.start_time) ?? 0
  const eD      = res.end_time ? (toDecimal(res.end_time) ?? (sD + dur)) : (sD + dur)
  const endTime = res.end_time || decimalToTime(eD)
  const pos     = getPos(res.start_time, decimalToTime(eD), hS, hE)
  if (!pos) return null

  const sc      = STATUS[res.status] ?? STATUS.Pending
  const rowPctH = 82 / laneCount
  const topPct  = laneCount === 1
    ? 50
    : laneIdx * (100 / laneCount) + (100 / laneCount - rowPctH) / 2

  const realPx = trackPx > 0 ? (pos.wPct / 100) * trackPx : 0
  const minPx  = 44
  const dispW  = Math.max(realPx, minPx)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:   'absolute',
        left:       `${pos.l.toFixed(3)}%`,
        width:      `${pos.w.toFixed(3)}%`,
        minWidth:   `${minPx}px`,
        top:        laneCount === 1 ? '50%' : `${topPct}%`,
        transform:  laneCount === 1 ? 'translateY(-50%)' : 'none',
        height:     laneCount === 1 ? '74%' : `${rowPctH}%`,
        minHeight:  22,
        background: sc.bg,
        borderLeft: `3px solid ${sc.border}`,
        borderRadius: '0 3px 3px 0',
        display:    'flex',
        alignItems: 'center',
        padding:    dispW < 50 ? '0 4px' : '0 8px',
        overflow:   'hidden',
        cursor:     'default',
        zIndex:     hov ? 50 : laneIdx + 2,
        boxShadow:  hov ? '0 4px 14px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.18)',
        filter:     hov ? 'brightness(1.08)' : 'none',
        transition: 'box-shadow 0.1s, filter 0.1s',
        gap:        4,
        whiteSpace: 'nowrap',
      }}
    >
      {hov && <Tip res={res} endTime={endTime} />}

      {dispW < 50 ? (
        <span style={{ fontSize: 10, fontWeight: 900, color: '#fff' }}>
          {res.customer_name.charAt(0)}
        </span>
      ) : dispW < 90 ? (
        <span style={{ fontSize: 10, fontWeight: 900, color: sc.text, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {res.customer_name.split(' ')[0]}
        </span>
      ) : (
        <span style={{ fontSize: laneCount > 2 ? 9 : 11, fontWeight: 900, color: sc.text, overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, minWidth: 0 }}>
          {res.customer_name}
          {dispW > 200 && laneCount <= 2 && (
            <span style={{ fontWeight: 500, opacity: 0.65, marginLeft: 6, fontSize: 9 }}>
              {res.start_time}–{endTime}
            </span>
          )}
        </span>
      )}
    </div>
  )
}

// ─── Desktop timeline row ─────────────────────────────────────────
function TimelineRow({ row, isLast, hS, hE, hours, totalH, services, isToday, labelW }) {
  const hasRes    = row.reservations.length > 0
  const laned     = buildLanes(row.reservations, services)
  const laneCount = laned.length > 0 ? Math.max(...laned.map(r => r.lane)) + 1 : 1
  const rowH      = Math.max(52, laneCount * 46)

  const [trackPx, setTrackPx] = useState(0)
  const trackRef = useRef(null)
  useEffect(() => {
    if (!trackRef.current) return
    const ro = new ResizeObserver(([e]) => setTrackPx(e.contentRect.width))
    ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `${labelW}px 1fr`, borderBottom: isLast ? 'none' : `1px solid ${BORDER}`, minHeight: rowH }}>
      {/* Label cell */}
      <div style={{ padding: '0 10px', borderRight: `1px solid rgba(43,33,24,0.09)`, display: 'flex', alignItems: 'center', gap: 7, background: hasRes ? '#fdfaf7' : '#fff', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: hasRes ? GREEN : 'rgba(43,33,24,0.15)', boxShadow: hasRes ? `0 0 0 3px ${GREEN}22` : 'none' }} />
        <span style={{ fontSize: 12, fontWeight: 900, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
          {row.table_name}
        </span>
        {hasRes && (
          <span style={{ fontSize: 9, fontWeight: 900, padding: '1px 5px', background: DARK, color: GOLD, flexShrink: 0 }}>
            {row.reservations.length}
          </span>
        )}
      </div>

      {/* Track */}
      <div ref={trackRef} style={{ position: 'relative', overflow: 'visible', background: hasRes ? '#fff' : '#fafaf8', minHeight: rowH }}>
        {/* Hour bands */}
        {hours.map((h, i) => (
          <div key={`bg${h}`} style={{ position: 'absolute', left: `${(i / totalH) * 100}%`, width: `${(1 / totalH) * 100}%`, top: 0, bottom: 0, background: i % 2 === 0 ? 'transparent' : 'rgba(43,33,24,0.013)', pointerEvents: 'none' }} />
        ))}
        {/* Hour dividers */}
        {hours.map((h, i) => i > 0 && (
          <div key={`hl${h}`} style={{ position: 'absolute', left: `${(i / totalH) * 100}%`, top: 0, bottom: 0, width: 1, background: 'rgba(43,33,24,0.07)', pointerEvents: 'none' }} />
        ))}
        {/* Half-hour ticks */}
        {hours.map((h, i) => (
          <div key={`hh${h}`} style={{ position: 'absolute', left: `${((i + 0.5) / totalH) * 100}%`, top: '55%', bottom: 0, width: 1, background: 'rgba(43,33,24,0.035)', pointerEvents: 'none' }} />
        ))}
        {/* Now indicator */}
        {isToday && (() => {
          const now = new Date()
          const dec = now.getHours() + now.getMinutes() / 60
          if (dec < hS || dec > hE) return null
          return (
            <div style={{ position: 'absolute', left: `${((dec - hS) / totalH) * 100}%`, top: 0, bottom: 0, width: 2, background: RED, zIndex: 40, pointerEvents: 'none', boxShadow: `0 0 6px ${RED}88` }}>
              <div style={{ position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)', width: 7, height: 7, borderRadius: '50%', background: RED }} />
            </div>
          )
        })()}
        {/* Empty label */}
        {!hasRes && (
          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 8, fontWeight: 900, color: 'rgba(43,33,24,0.07)', letterSpacing: '0.35em', textTransform: 'uppercase', pointerEvents: 'none', userSelect: 'none' }}>
            libre
          </span>
        )}
        {/* Blocks */}
        {laned.map(res => (
          <Block key={res.id} res={res} laneCount={laneCount} laneIdx={res.lane} hS={hS} hE={hE} services={services} trackPx={trackPx} />
        ))}
      </div>
    </div>
  )
}

// ─── Mobile: single reservation row ──────────────────────────────
function ResRow({ res, services }) {
  const sc  = STATUS[res.status] ?? STATUS.Pending
  const dur = getDur(services, res.service)
  const sD  = toDecimal(res.start_time) ?? 0
  const eD  = res.end_time ? (toDecimal(res.end_time) ?? (sD + dur)) : (sD + dur)
  const end = res.end_time || decimalToTime(eD)

  return (
    <div style={{ display: 'flex', gap: 10, padding: '12px 14px', borderTop: `1px solid ${BORDER}`, background: '#fff', alignItems: 'flex-start' }}>
      {/* Status bar */}
      <div style={{ width: 3, minHeight: 44, borderRadius: 2, flexShrink: 0, background: sc.bg, alignSelf: 'stretch' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name + badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 15, fontWeight: 900, color: DARK, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {res.customer_name}
          </span>
          <span style={{ fontSize: 10, fontWeight: 900, padding: '3px 8px', background: sc.bg, color: sc.text, borderRadius: 2, flexShrink: 0, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            {sc.label}
          </span>
        </div>
        {/* Info chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: DARK }}>
            <Clock size={12} color={GOLD_DARK} strokeWidth={2.5} />
            {res.start_time}{end ? ` – ${end}` : ''}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: DARK }}>
            <Users size={12} color={GOLD_DARK} strokeWidth={2.5} />
            {res.guests} pers.
          </span>
          {res.service && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: DARK }}>
              <Utensils size={12} color={GOLD_DARK} strokeWidth={2.5} />
              {res.service}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Mobile: table card ───────────────────────────────────────────
function TableCard({ row, services }) {
  const [open, setOpen] = useState(true)
  const hasRes = row.reservations.length > 0
  const sorted = [...row.reservations].sort(
    (a, b) => (toDecimal(a.start_time) ?? 0) - (toDecimal(b.start_time) ?? 0)
  )

  return (
    <div style={{ border: `2px solid ${DARK}`, overflow: 'hidden', background: '#fff' }}>
      {/* Card header */}
      <button
        onClick={() => hasRes && setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: hasRes ? DARK : '#f0ece8', border: 'none', cursor: hasRes ? 'pointer' : 'default', fontFamily: 'inherit', textAlign: 'left' }}
      >
        <div style={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, background: hasRes ? GREEN : 'rgba(43,33,24,0.22)', boxShadow: hasRes ? `0 0 0 3px ${GREEN}44` : 'none' }} />
        <span style={{ flex: 1, fontSize: 15, fontWeight: 900, color: hasRes ? '#fff' : 'rgba(43,33,24,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.table_name}
        </span>
        {hasRes ? (
          <>
            <span style={{ fontSize: 11, fontWeight: 900, padding: '3px 10px', background: GOLD, color: DARK, borderRadius: 2, flexShrink: 0 }}>
              {row.reservations.length} rés.
            </span>
            <ChevronDown
              size={16} color={GOLD} strokeWidth={2.5}
              style={{ flexShrink: 0, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }}
            />
          </>
        ) : (
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(43,33,24,0.35)', fontStyle: 'italic' }}>libre</span>
        )}
      </button>

      {/* Reservation rows */}
      {hasRes && open && sorted.map(res => (
        <ResRow key={res.id} res={res} services={services} />
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────
export default function TableTimeline({ controlledDate = null }) {
  const { timeline, loading, error, date, setDate, allOH, services } = useTablesTimeline()

  // IMPORTANT: compute isToday using LOCAL date, never hook's stale UTC string
  const isToday = date === TODAY

  // ── Responsive: initialize from window width so first render is correct ──
  // Starting with 9999 causes mobile to flash the desktop layout.
  // Reading window.innerWidth synchronously gives the right breakpoint immediately.
  const [containerW, setContainerW] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 9999
  )
  const rootRef = useRef(null)
  useEffect(() => {
    if (!rootRef.current) return
    // Measure the actual container (may differ from window width inside a panel)
    const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width))
    ro.observe(rootRef.current)
    return () => ro.disconnect()
  }, [])

  // Below 640 px → card layout
  const isMobile = containerW < 640
  // Label column width for desktop timeline
  const labelW = containerW < 800 ? 80 : 100

  const [calOpen, setCalOpen] = useState(false)

  useEffect(() => {
    if (controlledDate && controlledDate !== date) setDate(controlledDate)
  }, [controlledDate]) // eslint-disable-line

  const { hS, hE } = useMemo(() => getOpenHours(allOH, date), [allOH, date])
  const totalH     = Math.max(1, hE - hS)
  const hours      = Array.from({ length: hE - hS }, (_, i) => hS + i)
  const totalRes   = timeline.reduce((s, t) => s + t.reservations.length, 0)

  return (
    <div ref={rootRef} style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <style>{`
        @keyframes tl-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .tl-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .tl-inner  { min-width: 420px; border: 2px solid ${DARK}; overflow: hidden; }
        .tl-hrow   { position: sticky; top: 0; z-index: 20; }
      `}</style>

      {error && (
        <div style={{ marginBottom: 10, padding: '10px 14px', background: '#fef2f2', borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED }}>
          {error}
        </div>
      )}

      {/* ════ MOBILE LAYOUT ════ */}
      {isMobile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Date toggle bar */}
          <button
            onClick={() => setCalOpen(o => !o)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: DARK, border: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <CalendarDays size={14} color={GOLD} strokeWidth={2.5} />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', textTransform: 'capitalize' }}>
                {formatShort(date)}
              </span>
              {isToday && (
                <span style={{ fontSize: 10, fontWeight: 900, color: GOLD, padding: '1px 7px', border: `1px solid ${GOLD}55`, letterSpacing: '0.05em' }}>
                  Aujourd'hui
                </span>
              )}
            </span>
            <ChevronDown
              size={15} color={GOLD} strokeWidth={2.5}
              style={{ transition: 'transform 0.2s', transform: calOpen ? 'rotate(180deg)' : 'none' }}
            />
          </button>

          {/* Calendar dropdown */}
          {calOpen && (
            <div>
              <MiniCal
                value={date}
                onChange={(d) => { setDate(d); setCalOpen(false) }}
              />
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={{ padding: '40px 0', textAlign: 'center' }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', border: `3px solid ${BORDER}`, borderTopColor: GOLD, animation: 'tl-spin 0.8s linear infinite', margin: '0 auto 10px' }} />
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'rgba(43,33,24,0.3)' }}>Chargement…</p>
            </div>
          )}

          {/* No tables */}
          {!loading && timeline.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', background: '#fff', border: `2px solid ${DARK}` }}>
              <LayoutGrid size={28} color={DARK} strokeWidth={1.2} style={{ display: 'block', margin: '0 auto 10px', opacity: 0.12 }} />
              <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 900, color: DARK }}>Aucune table configurée</p>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: 'rgba(43,33,24,0.35)' }}>Ajoutez des tables dans la section Tables.</p>
            </div>
          )}

          {/* No reservations */}
          {!loading && timeline.length > 0 && totalRes === 0 && (
            <div style={{ padding: '12px 14px', background: '#fdf6ec', border: `1px solid rgba(200,169,126,0.3)`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <CalendarDays size={14} color={GOLD_DARK} strokeWidth={2} style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: DARK }}>
                Aucune réservation {isToday ? "aujourd'hui" : `le ${formatShort(date)}`}
                <span style={{ fontWeight: 600, color: GOLD_DARK, marginLeft: 8 }}>
                  · {timeline.length} table{timeline.length > 1 ? 's' : ''} libre{timeline.length > 1 ? 's' : ''}
                </span>
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && timeline.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {timeline.map(row => (
                <TableCard key={row.table_id} row={row} services={services} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ════ DESKTOP LAYOUT ════ */}
      {!isMobile && (
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          {/* Sidebar */}
          <div style={{ width: 196, flexShrink: 0 }}>
            <MiniCal value={date} onChange={setDate} />
            <div style={{ marginTop: 8, padding: '8px 12px', background: DARK, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <CalendarDays size={11} color={GOLD} strokeWidth={2.5} />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', textTransform: 'capitalize', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {formatShort(date)}
              </span>
              {isToday && (
                <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.08em', border: `1px solid ${GOLD}55`, padding: '1px 6px', flexShrink: 0 }}>
                  Aujourd'hui
                </span>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {loading && (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', border: `3px solid ${BORDER}`, borderTopColor: GOLD, animation: 'tl-spin 0.8s linear infinite', margin: '0 auto 10px' }} />
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'rgba(43,33,24,0.3)' }}>Chargement…</p>
              </div>
            )}

            {!loading && timeline.length === 0 && (
              <div style={{ padding: '40px 24px', textAlign: 'center', background: '#fff', border: `2px solid ${DARK}` }}>
                <LayoutGrid size={28} color={DARK} strokeWidth={1.2} style={{ display: 'block', margin: '0 auto 10px', opacity: 0.12 }} />
                <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 900, color: DARK }}>Aucune table configurée</p>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: 'rgba(43,33,24,0.35)' }}>Ajoutez des tables dans la section Tables.</p>
              </div>
            )}

            {!loading && timeline.length > 0 && totalRes === 0 && (
              <div style={{ padding: '11px 14px', background: '#fdf6ec', border: `1px solid rgba(200,169,126,0.28)`, display: 'flex', alignItems: 'center', gap: 9, marginBottom: 2 }}>
                <CalendarDays size={13} color={GOLD_DARK} strokeWidth={2} style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: DARK }}>
                  Aucune réservation {isToday ? "aujourd'hui" : `le ${formatShort(date)}`}
                  <span style={{ fontWeight: 600, color: GOLD_DARK, marginLeft: 8 }}>
                    · {timeline.length} table{timeline.length > 1 ? 's' : ''} libre{timeline.length > 1 ? 's' : ''}
                  </span>
                </p>
              </div>
            )}

            {!loading && timeline.length > 0 && (
              <div className="tl-scroll">
                <div className="tl-inner">
                  {/* Sticky hour header */}
                  <div className="tl-hrow" style={{ display: 'grid', gridTemplateColumns: `${labelW}px 1fr`, background: DARK }}>
                    <div style={{ padding: '7px 10px', borderRight: `1px solid rgba(200,169,126,0.15)`, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <LayoutGrid size={10} color={GOLD} strokeWidth={2.5} />
                      <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Table</span>
                    </div>
                    <div style={{ position: 'relative', height: 30, overflow: 'hidden' }}>
                      {hours.map((h, i) => {
                        const isNow = isToday && new Date().getHours() === h
                        return (
                          <div key={h} style={{ position: 'absolute', left: `${(i / totalH) * 100}%`, width: `${(1 / totalH) * 100}%`, top: 0, bottom: 0, display: 'flex', alignItems: 'center', paddingLeft: 4, borderLeft: i > 0 ? '1px solid rgba(200,169,126,0.12)' : 'none', background: isNow ? 'rgba(239,68,68,0.1)' : 'transparent', overflow: 'hidden' }}>
                            <span style={{ fontSize: 9, fontWeight: isNow ? 900 : 500, color: isNow ? RED : 'rgba(200,169,126,0.6)', whiteSpace: 'nowrap' }}>
                              {String(h % 24).padStart(2, '0')}h
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Rows */}
                  {timeline.map((row, i) => (
                    <TimelineRow
                      key={row.table_id}
                      row={row}
                      isLast={i === timeline.length - 1}
                      hS={hS} hE={hE}
                      hours={hours} totalH={totalH}
                      services={services}
                      isToday={isToday}
                      labelW={labelW}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}