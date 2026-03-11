import { useState } from 'react'
import { Trash2, CalendarOff, ChevronLeft, ChevronRight } from 'lucide-react'

const DARK   = '#2b2118'
const GOLD   = '#c8a97e'
const BORDER = '#ece6de'

const PAGE_SIZE = 10

function fmt(d) {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt)) return d
  const s = dt.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function isPast(d) {
  return new Date(d) < new Date(new Date().toDateString())
}

function PageBtn({ onClick, disabled, active, children }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        minWidth: 32, height: 32, padding: '0 6px',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: active ? DARK : hov && !disabled ? '#f0ebe4' : '#fff',
        border: `1.5px solid ${active ? DARK : BORDER}`,
        color: active ? GOLD : disabled ? '#ccc' : DARK,
        fontSize: 12, fontWeight: active ? 900 : 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
      }}>
      {children}
    </button>
  )
}

export default function BlockedDateList({ blockedDates, handleUnblock }) {
  const [page, setPage] = useState(1)
  const [hovRow, setHovRow] = useState(null)

  if (!blockedDates || blockedDates.length === 0) {
    return (
      <div style={{ padding: '56px 0', textAlign: 'center', background: '#fff', border: `1.5px solid ${BORDER}` }}>
        <CalendarOff size={40} color='#d8d0c8' strokeWidth={1.5} style={{ display: 'block', margin: '0 auto 14px' }} />
        <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#c8bfb4' }}>Aucune date bloquée</p>
        <p style={{ margin: '6px 0 0', fontSize: 12, fontWeight: 600, color: '#d8d0c8' }}>
          Utilisez le formulaire pour bloquer des dates.
        </p>
      </div>
    )
  }

  const total = Math.ceil(blockedDates.length / PAGE_SIZE)
  const safe  = Math.min(page, total)
  const items = blockedDates.slice((safe - 1) * PAGE_SIZE, safe * PAGE_SIZE)

  function getPages() {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const p = []
    p.push(1)
    if (safe > 3) p.push('…')
    for (let i = Math.max(2, safe - 1); i <= Math.min(total - 1, safe + 1); i++) p.push(i)
    if (safe < total - 2) p.push('…')
    p.push(total)
    return p
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr auto',
        padding: '11px 20px', background: DARK,
      }}>
        <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Date bloquée
        </span>
        <span style={{ fontSize: 9, fontWeight: 900, color: GOLD, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Action
        </span>
      </div>

      {/* Rows */}
      {items.map((d, i) => {
        const past = isPast(d.date)
        const idx  = (safe - 1) * PAGE_SIZE + i
        return (
          <div key={d.date ?? i}
            onMouseEnter={() => setHovRow(idx)}
            onMouseLeave={() => setHovRow(null)}
            style={{
              display: 'grid', gridTemplateColumns: '1fr auto',
              padding: 'clamp(12px,2vw,18px) 20px',
              background: hovRow === idx ? '#fdf6ec' : idx % 2 === 0 ? '#fff' : '#faf8f5',
              borderBottom: `1px solid ${BORDER}`,
              alignItems: 'center', gap: 12,
              transition: 'background 0.12s',
              opacity: past ? 0.55 : 1,
            }}>
            <div>
              <p style={{ margin: 0, fontSize: 'clamp(12px,2vw,14px)', fontWeight: 700, color: DARK, lineHeight: 1.3 }}>
                {fmt(d.date)}
              </p>
              {d.reason && (
                <p style={{ margin: '3px 0 0', fontSize: 11, fontWeight: 600, color: GOLD, fontStyle: 'italic' }}>
                  {d.reason}
                </p>
              )}
              {past && (
                <p style={{ margin: '3px 0 0', fontSize: 10, fontWeight: 800, color: '#bbb', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Passée
                </p>
              )}
            </div>
            <button onClick={() => handleUnblock(d.date)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 34, height: 34, flexShrink: 0,
                background: '#fdf0f0', border: 'none',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#b94040'}
              onMouseLeave={e => e.currentTarget.style.background = '#fdf0f0'}
              title="Débloquer"
            >
              <Trash2 size={13} strokeWidth={2.5}
                color='#b94040'
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              />
            </button>
          </div>
        )
      })}

      {/* Pagination */}
      {total > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 8,
          padding: '12px 16px',
          borderTop: `1.5px solid ${BORDER}`,
          background: '#faf8f5',
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#bbb' }}>
            {(safe - 1) * PAGE_SIZE + 1}–{Math.min(safe * PAGE_SIZE, blockedDates.length)} / {blockedDates.length}
          </span>
          <div style={{ display: 'flex', gap: 3 }}>
            <PageBtn onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safe === 1}>
              <ChevronLeft size={12} strokeWidth={2.5} />
            </PageBtn>
            {getPages().map((p, i) =>
              p === '…'
                ? <span key={`d${i}`} style={{ padding: '0 4px', fontSize: 12, color: '#bbb', lineHeight: '32px' }}>…</span>
                : <PageBtn key={p} active={p === safe} onClick={() => setPage(p)}>{p}</PageBtn>
            )}
            <PageBtn onClick={() => setPage(p => Math.min(total, p + 1))} disabled={safe === total}>
              <ChevronRight size={12} strokeWidth={2.5} />
            </PageBtn>
          </div>
        </div>
      )}
    </div>
  )
}