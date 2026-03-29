import { useState, useEffect, useMemo, useRef } from 'react'
import {
  LayoutGrid, Clock, CalendarDays, Utensils,
  Users, ChevronLeft, ChevronRight, ChevronDown,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import useTablesTimeline from '../../hooks/Tables/useTablesTimeline'
import { RED }          from '../../styles/dashboard/tokens'
import '../../styles/tables/TableTimeline.css'
import { GOLD, GOLD_DK, DARK, GREEN, BORDER_SOFT } from '../../styles/tables/tokens'

// ─── Date helpers ─────────────────────────────────────────────────
function localToday() {
  const d = new Date()
  return (
    d.getFullYear() +
    '-' + String(d.getMonth() + 1).padStart(2, '0') +
    '-' + String(d.getDate()).padStart(2, '0')
  )
}
const TODAY = localToday()

function toDecimal(t) {
  if (!t) return null
  const [h, m] = t.split(':').map(Number)
  return h + (m || 0) / 60
}
function decimalToTime(dec) {
  const h = Math.floor(dec % 24)
  const m = Math.round((dec - Math.floor(dec)) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
function formatShort(iso, lang = 'fr-FR') {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString(lang, {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}
function formatMonthYear(y, m, lang = 'fr-FR') {
  return new Date(y, m, 1).toLocaleDateString(lang, { month: 'long', year: 'numeric' })
}
function toISO(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
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
    const s   = toDecimal(r.start_time) ?? 0
    const dur = getDur(services, r.service)
    const e   = r.end_time ? (toDecimal(r.end_time) ?? (s + dur)) : (s + dur)
    let lane  = ends.findIndex(x => x <= s + 0.005)
    if (lane === -1) lane = ends.length
    ends[lane] = e
    return { ...r, _e: e, lane }
  })
}

// ─── Mini Calendar ────────────────────────────────────────────────
function MiniCal({ value, onChange, t, lang }) {
  const todayISO  = TODAY
  const todayDate = new Date(todayISO + 'T00:00:00')
  const init      = value ? new Date(value + 'T00:00:00') : todayDate
  const [cur, setCur] = useState({ y: init.getFullYear(), m: init.getMonth() })

  const DAYS = [
    t('tables_module.mon'), t('tables_module.tue'), t('tables_module.wed'),
    t('tables_module.thu'), t('tables_module.fri'), t('tables_module.sat'),
    t('tables_module.sun'),
  ]
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
    <div className="mini-cal">
      <div className="mini-cal__header">
        <button
          onClick={() => setCur(c => c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 })}
          className="mini-cal__nav-btn"
        >
          {lang === 'ar'
            ? <ChevronRight size={14} color={GOLD} strokeWidth={2.5} />
            : <ChevronLeft  size={14} color={GOLD} strokeWidth={2.5} />}
        </button>
        <span className="mini-cal__month-label">
          {formatMonthYear(cur.y, cur.m, lang)}
        </span>
        <button
          onClick={() => setCur(c => c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 })}
          className="mini-cal__nav-btn"
        >
          {lang === 'ar'
            ? <ChevronLeft  size={14} color={GOLD} strokeWidth={2.5} />
            : <ChevronRight size={14} color={GOLD} strokeWidth={2.5} />}
        </button>
      </div>

      <div className="mini-cal__day-names">
        {DAYS.map((d, i) => (
          <div key={i} className="mini-cal__day-name">{d}</div>
        ))}
      </div>

      <div className="mini-cal__days">
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />
          const iso   = toISO(cur.y, cur.m, day)
          const isSel = iso === value
          const isTdy = iso === todayISO
          return (
            <button
              key={day}
              onClick={() => onChange(iso)}
              className={`mini-cal__day-btn ${isSel ? 'mini-cal__day-btn--selected' : ''} ${isTdy && !isSel ? 'mini-cal__day-btn--today' : ''}`}
              style={{ position: 'relative' }}
            >
              {day}
              {isTdy && !isSel && <span className="mini-cal__today-dot" />}
            </button>
          )
        })}
      </div>

      <div className="mini-cal__footer">
        <button
          onClick={goToday}
          className={`mini-cal__today-btn ${value === todayISO ? 'mini-cal__today-btn--active' : ''}`}
        >
          {t('tables_module.timeline_today_badge')}
        </button>
      </div>
    </div>
  )
}

function MiniCalWithRef(props) {
  const { t, i18n } = useTranslation()
  return <MiniCal {...props} t={t} lang={i18n.language} />
}

// ─── Tooltip ─────────────────────────────────────────────────────
function useStatusMap() {
  const { t } = useTranslation()
  return {
    Confirmed: { bg: '#16A34A', border: '#86efac', text: '#fff', label: t('tables_module.confirmed') },
    Pending:   { bg: '#b45309', border: '#fcd34d', text: '#fff', label: t('tables_module.pending') },
  }
}

function Tip({ res, endTime }) {
  const { t } = useTranslation()
  const STATUS = useStatusMap()
  const sc = STATUS[res.status] ?? STATUS.Pending

  return (
    <div className="tl-tip">
      <div className="tl-tip__status-badge" style={{ background: sc.bg }}>
        <span style={{ width: 4, height: 6, borderRadius: '50%', background: sc.border }} />
        <span style={{ fontSize: 9, fontWeight: 900, color: sc.text, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {sc.label}
        </span>
      </div>
      <p className="tl-tip__name">{res.customer_name}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[
          { Icon: Clock,    v: `${res.start_time}${endTime ? ` – ${endTime}` : ''}` },
          { Icon: Users,    v: t('count_persons', { count: res.guests }) },
          { Icon: Utensils, v: res.service || null },
        ].filter(x => x.v).map(({ Icon, v }) => (
          <div key={v} className="tl-tip__detail-row">
            <Icon size={10} color={GOLD} strokeWidth={2.5} style={{ flexShrink: 0 }} />
            <span className="tl-tip__detail-text">{v}</span>
          </div>
        ))}
      </div>
      <div className="tl-tip__arrow" />
    </div>
  )
}

// ─── Timeline Block ───────────────────────────────────────────────
function Block({ res, laneCount, laneIdx, hS, hE, services, trackPx }) {
  const [hov, setHov] = useState(false)
  const STATUS = useStatusMap()

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
  const realPx  = trackPx > 0 ? (pos.wPct / 100) * trackPx : 0
  const minPx   = 44
  const dispW   = Math.max(realPx, minPx)

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
  const { t } = useTranslation()
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
    <div style={{
      display: 'grid',
      gridTemplateColumns: `${labelW}px 1fr`,
      borderBottom: isLast ? 'none' : `1px solid ${BORDER_SOFT}`,
      minHeight: rowH,
    }}>
      {/* Label */}
      <div className="tl-row__label" style={{ background: hasRes ? '#fdfaf7' : '#fff' }}>
        <div
          className="tl-row__dot"
          style={{
            background: hasRes ? GREEN : 'rgba(66,52,40,0.15)',
            boxShadow:  hasRes ? `0 0 0 3px ${GREEN}22` : 'none',
          }}
        />
        <span className="tl-row__name">{row.table_name}</span>
        {hasRes && (
          <span className="tl-row__res-badge">{row.reservations.length}</span>
        )}
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        style={{ position: 'relative', overflow: 'visible', background: hasRes ? '#fff' : '#fafaf8', minHeight: rowH }}
      >
        {hours.map((h, i) => (
          <div key={`bg${h}`} style={{ position: 'absolute', left: `${(i / totalH) * 100}%`, width: `${(1 / totalH) * 100}%`, top: 0, bottom: 0, background: i % 2 === 0 ? 'transparent' : 'rgba(66,52,40,0.013)', pointerEvents: 'none' }} />
        ))}
        {hours.map((h, i) => i > 0 && (
          <div key={`hl${h}`} style={{ position: 'absolute', left: `${(i / totalH) * 100}%`, top: 0, bottom: 0, width: 1, background: 'rgba(66,52,40,0.07)', pointerEvents: 'none' }} />
        ))}
        {hours.map((h, i) => (
          <div key={`hh${h}`} style={{ position: 'absolute', left: `${((i + 0.5) / totalH) * 100}%`, top: '55%', bottom: 0, width: 1, background: 'rgba(66,52,40,0.035)', pointerEvents: 'none' }} />
        ))}
        {isToday && (() => {
          const now = new Date()
          const dec = now.getHours() + now.getMinutes() / 60
          if (dec < hS || dec > hE) return null
          return (
            <div style={{ position: 'absolute', left: `${((dec - hS) / totalH) * 100}%`, top: 0, bottom: 0, width: 2, background: RED, zIndex: 40, pointerEvents: 'none', boxShadow: `0 0 6px ${RED}88` }} />
          )
        })()}
        {!hasRes && <span className="tl-track__free-label">{t('tables_module.free')}</span>}
        {laned.map(res => (
          <Block key={res.id} res={res} laneCount={laneCount} laneIdx={res.lane} hS={hS} hE={hE} services={services} trackPx={trackPx} />
        ))}
      </div>
    </div>
  )
}

// ─── Mobile ResRow ────────────────────────────────────────────────
function ResRow({ res, services }) {
  const { t } = useTranslation()
  const STATUS = useStatusMap()
  const sc  = STATUS[res.status] ?? STATUS.Pending
  const dur = getDur(services, res.service)
  const sD  = toDecimal(res.start_time) ?? 0
  const eD  = res.end_time ? (toDecimal(res.end_time) ?? (sD + dur)) : (sD + dur)
  const end = res.end_time || decimalToTime(eD)

  return (
    <div className="tl-res-row">
      <div className="tl-res-row__bar" style={{ background: sc.bg }} />
      <div className="tl-res-row__body">
        <div className="tl-res-row__name-row">
          <span className="tl-res-row__name">{res.customer_name}</span>
          <span className="tl-res-row__badge" style={{ background: sc.bg }}>{sc.label}</span>
        </div>
        <div className="tl-res-row__chips">
          <span className="tl-res-row__chip">
            <Clock size={12} color={GOLD_DK} strokeWidth={2.5} />
            {res.start_time}{end ? ` – ${end}` : ''}
          </span>
          <span className="tl-res-row__chip">
            <Users size={12} color={GOLD_DK} strokeWidth={2.5} />
            {t('count_persons', { count: res.guests })}
          </span>
          {res.service && (
            <span className="tl-res-row__chip">
              <Utensils size={12} color={GOLD_DK} strokeWidth={2.5} />
              {res.service}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Mobile TableCard ─────────────────────────────────────────────
function TableCard({ row, services }) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(true)
  const hasRes = row.reservations.length > 0
  const sorted = [...row.reservations].sort(
    (a, b) => (toDecimal(a.start_time) ?? 0) - (toDecimal(b.start_time) ?? 0)
  )

  return (
    <div className="tl-card">
      <button
        onClick={() => hasRes && setOpen(o => !o)}
        className={`tl-card__header ${hasRes ? 'tl-card__header--has-res' : 'tl-card__header--empty'}`}
        style={{ textAlign: i18n.language === 'ar' ? 'right' : 'left' }}
      >
        <div
          className="tl-card__dot"
          style={{
            background: hasRes ? GREEN : 'rgba(66,52,40,0.22)',
            boxShadow:  hasRes ? `0 0 0 3px ${GREEN}44` : 'none',
          }}
        />
        <span className={`tl-card__name ${hasRes ? 'tl-card__name--has-res' : 'tl-card__name--empty'}`}>
          {row.table_name}
        </span>
        {hasRes ? (
          <>
            <span className="tl-card__res-badge">
              {t('tables_module.res_count', { count: row.reservations.length })}
            </span>
            <ChevronDown
              size={16} color={GOLD} strokeWidth={2.5}
              className={`tl-chevron ${open ? 'tl-chevron--open' : ''}`}
            />
          </>
        ) : (
          <span className="tl-card__free-label">{t('tables_module.free')}</span>
        )}
      </button>
      {hasRes && open && sorted.map(res => (
        <ResRow key={res.id} res={res} services={services} />
      ))}
    </div>
  )
}

// ─── Main: TableTimeline ─────────────────────────────────────────
export default function TableTimeline({ controlledDate = null }) {
  const { t, i18n } = useTranslation()
  const { timeline, loading, error, date, setDate, allOH, services } = useTablesTimeline()
  const isToday = date === TODAY

  const [containerW, setContainerW] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 9999
  )
  const rootRef = useRef(null)
  useEffect(() => {
    if (!rootRef.current) return
    const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width))
    ro.observe(rootRef.current)
    return () => ro.disconnect()
  }, [])

  const isMobile = containerW < 640
  const labelW   = containerW < 800 ? 80 : 100
  const [calOpen, setCalOpen] = useState(false)

  useEffect(() => {
    if (controlledDate && controlledDate !== date) setDate(controlledDate)
  }, [controlledDate]) // eslint-disable-line

  const { hS, hE } = useMemo(() => getOpenHours(allOH, date), [allOH, date])
  const totalH     = Math.max(1, hE - hS)
  const hours      = Array.from({ length: hE - hS }, (_, i) => hS + i)
  const totalRes   = timeline.reduce((s, t) => s + t.reservations.length, 0)

  return (
    <div ref={rootRef} style={{ fontFamily: "'Inter',system-ui,-apple-system,sans-serif" }}>
      {error && <div className="tl-error">{error}</div>}

      {/* ── Mobile ── */}
      {isMobile && (
        <div className="tl-mobile">
          <button onClick={() => setCalOpen(o => !o)} className="tl-date-bar">
            <span className="tl-date-bar__inner">
              <CalendarDays size={14} color={GOLD} strokeWidth={2.5} />
              <span className="tl-date-bar__label">{formatShort(date, i18n.language)}</span>
              {isToday && <span className="tl-today-badge">{t('tables_module.timeline_today_badge')}</span>}
            </span>
            <ChevronDown
              size={15} color={GOLD} strokeWidth={2.5}
              className={`tl-chevron ${calOpen ? 'tl-chevron--open' : ''}`}
            />
          </button>

          {calOpen && (
            <MiniCalWithRef value={date} onChange={(d) => { setDate(d); setCalOpen(false) }} />
          )}

          {loading && (
            <div className="tl-spinner-wrap">
              <div className="tl-spinner" />
              <p className="tl-spinner-text">{t('tables_module.loading')}</p>
            </div>
          )}

          {!loading && timeline.length === 0 && (
            <div className="tl-empty">
              <LayoutGrid size={28} color={DARK} strokeWidth={1.2} style={{ display: 'block', margin: '0 auto', opacity: 0.12 }} />
              <p className="tl-empty__title">{t('tables_module.no_tables_found')}</p>
              <p className="tl-empty__sub">{t('tables_module.timeline_no_tables')}</p>
            </div>
          )}

          {!loading && timeline.length > 0 && totalRes === 0 && (
            <div className="tl-no-res">
              <CalendarDays size={14} color={GOLD_DK} strokeWidth={2} style={{ flexShrink: 0 }} />
              <p className="tl-no-res__text">
                {t('tables_module.timeline_no_reservations', {
                  dateStr: isToday ? t('tables_module.timeline_today') : t('tables_module.timeline_on', { date: formatShort(date, i18n.language) }),
                })}
                <span className="tl-no-res__sub">
                  {t('tables_module.timeline_free_tables', { count: timeline.length, plural: timeline.length !== 1 ? 's' : '' })}
                </span>
              </p>
            </div>
          )}

          {!loading && timeline.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {timeline.map(row => <TableCard key={row.table_id} row={row} services={services} />)}
            </div>
          )}
        </div>
      )}

      {/* ── Desktop ── */}
      {!isMobile && (
        <div className="tl-desktop">
          {/* Sidebar */}
          <div className="tl-sidebar">
            <MiniCalWithRef value={date} onChange={setDate} />
            <div className="tl-sidebar__datebox">
              <CalendarDays size={11} color={GOLD} strokeWidth={2.5} />
              <span className="tl-sidebar__date-label">{formatShort(date, i18n.language)}</span>
              {isToday && <span className="tl-today-badge--sm">{t('tables_module.timeline_today_badge')}</span>}
            </div>
          </div>

          {/* Timeline */}
          <div className="tl-main">
            {loading && (
              <div className="tl-spinner-wrap">
                <div className="tl-spinner" />
                <p className="tl-spinner-text">{t('tables_module.loading')}</p>
              </div>
            )}

            {!loading && timeline.length === 0 && (
              <div className="tl-empty">
                <LayoutGrid size={28} color={DARK} strokeWidth={1.2} style={{ display: 'block', margin: '0 auto', opacity: 0.12 }} />
                <p className="tl-empty__title">{t('tables_module.no_tables_found')}</p>
                <p className="tl-empty__sub">{t('tables_module.timeline_no_tables')}</p>
              </div>
            )}

            {!loading && timeline.length > 0 && totalRes === 0 && (
              <div className="tl-no-res">
                <CalendarDays size={13} color={GOLD_DK} strokeWidth={2} style={{ flexShrink: 0 }} />
                <p className="tl-no-res__text">
                  {t('tables_module.timeline_no_reservations', {
                    dateStr: isToday ? t('tables_module.timeline_today') : t('tables_module.timeline_on', { date: formatShort(date, i18n.language) }),
                  })}
                  <span className="tl-no-res__sub">
                    {t('tables_module.timeline_free_tables', { count: timeline.length, plural: timeline.length !== 1 ? 's' : '' })}
                  </span>
                </p>
              </div>
            )}

            {!loading && timeline.length > 0 && (
              <div className="tl-scroll">
                <div className="tl-inner">
                  {/* Hour header */}
                  <div className="tl-hrow" style={{ display: 'grid', gridTemplateColumns: `${labelW}px 1fr` }}>
                    <div className="tl-hrow__label-cell">
                      <LayoutGrid size={10} color={GOLD} strokeWidth={2.5} />
                      <span className="tl-hrow__label-text">{t('tables_module.header_table')}</span>
                    </div>
                    <div style={{ position: 'relative', height: 30, overflow: 'hidden' }}>
                      {hours.map((h, i) => {
                        const isNow = isToday && new Date().getHours() === h
                        return (
                          <div key={h} style={{ position: 'absolute', left: `${(i / totalH) * 100}%`, width: `${(1 / totalH) * 100}%`, top: 0, bottom: 0, display: 'flex', alignItems: 'center', paddingLeft: 4, borderLeft: i > 0 ? '1px solid rgba(200,169,126,0.12)' : 'none', background: isNow ? 'rgba(239,68,68,0.1)' : 'transparent', overflow: 'hidden' }}>
                            <span style={{ fontSize: 9, fontWeight: isNow ? 900 : 500, color: isNow ? RED : 'rgba(200,169,126,0.6)', whiteSpace: 'nowrap' }}>
                              {t('tables_module.hour_format', { hour: String(h % 24).padStart(2, '0') })}
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