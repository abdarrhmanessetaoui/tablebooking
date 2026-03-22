import { useState, useEffect, useMemo } from 'react'
import {
  ChevronLeft, ChevronRight, LayoutGrid,
  Clock, CalendarDays, Utensils, Users,
} from 'lucide-react'
import useTablesTimeline from '../../hooks/Tables/useTablesTimeline'
import { GREEN, RED } from '../../styles/dashboard/tokens'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const CREAM     = '#faf8f5'
const BORDER    = 'rgba(43,33,24,0.10)'

const STATUS_BLOCK = {
  Confirmed: { bg: '#16A34A', border: '#86efac', text: '#fff', label: 'Confirmée'  },
  Pending:   { bg: '#b45309', border: '#fcd34d', text: '#fff', label: 'En attente' },
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

function formatDateLong(iso) {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatDateShort(iso) {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

function offsetDate(iso, n) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0,10)
}

function getOpenHours(allOH, dateISO) {
  if (!allOH?.length || !dateISO) return { hStart: 11, hEnd: 23 }
  const jsDay = new Date(dateISO + 'T00:00:00').getDay()
  let lo = Infinity, hi = -Infinity
  allOH.forEach(oh => {
    const s = oh.openhours?.[jsDay] ?? oh.openhours?.[0]
    if (!s) return
    const a = parseInt(s.h1 ?? 11) + parseInt(s.m1 ?? 0) / 60
    const b = parseInt(s.h2 ?? 23) + parseInt(s.m2 ?? 0) / 60
    if (a < lo) lo = a
    if (b > hi) hi = b
  })
  if (!isFinite(lo)) return { hStart: 11, hEnd: 23 }
  return { hStart: Math.max(0, Math.floor(lo)), hEnd: Math.min(24, Math.ceil(hi)) }
}

function getSvcDuration(services, name) {
  if (!name) return 1
  const s = services.find(x => x.name === name)
  if (!s?.duration) return 1
  return Math.max(0.25, parseInt(s.duration) / 60)
}

function pct(startTime, endTime, hS, hE) {
  const s = toDecimal(startTime)
  if (s === null) return null
  const e  = toDecimal(endTime) ?? (s + 1)
  const tH = hE - hS
  if (tH <= 0) return null
  const l = ((s - hS) / tH) * 100
  const w = ((e - s)  / tH) * 100
  return {
    l:        Math.max(0, l),
    w:        Math.max(0.5, Math.min(w, 100 - Math.max(0, l))),
    widthNum: w,
  }
}

function assignLanes(reservations, services) {
  const sorted = [...reservations].sort(
    (a,b) => (toDecimal(a.start_time)??0) - (toDecimal(b.start_time)??0)
  )
  const ends = []
  return sorted.map(r => {
    const s    = toDecimal(r.start_time) ?? 0
    const durH = getSvcDuration(services, r.service)
    const e    = r.end_time ? (toDecimal(r.end_time) ?? (s + durH)) : (s + durH)
    let lane   = ends.findIndex(x => x <= s + 0.01)
    if (lane === -1) lane = ends.length
    ends[lane] = e
    return { ...r, _end: e, lane }
  })
}

// ── Tooltip ───────────────────────────────────────────────────────
function Tooltip({ res, endTime }) {
  const sc = STATUS_BLOCK[res.status] ?? STATUS_BLOCK.Pending
  return (
    <div style={{
      position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%',
      transform: 'translateX(-50%)',
      background: DARK, padding: '12px 16px',
      zIndex: 9999, pointerEvents: 'none',
      boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
      minWidth: 200, maxWidth: 280,
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: sc.bg, marginBottom: 10 }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.border }} />
        <span style={{ fontSize: 9, fontWeight: 900, color: sc.text, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          {sc.label}
        </span>
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 900, color: '#fff', letterSpacing: '-0.3px' }}>
        {res.customer_name}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { Icon: Clock,    v: `${res.start_time}${endTime ? ` – ${endTime}` : ''}` },
          { Icon: Users,    v: `${res.guests} personne${res.guests > 1 ? 's' : ''}` },
          { Icon: Utensils, v: res.service || null },
        ].filter(x => x.v).map(({ Icon, v }) => (
          <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon size={11} color={GOLD} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: `6px solid ${DARK}` }} />
    </div>
  )
}

// ── Reservation block ──────────────────────────────────────────────
function ResBlock({ res, laneCount, laneIndex, hS, hE, services }) {
  const [hov, setHov] = useState(false)

  const durH    = getSvcDuration(services, res.service)
  const startD  = toDecimal(res.start_time) ?? 0
  const endDec  = res.end_time
    ? (toDecimal(res.end_time) ?? (startD + durH))
    : (startD + durH)
  const endTime = res.end_time || decimalToTime(endDec)
  const p       = pct(res.start_time, decimalToTime(endDec), hS, hE)
  if (!p) return null

  const sc      = STATUS_BLOCK[res.status] ?? STATUS_BLOCK.Pending
  const rowPctH = 88 / laneCount
  const topPct  = laneCount === 1
    ? 50
    : laneIndex * (100 / laneCount) + (100 / laneCount - rowPctH) / 2

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:      'absolute',
        left:          `${p.l.toFixed(3)}%`,
        width:         `${p.w.toFixed(3)}%`,
        top:           laneCount === 1 ? '50%' : `${topPct}%`,
        transform:     laneCount === 1 ? 'translateY(-50%)' : 'none',
        height:        laneCount === 1 ? '70%' : `${rowPctH}%`,
        minHeight:     24,
        background:    sc.bg,
        borderLeft:    `3px solid ${sc.border}`,
        borderRadius:  '0 4px 4px 0',
        display:       'flex',
        alignItems:    'center',
        padding:       p.widthNum < 3 ? '0 2px' : '0 8px',
        overflow:      'hidden',
        cursor:        'default',
        zIndex:        hov ? 50 : laneIndex + 2,
        transition:    'box-shadow 0.1s, filter 0.1s',
        boxShadow:     hov ? '0 4px 16px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.2)',
        filter:        hov ? 'brightness(1.08)' : 'none',
        whiteSpace:    'nowrap',
        gap:           5,
      }}
    >
      {hov && <Tooltip res={res} endTime={endTime} />}

      {/* Name — always show if any space */}
      {p.widthNum > 2 && (
        <span style={{
          fontSize:     laneCount > 2 ? 9 : 11,
          fontWeight:   900,
          color:        sc.text,
          overflow:     'hidden',
          textOverflow: 'ellipsis',
          flexShrink:   1,
          minWidth:     0,
        }}>
          {res.customer_name}
        </span>
      )}

      {/* Time + guests — only when wide enough */}
      {p.widthNum > 12 && laneCount <= 2 && (
        <span style={{
          fontSize:   9,
          fontWeight: 600,
          color:      'rgba(255,255,255,0.65)',
          flexShrink: 0,
        }}>
          {res.start_time}–{endTime}
        </span>
      )}
    </div>
  )
}

// ── Table row ──────────────────────────────────────────────────────
function TableRow({ row, isLast, hS, hE, hours, totalH, services, isToday }) {
  const hasRes = row.reservations.length > 0
  const laned  = assignLanes(row.reservations, services)
  const lanes  = laned.length > 0 ? Math.max(...laned.map(r => r.lane)) + 1 : 1
  const rowH   = Math.max(56, lanes * 48)

  return (
    <div style={{
      display:             'grid',
      gridTemplateColumns: '140px 1fr',
      borderBottom:        isLast ? 'none' : `1px solid ${BORDER}`,
      minHeight:           rowH,
    }}>

      {/* ── Info — name + status dot only ── */}
      <div style={{
        padding:        '0 14px',
        borderRight:    `2px solid rgba(43,33,24,0.10)`,
        display:        'flex',
        alignItems:     'center',
        gap:            9,
        background:     hasRes ? '#fdfaf7' : '#fff',
        flexShrink:     0,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
          background:  hasRes ? GREEN : 'rgba(43,33,24,0.15)',
          boxShadow:   hasRes ? `0 0 0 3px ${GREEN}22` : 'none',
        }} />
        <span style={{ fontSize: 13, fontWeight: 900, color: DARK, letterSpacing: '-0.3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {row.table_name}
        </span>
        {hasRes && (
          <span style={{ fontSize: 9, fontWeight: 900, padding: '2px 5px', background: DARK, color: GOLD, flexShrink: 0 }}>
            {row.reservations.length}
          </span>
        )}
      </div>

      {/* ── Track ── */}
      <div style={{ position: 'relative', overflow: 'visible', background: hasRes ? '#fff' : '#fafaf8', minHeight: rowH }}>

        {/* Alternating hour backgrounds */}
        {hours.map((h, i) => (
          <div key={`bg-${h}`} style={{ position: 'absolute', left: `${(i/totalH)*100}%`, width: `${(1/totalH)*100}%`, top: 0, bottom: 0, background: i%2===0 ? 'transparent' : 'rgba(43,33,24,0.015)', pointerEvents: 'none' }} />
        ))}

        {/* Hour lines */}
        {hours.map((h, i) => i > 0 && (
          <div key={`gl-${h}`} style={{ position: 'absolute', left: `${(i/totalH)*100}%`, top: 0, bottom: 0, width: 1, background: 'rgba(43,33,24,0.07)', pointerEvents: 'none' }} />
        ))}

        {/* Half-hour ticks */}
        {hours.map((h, i) => (
          <div key={`ht-${h}`} style={{ position: 'absolute', left: `${((i+0.5)/totalH)*100}%`, top: '60%', bottom: 0, width: 1, background: 'rgba(43,33,24,0.04)', pointerEvents: 'none' }} />
        ))}

        {/* Now line */}
        {isToday && (() => {
          const now = new Date()
          const dec = now.getHours() + now.getMinutes() / 60
          if (dec < hS || dec > hE) return null
          return (
            <div style={{ position: 'absolute', left: `${((dec-hS)/totalH)*100}%`, top: 0, bottom: 0, width: 2, background: RED, zIndex: 40, pointerEvents: 'none', boxShadow: `0 0 8px ${RED}88` }}>
              <div style={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, borderRadius: '50%', background: RED }} />
            </div>
          )
        })()}

        {/* Free label */}
        {!hasRes && (
          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 9, fontWeight: 900, color: 'rgba(43,33,24,0.08)', letterSpacing: '0.3em', textTransform: 'uppercase', pointerEvents: 'none', userSelect: 'none' }}>
            libre
          </span>
        )}

        {laned.map(res => (
          <ResBlock key={res.id} res={res} laneCount={lanes} laneIndex={res.lane} hS={hS} hE={hE} services={services} />
        ))}
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────
export default function TableTimeline({ controlledDate = null }) {
  const { timeline, loading, error, date, setDate, allOH, services } = useTablesTimeline()
  const today   = new Date().toISOString().slice(0, 10)
  const isToday = date === today

  useEffect(() => {
    if (controlledDate && controlledDate !== date) setDate(controlledDate)
  }, [controlledDate]) // eslint-disable-line

  const occupied = timeline.filter(t => t.reservations.length > 0).length
  const free     = timeline.length - occupied
  const totalRes = timeline.reduce((s, t) => s + t.reservations.length, 0)

  const { hStart, hEnd } = useMemo(() => getOpenHours(allOH, date), [allOH, date])
  const totalH = Math.max(1, hEnd - hStart)
  const hours  = Array.from({ length: hEnd - hStart }, (_, i) => hStart + i)

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* ── Date nav bar ── */}
      <div style={{ display: 'flex', alignItems: 'stretch', marginBottom: 14, border: `2px solid ${DARK}`, overflow: 'hidden' }}>

        <button
          onClick={() => setDate(offsetDate(date, -1))}
          style={{ width: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: 'none', borderRight: `2px solid ${DARK}`, cursor: 'pointer', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = CREAM}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <ChevronLeft size={17} strokeWidth={2.5} color={DARK} />
        </button>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', background: DARK, minWidth: 0 }}>
          <CalendarDays size={13} color={GOLD} strokeWidth={2.5} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', textTransform: 'capitalize', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {formatDateLong(date)}
          </span>
          {!loading && timeline.length > 0 && (
            <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
              {occupied > 0 && (
                <span style={{ padding: '3px 8px', background: GREEN, fontSize: 10, fontWeight: 900, color: '#fff' }}>
                  {occupied} occupée{occupied > 1 ? 's' : ''}
                </span>
              )}
              <span style={{ padding: '3px 8px', background: 'rgba(255,255,255,0.1)', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                {free} libre{free > 1 ? 's' : ''}
              </span>
              {totalRes > 0 && (
                <span style={{ padding: '3px 8px', background: 'rgba(200,169,126,0.25)', fontSize: 10, fontWeight: 900, color: GOLD }}>
                  {totalRes} résa
                </span>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setDate(offsetDate(date, 1))}
          style={{ width: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: 'none', borderLeft: `2px solid ${DARK}`, cursor: 'pointer', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = CREAM}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <ChevronRight size={17} strokeWidth={2.5} color={DARK} />
        </button>

        <input
          type="date" value={date}
          onChange={e => { if (e.target.value) setDate(e.target.value) }}
          style={{ padding: '0 10px', border: 'none', borderLeft: `2px solid ${DARK}`, fontSize: 12, fontWeight: 700, color: DARK, fontFamily: 'inherit', background: CREAM, cursor: 'pointer', outline: 'none', width: 126, flexShrink: 0 }}
        />

        {!isToday && (
          <button
            onClick={() => setDate(today)}
            style={{ padding: '0 14px', background: GOLD, border: 'none', borderLeft: `2px solid ${DARK}`, fontSize: 11, fontWeight: 900, color: DARK, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}
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
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', background: DARK }}>
          <div style={{ padding: '10px 14px', borderRight: `2px solid rgba(200,169,126,0.15)`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <LayoutGrid size={11} color={GOLD} strokeWidth={2.5} />
            <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Table</span>
          </div>
          <div style={{ position: 'relative', height: 36, overflowX: 'hidden' }}>
            {hours.map((h, i) => {
              const isNow = isToday && new Date().getHours() === h
              return (
                <div key={h} style={{
                  position: 'absolute', left: `${(i/totalH)*100}%`, width: `${(1/totalH)*100}%`,
                  top: 0, bottom: 0, display: 'flex', alignItems: 'center', paddingLeft: 5,
                  borderLeft: i > 0 ? '1px solid rgba(200,169,126,0.1)' : 'none',
                  background: isNow ? 'rgba(239,68,68,0.12)' : 'transparent',
                }}>
                  <span style={{ fontSize: 10, fontWeight: isNow ? 900 : 600, color: isNow ? RED : 'rgba(200,169,126,0.6)', whiteSpace: 'nowrap' }}>
                    {String(h % 24).padStart(2,'0')}h
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ padding: '60px 0', textAlign: 'center', background: '#fff' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', border: `3px solid ${BORDER}`, borderTopColor: GOLD, animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'rgba(43,33,24,0.3)' }}>Chargement…</p>
          </div>
        )}

        {/* No tables */}
        {!loading && timeline.length === 0 && (
          <div style={{ padding: '60px 24px', textAlign: 'center', background: '#fff' }}>
            <LayoutGrid size={36} color={DARK} strokeWidth={1.2} style={{ display: 'block', margin: '0 auto 14px', opacity: 0.12 }} />
            <p style={{ margin: '0 0 6px', fontSize: 14, fontWeight: 900, color: DARK }}>Aucune table configurée</p>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'rgba(43,33,24,0.3)' }}>Ajoutez des tables dans la section Tables.</p>
          </div>
        )}

        {/* Empty day */}
        {!loading && timeline.length > 0 && totalRes === 0 && (
          <>
            <div style={{ padding: '14px 20px', background: '#fdf6ec', borderBottom: `1px solid rgba(200,169,126,0.2)`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <CalendarDays size={18} color={GOLD_DARK} strokeWidth={2} style={{ flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 900, color: DARK }}>
                  Aucune réservation {isToday ? "aujourd'hui" : `le ${formatDateShort(date)}`}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 11, fontWeight: 600, color: GOLD_DARK }}>
                  {timeline.length} table{timeline.length > 1 ? 's' : ''} disponible{timeline.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            {timeline.map((row, i) => (
              <TableRow key={row.table_id} row={row} isLast={i===timeline.length-1} hS={hStart} hE={hEnd} hours={hours} totalH={totalH} services={services} isToday={isToday} />
            ))}
          </>
        )}

        {/* Normal rows */}
        {!loading && timeline.length > 0 && totalRes > 0 && timeline.map((row, i) => (
          <TableRow key={row.table_id} row={row} isLast={i===timeline.length-1} hS={hStart} hE={hEnd} hours={hours} totalH={totalH} services={services} isToday={isToday} />
        ))}
      </div>
    </div>
  )
}