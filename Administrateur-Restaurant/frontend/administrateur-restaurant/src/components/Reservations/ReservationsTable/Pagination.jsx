import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { DARK, GOLD, CREAM, BORDER } from '../../../styles/reservations/tokens'
import { pageBtnStyle } from '../../../styles/reservations/table.styles'

const PAGE_SIZES = [10, 25, 50, 100]

function PageBtn({ onClick, disabled, active, children }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={pageBtnStyle(active, hov, disabled)}
    >
      {children}
    </button>
  )
}

export default function Pagination({ total, page, pageSize, setPage, setPageSize, start }) {
  const totalPages = Math.ceil(total / pageSize) || 1
  const safePage   = Math.min(page, totalPages)

  function getPages() {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages = [1]
    if (safePage > 3) pages.push('...')
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) pages.push(i)
    if (safePage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10, padding:'12px 16px', borderTop:`4px solid ${BORDER}`, background:CREAM }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
        <span style={{ fontSize:12, fontWeight:700, color:DARK }}>
          {start + 1}–{Math.min(start + pageSize, total)} / {total}
        </span>
        <select
          value={pageSize}
          onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
          style={{ padding:'4px 8px', border:`4px solid ${BORDER}`, fontSize:12, fontWeight:700, color:DARK, background:'#fff', cursor:'pointer', outline:'none', fontFamily:'inherit' }}
        >
          {PAGE_SIZES.map(s => <option key={s} value={s}>{s} / page</option>)}
        </select>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:3 }}>
        <PageBtn onClick={() => setPage(1)} disabled={safePage===1}><ChevronsLeft size={12} strokeWidth={2.5} /></PageBtn>
        <PageBtn onClick={() => setPage(p => Math.max(1,p-1))} disabled={safePage===1}><ChevronLeft size={12} strokeWidth={2.5} /></PageBtn>
        {getPages().map((p,i) =>
          p === '...'
            ? <span key={`d${i}`} style={{ padding:'0 4px', fontSize:12, color:DARK, userSelect:'none' }}>…</span>
            : <PageBtn key={p} active={p===safePage} onClick={() => setPage(p)}>{p}</PageBtn>
        )}
        <PageBtn onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={safePage===totalPages}><ChevronRight size={12} strokeWidth={2.5} /></PageBtn>
        <PageBtn onClick={() => setPage(totalPages)} disabled={safePage===totalPages}><ChevronsRight size={12} strokeWidth={2.5} /></PageBtn>
      </div>
    </div>
  )
}