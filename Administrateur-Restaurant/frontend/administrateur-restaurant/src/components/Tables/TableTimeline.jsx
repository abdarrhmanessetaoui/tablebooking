import { useState } from 'react'
import {
  CalendarDays, ChevronLeft, ChevronRight,
  RefreshCw, LayoutGrid, Users, MapPin, Clock,
} from 'lucide-react'
import useTablesTimeline from '../../hooks/Tables/useTablesTimeline'

const DARK      = '#2b2118'
const GOLD      = '#c8a97e'
const GOLD_DARK = '#a8834e'
const CREAM     = '#faf8f5'
const BORDER    = 'rgba(43,33,24,0.12)'

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
  const end         = toDecimal(endTime) ?? (start + 2)
  const totalHours  = HOUR_END - HOUR_START
  const left        = ((start - HOUR_START) / totalHours) * 100
  const width       = ((end - start) / totalHours) * 100
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

// ── Nav button ─────────────────────────────────────────────────────

function NavBtn({ onClick, title, children }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick} title={title}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 34, height: 34,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: hov ? GOLD : '#fff',
        border: `2px solid ${DARK}`,
        cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}

// ── Reservation block ──────────────────────────────────────────────

function ResBlock({ res }) {
  const [hov, setHov] = useState(false)
  const pos    = blockPosition(res.start_time, res.end_time)
  if (!pos) return null
  const scheme = STATUS_BLOCK[res.status] ?? STATUS_BLOCK.Pending

  return (
    <div
      title={`${res.customer_name} · ${res.guests} pers. · ${res.start_time}${res.end_time ? '–' + res.end_time : ''}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'absolute',
        left: pos.left, width: pos.width,
        top: '50%', transform: 'translateY(-50%)',
        height: hov ? 30 : 24,
        background: scheme.bg,
        borderLeft: `3px solid ${scheme.border}`,
        display: 'flex', alignItems: 'center',
        padding: '0 7px', overflow: 'hidden',
        cursor: 'default', transition: 'height 0.1s',
        zIndex: hov ? 10 : 1,
        boxShadow: hov ? '0 2px 12px rgba(43,33,24,0.25)' : 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {res.customer_name}
        <span style={{ fontWeight: 600, opacity: 0.7, marginLeft: 4 }}>
          {res.start_time}{res.end_time ? '–' + res.end_time : ''}
        </span>
      </span>
    </div>
  )
}

// ── Table row ──────────────────────────────────────────────────────

function TimelineRow({ row }) {
  const locStyle = LOC_COLORS[row.location] ?? { bg: '#f5f5f5', color: '#666' }
  const hasRes   = row.reservations.length > 0

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '160px 1fr',
      borderBottom: `1px solid ${BORDER}`,
      minHeight: 52,
    }}>
      {/* Info cell */}
      <div style={{
        padding: '10px 14px', borderRight: `2px solid ${DARK}`,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        background: '#fff', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
          <LayoutGrid size={12} color={DARK} strokeWidth={2.5} />
          <span style={{ fontSize: 13, fontWeight: 900, color: DARK, letterSpacing: '-0.3px' }}>
            {row.table_name}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            padding: '2px 6px', background: '#fdf6ec',
            fontSize: 10, fontWeight: 800, color: GOLD_DARK,
          }}>
            <Users size={9} strokeWidth={2.5} color={GOLD_DARK} />
            {row.capacity}
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            padding: '2px 6px', background: locStyle.bg,
            fontSize: 10, fontWeight: 700, color: locStyle.color,
          }}>
            <MapPin size={9} strokeWidth={2.5} color={locStyle.color} />
            {row.location}
          </span>
        </div>
      </div>

      {/* Timeline track */}
      <div style={{ position: 'relative', overflow: 'hidden', background: hasRes ? '#fff' : CREAM }}>
        {/* Hour grid lines */}
        {HOURS.map((h, i) => (
          <div key={h} style={{
            position: 'absolute', left: `${(i / (HOUR_END - HOUR_START)) * 100}%`,
            top: 0, bottom: 0, width: 1,
            background: i === 0 ? 'transparent' : BORDER,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Free label */}
        {!hasRes && (
          <span style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            fontSize: 10, fontWeight: 800,
            color: 'rgba(43,33,24,0.18)',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            pointerEvents: 'none', userSelect: 'none',
          }}>
            libre
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

// ── Main component ─────────────────────────────────────────────────

export default function TableTimeline() {
  const { timeline, loading, error, date, setDate, refresh } = useTablesTimeline()

  const today    = new Date().toISOString().slice(0, 10)
  const occupied = timeline.filter(t => t.reservations.length > 0).length
  const free     = timeline.length - occupied

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans','DM Sans',system-ui,sans-serif", marginTop: 48 }}>

      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: DARK, letterSpacing: '-0.8px' }}>
            Planning des tables
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DARK }}>
            Vue journalière · {formatDate(date)}
          </p>
        </div>
        {!loading && (
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ padding: '4px 12px', background: '#1a6e42', fontSize: 11, fontWeight: 900, color: '#fff' }}>
              {occupied} occupée{occupied !== 1 ? 's' : ''}
            </span>
            <span style={{ padding: '4px 12px', background: CREAM, border: `1.5px solid ${BORDER}`, fontSize: 11, fontWeight: 900, color: DARK }}>
              {free} libre{free !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: 2, background: DARK, marginBottom: 16 }} />

      {/* Date nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <NavBtn onClick={() => setDate(offsetDate(date, -1))} title="Jour précédent">
          <ChevronLeft size={15} strokeWidth={2.5} color={DARK} />
        </NavBtn>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 14px', background: DARK, flex: 1, minWidth: 180,
        }}>
          <CalendarDays size={13} color={GOLD} strokeWidth={2.5} />
          <span style={{ fontSize: 13, fontWeight: 900, color: '#fff', flex: 1, letterSpacing: '-0.3px' }}>
            {formatDate(date)}
          </span>
        </div>

        <NavBtn onClick={() => setDate(offsetDate(date, 1))} title="Jour suivant">
          <ChevronRight size={15} strokeWidth={2.5} color={DARK} />
        </NavBtn>

        {date !== today && (
          <button
            onClick={() => setDate(today)}
            style={{
              padding: '6px 14px', background: GOLD, border: 'none',
              fontSize: 11, fontWeight: 900, color: DARK,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
            onMouseEnter={e => e.currentTarget.style.background = GOLD_DARK}
            onMouseLeave={e => e.currentTarget.style.background = GOLD}
          >
            Aujourd'hui
          </button>
        )}

        <button
          onClick={refresh}
          title="Actualiser"
          style={{
            width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#fff', border: `2px solid ${BORDER}`, cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = DARK}
          onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}
        >
          <RefreshCw size={13} color={DARK} strokeWidth={2.5} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{ marginBottom: 14, padding: '10px 14px', background: '#fdf0f0', borderLeft: '3px solid #b94040', fontSize: 12, fontWeight: 700, color: '#b94040' }}>
          {error}
        </div>
      )}

      {/* Timeline */}
      <div style={{ border: `2px solid ${DARK}`, overflow: 'hidden' }}>

        {/* Header with hour labels */}
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', background: DARK, position: 'sticky', top: 0, zIndex: 5 }}>
          <div style={{ padding: '8px 14px', borderRight: `2px solid rgba(200,169,126,0.2)`, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={11} color={GOLD} strokeWidth={2.5} />
            <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              Table
            </span>
          </div>
          <div style={{ position: 'relative', height: 34 }}>
            {HOURS.map((h, i) => (
              <div key={h} style={{
                position: 'absolute',
                left: `${(i / (HOUR_END - HOUR_START)) * 100}%`,
                top: 0, bottom: 0,
                display: 'flex', alignItems: 'center', paddingLeft: 4,
                borderLeft: i > 0 ? '1px solid rgba(200,169,126,0.2)' : 'none',
              }}>
                <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                  {String(h % 24).padStart(2, '0')}:00
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              border: `2.5px solid ${BORDER}`, borderTopColor: GOLD,
              animation: 'spin 0.8s linear infinite', margin: '0 auto',
            }} />
          </div>
        )}

        {/* Empty */}
        {!loading && timeline.length === 0 && (
          <div style={{ padding: '52px 24px', textAlign: 'center' }}>
            <LayoutGrid size={36} color={DARK} strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 12px' }} />
            <p style={{ margin: 0, fontSize: 14, fontWeight: 900, color: DARK }}>Aucune table active</p>
            <p style={{ margin: '4px 0 0', fontSize: 12, fontWeight: 700, color: GOLD_DARK }}>
              Configurez vos tables dans la section Tables.
            </p>
          </div>
        )}

        {/* Rows */}
        {!loading && timeline.map(row => (
          <TimelineRow key={row.table_id} row={row} />
        ))}
      </div>

      {/* Legend */}
      {!loading && timeline.length > 0 && (
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 10, padding: '10px 14px', background: CREAM, border: `1px solid ${BORDER}` }}>
          <span style={{ fontSize: 9, fontWeight: 900, color: DARK, letterSpacing: '0.14em', textTransform: 'uppercase', alignSelf: 'center' }}>
            Légende
          </span>
          {[
            { bg: '#1a6e42', border: '#22c55e', label: 'Confirmée'  },
            { bg: '#7a5c1e', border: '#c8a97e', label: 'En attente' },
          ].map(s => (
            <span key={s.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: DARK }}>
              <span style={{ width: 14, height: 12, background: s.bg, borderLeft: `3px solid ${s.border}`, flexShrink: 0 }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}