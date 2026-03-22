import { useState, useEffect, useMemo } from 'react'
import { ChevronLeft, ChevronRight, LayoutGrid, Clock, CalendarDays, Utensils, Users } from 'lucide-react'
import useTablesTimeline from '../../hooks/Tables/useTablesTimeline'
import { RED } from '../../styles/dashboard/tokens'

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

// ── Pure helpers ───────────────────────────────────────────────────
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

function formatLong(iso) {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatShort(iso) {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

function shift(iso, n) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
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
  return s?.duration ? Math.max(0.25, parseInt(s.duration) / 60) : 1
}

function getPos(startT, endT, hS, hE) {
  const s = toDecimal(startT)
  if (s === null) return null
  const e  = toDecimal(endT) ?? (s + 1)
  const tH = hE - hS
  if (tH <= 0) return null
  const l = ((s - hS) / tH) * 100
  const w = ((e - s)  / tH) * 100
  return { l: Math.max(0, l), w: Math.max(0.4, Math.min(w, 100 - Math.max(0, l))), wn: w }
}

function lanes(reservations, services) {
  const sorted = [...reservations].sort(
    (a, b) => (toDecimal(a.start_time) ?? 0) - (toDecimal(b.start_time) ?? 0)
  )
  const ends = []
  return sorted.map(r => {
    const s   = toDecimal(r.start_time) ?? 0
    const dur = getDur(services, r.service)
    const e   = r.end_time ? (toDecimal(r.end_time) ?? (s + dur)) : (s + dur)
    let lane  = ends.findIndex(x => x <= s + 0.01)
    if (lane === -1) lane = ends.length
    ends[lane] = e
    return { ...r, _e: e, lane }
  })
}

// ── Tooltip ───────────────────────────────────────────────────────
function Tip({ res, endTime }) {
  const sc = STATUS[res.status] ?? STATUS.Pending
  return (
    <div style={{
      position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%',
      transform: 'translateX(-50%)',
      background: DARK, padding: '10px 14px', zIndex: 9999,
      pointerEvents: 'none', boxShadow: '0 8px 28px rgba(0,0,0,0.5)',
      minWidth: 200, maxWidth: 260,
      fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif",
    }}>
      {/* Status */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', background: sc.bg, marginBottom: 8 }}>
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: sc.border }} />
        <span style={{ fontSize: 9, fontWeight: 900, color: sc.text, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {sc.label}
        </span>
      </div>
      {/* Name */}
      <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 900, color: '#fff', whiteSpace: 'normal', wordBreak: 'break-word', letterSpacing: '-0.2px' }}>
        {res.customer_name}
      </p>
      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[
          { Icon: Clock,    v: `${res.start_time}${endTime ? ` – ${endTime}` : ''}` },
          { Icon: Users,    v: `${res.guests} pers.` },
          { Icon: Utensils, v: res.service || null },
        ].filter(x => x.v).map(({ Icon, v }) => (
          <div key={v} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Icon size={10} color={GOLD} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{v}</span>
          </div>
        ))}
      </div>
      {/* Arrow */}
      <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${DARK}` }} />
    </div>
  )
}

// ── Reservation block ──────────────────────────────────────────────
function Block({ res, laneCount, laneIdx, hS, hE, services }) {
  const [hov, setHov] = useState(false)

  const dur     = getDur(services, res.service)
  const sD      = toDecimal(res.start_time) ?? 0
  const eD      = res.end_time ? (toDecimal(res.end_time) ?? (sD + dur)) : (sD + dur)
  const endTime = res.end_time || decimalToTime(eD)
  const pos     = getPos(res.start_time, decimalToTime(eD), hS, hE)
  if (!pos) return null

  const sc      = STATUS[res.status] ?? STATUS.Pending
  const rowPctH = 84 / laneCount
  const topPct  = laneCount === 1 ? 50 : laneIdx * (100 / laneCount) + (100 / laneCount - rowPctH) / 2

  // Adaptive content based on width %
  const showDot      = pos.wn >= 1  && pos.wn < 5
  const showFirst    = pos.wn >= 5  && pos.wn < 12
  const showName     = pos.wn >= 12 && pos.wn < 22
  const showNameTime = pos.wn >= 22

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position:       'absolute',
        left:           `${pos.l.toFixed(3)}%`,
        width:          `${pos.w.toFixed(3)}%`,
        top:            laneCount === 1 ? '50%' : `${topPct}%`,
        transform:      laneCount === 1 ? 'translateY(-50%)' : 'none',
        height:         laneCount === 1 ? '72%' : `${rowPctH}%`,
        minHeight:      22,
        background:     sc.bg,
        borderLeft:     `3px solid ${sc.border}`,
        borderRadius:   '0 3px 3px 0',
        display:        'flex',
        alignItems:     'center',
        justifyContent: showDot ? 'center' : 'flex-start',
        padding:        pos.wn < 5 ? '0 2px' : '0 7px',
        overflow:       'hidden',
        cursor:         'default',
        zIndex:         hov ? 50 : laneIdx + 2,
        transition:     'box-shadow 0.1s, filter 0.1s',
        boxShadow:      hov ? '0 4px 14px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.18)',
        filter:         hov ? 'brightness(1.08)' : 'none',
        gap:            5,
        whiteSpace:     'nowrap',
      }}
    >
      {hov && <Tip res={res} endTime={endTime} />}

      {/* Sliver — nothing */}
      {pos.wn < 1 && null}

      {/* Dot only */}
      {showDot && (
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.8)', flexShrink: 0 }} />
      )}

      {/* First name initial */}
      {showFirst && (
        <span style={{ fontSize: 10, fontWeight: 900, color: sc.text, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {res.customer_name.charAt(0).toUpperCase()}
        </span>
      )}

      {/* First name */}
      {showName && (
        <span style={{ fontSize: 10, fontWeight: 900, color: sc.text, overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
          {res.customer_name.split(' ')[0]}
        </span>
      )}

      {/* Full name + time */}
      {showNameTime && (
        <>
          <span style={{ fontSize: laneCount > 2 ? 9 : 11, fontWeight: 900, color: sc.text, overflow: 'hidden', textOverflow: 'ellipsis', flexShrink: 1, minWidth: 0 }}>
            {res.customer_name}
          </span>
          {pos.wn > 30 && laneCount <= 2 && (
            <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.65)', flexShrink: 0 }}>
              {res.start_time}–{endTime}
            </span>
          )}
        </>
      )}
    </div>
  )
}

// ── Table row ──────────────────────────────────────────────────────
function Row({ row, isLast, hS, hE, hours, totalH, services, isToday }) {
  const hasRes   = row.reservations.length > 0
  const laned    = lanes(row.reservations, services)
  const laneCount = laned.length > 0 ? Math.max(...laned.map(r => r.lane)) + 1 : 1
  const rowH     = Math.max(54, laneCount * 46)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', borderBottom: isLast ? 'none' : `1px solid ${BORDER}`, minHeight: rowH }}>

      {/* Table name */}
      <div style={{ padding: '0 12px', borderRight: `1px solid rgba(43,33,24,0.10)`, display: 'flex', alignItems: 'center', gap: 8, background: hasRes ? '#fdfaf7' : '#fff', flexShrink: 0 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: hasRes ? GREEN : 'rgba(43,33,24,0.14)', boxShadow: hasRes ? `0 0 0 3px ${GREEN}20` : 'none', transition: 'all 0.2s' }} />
        <span style={{ fontSize: 12, fontWeight: 900, color: DARK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
          {row.table_name}
        </span>
        {hasRes && (
          <span style={{ fontSize: 9, fontWeight: 900, padding: '1px 4px', background: DARK, color: GOLD, flexShrink: 0 }}>
            {row.reservations.length}
          </span>
        )}
      </div>

      {/* Track */}
      <div style={{ position: 'relative', overflow: 'visible', background: hasRes ? '#fff' : '#fafaf8', minHeight: rowH }}>

        {/* Alt hour backgrounds */}
        {hours.map((h, i) => (
          <div key={`bg${h}`} style={{ position: 'absolute', left: `${(i/totalH)*100}%`, width: `${(1/totalH)*100}%`, top: 0, bottom: 0, background: i%2===0 ? 'transparent' : 'rgba(43,33,24,0.012)', pointerEvents: 'none' }} />
        ))}

        {/* Hour lines */}
        {hours.map((h, i) => i > 0 && (
          <div key={`hl${h}`} style={{ position: 'absolute', left: `${(i/totalH)*100}%`, top: 0, bottom: 0, width: 1, background: 'rgba(43,33,24,0.07)', pointerEvents: 'none' }} />
        ))}

        {/* Half-hour ticks */}
        {hours.map((h, i) => (
          <div key={`hh${h}`} style={{ position: 'absolute', left: `${((i+0.5)/totalH)*100}%`, top: '55%', bottom: 0, width: 1, background: 'rgba(43,33,24,0.035)', pointerEvents: 'none' }} />
        ))}

        {/* Now line */}
        {isToday && (() => {
          const dec = new Date().getHours() + new Date().getMinutes() / 60
          if (dec < hS || dec > hE) return null
          return (
            <div style={{ position: 'absolute', left: `${((dec-hS)/totalH)*100}%`, top: 0, bottom: 0, width: 2, background: RED, zIndex: 40, pointerEvents: 'none', boxShadow: `0 0 6px ${RED}99` }}>
              <div style={{ position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)', width: 7, height: 7, borderRadius: '50%', background: RED }} />
            </div>
          )
        })()}

        {/* Free watermark */}
        {!hasRes && (
          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: 8, fontWeight: 900, color: 'rgba(43,33,24,0.07)', letterSpacing: '0.35em', textTransform: 'uppercase', pointerEvents: 'none', userSelect: 'none' }}>
            libre
          </span>
        )}

        {laned.map(res => (
          <Block key={res.id} res={res} laneCount={laneCount} laneIdx={res.lane} hS={hS} hE={hE} services={services} />
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

  const { hS, hE } = useMemo(() => getOpenHours(allOH, date), [allOH, date])
  const totalH   = Math.max(1, hE - hS)
  const hours    = Array.from({ length: hE - hS }, (_, i) => hS + i)
  const totalRes = timeline.reduce((s, t) => s + t.reservations.length, 0)

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif" }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>

      {/* ── Date nav ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>

        <button onClick={() => setDate(shift(date, -1))}
          style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: `2px solid ${DARK}`, cursor: 'pointer', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = CREAM}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <ChevronLeft size={15} strokeWidth={2.5} color={DARK} />
        </button>

        <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', background: DARK }}>
          <CalendarDays size={12} color={GOLD} strokeWidth={2.5} style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 900, color: '#fff', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {formatLong(date)}
          </span>
        </div>

        <button onClick={() => setDate(shift(date, 1))}
          style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: `2px solid ${DARK}`, cursor: 'pointer', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.background = CREAM}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          <ChevronRight size={15} strokeWidth={2.5} color={DARK} />
        </button>

        <input type="date" value={date}
          onChange={e => { if (e.target.value) setDate(e.target.value) }}
          style={{ height: 32, padding: '0 8px', border: `2px solid ${DARK}`, fontSize: 12, fontWeight: 700, color: DARK, fontFamily: 'inherit', background: CREAM, cursor: 'pointer', outline: 'none', flexShrink: 0 }}
        />

        {!isToday && (
          <button onClick={() => setDate(today)}
            style={{ height: 32, padding: '0 12px', background: GOLD, border: 'none', fontSize: 11, fontWeight: 900, color: DARK, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0 }}
            onMouseEnter={e => e.currentTarget.style.background = GOLD_DARK}
            onMouseLeave={e => e.currentTarget.style.background = GOLD}
          >
            Aujourd'hui
          </button>
        )}
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ marginBottom: 10, padding: '10px 14px', background: '#fef2f2', borderLeft: `3px solid ${RED}`, fontSize: 12, fontWeight: 700, color: RED }}>
          {error}
        </div>
      )}

      {/* ── Grid ── */}
      <div style={{ border: `2px solid ${DARK}`, overflow: 'hidden' }}>

        {/* Hour header */}
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', background: DARK }}>
          <div style={{ padding: '8px 12px', borderRight: `1px solid rgba(200,169,126,0.15)`, display: 'flex', alignItems: 'center', gap: 6 }}>
            <LayoutGrid size={10} color={GOLD} strokeWidth={2.5} />
            <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Table</span>
          </div>
          <div style={{ position: 'relative', height: 32, overflowX: 'hidden' }}>
            {hours.map((h, i) => {
              const isNow = isToday && new Date().getHours() === h
              return (
                <div key={h} style={{ position: 'absolute', left: `${(i/totalH)*100}%`, width: `${(1/totalH)*100}%`, top: 0, bottom: 0, display: 'flex', alignItems: 'center', paddingLeft: 4, borderLeft: i > 0 ? '1px solid rgba(200,169,126,0.1)' : 'none', background: isNow ? 'rgba(239,68,68,0.1)' : 'transparent' }}>
                  <span style={{ fontSize: 9, fontWeight: isNow ? 900 : 500, color: isNow ? RED : 'rgba(200,169,126,0.55)', whiteSpace: 'nowrap' }}>
                    {String(h % 24).padStart(2,'0')}h
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ padding: '48px 0', textAlign: 'center', background: '#fff' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', border: `3px solid ${BORDER}`, borderTopColor: GOLD, animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'rgba(43,33,24,0.3)' }}>Chargement…</p>
          </div>
        )}

        {/* No tables */}
        {!loading && timeline.length === 0 && (
          <div style={{ padding: '48px 24px', textAlign: 'center', background: '#fff' }}>
            <LayoutGrid size={32} color={DARK} strokeWidth={1.2} style={{ display: 'block', margin: '0 auto 12px', opacity: 0.1 }} />
            <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 900, color: DARK }}>Aucune table configurée</p>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: 'rgba(43,33,24,0.3)' }}>Ajoutez des tables dans la section Tables.</p>
          </div>
        )}

        {/* Empty day banner */}
        {!loading && timeline.length > 0 && totalRes === 0 && (
          <div style={{ padding: '12px 16px', background: '#fdf6ec', borderBottom: `1px solid rgba(200,169,126,0.18)`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <CalendarDays size={14} color={GOLD_DARK} strokeWidth={2} style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: DARK }}>
              Aucune réservation {isToday ? "aujourd'hui" : `le ${formatShort(date)}`}
              <span style={{ fontWeight: 600, color: GOLD_DARK, marginLeft: 8 }}>
                · {timeline.length} table{timeline.length > 1 ? 's' : ''} libre{timeline.length > 1 ? 's' : ''}
              </span>
            </p>
          </div>
        )}

        {/* Rows — always render so structure is visible even on empty days */}
        {!loading && timeline.map((row, i) => (
          <Row
            key={row.table_id} row={row} isLast={i === timeline.length - 1}
            hS={hS} hE={hE} hours={hours} totalH={totalH}
            services={services} isToday={isToday}
          />
        ))}
      </div>
    </div>
  )
}