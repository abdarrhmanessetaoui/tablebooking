import { useState } from 'react'

import { DARK, GOLD, CREAM, BORDER } from '../../../styles/reservations/tokens'
import { pageBtnStyle } from '../../../styles/reservations/table.styles'

const PAGE_SIZES = [10, 25, 50, 100]

function PageBtn({ onClick, disabled, active, children }) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={pageBtnStyle(active, disabled)}
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
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10, padding:'12px 16px', borderTop:`1.5px solid ${BORDER}`, background:CREAM }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
        <span style={{ fontSize:12, fontWeight:700, color:DARK }}>
          {start + 1}–{Math.min(start + pageSize, total)} / {total}
        </span>
        <select
          value={pageSize}
          onChange={e => { setPageSize(Number(e.target.value)); setPage(1) }}
          style={{ padding:'4px 8px', border:`2px solid ${DARK}`, fontSize:11, fontWeight:900, color:DARK, background:'#fff', cursor:'pointer', outline:'none', fontFamily:'inherit', textTransform:'uppercase' }}
        >
          {PAGE_SIZES.map(s => <option key={s} value={s}>{s} / PAGE</option>)}
        </select>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:3 }}>
        <PageBtn onClick={() => setPage(1)} disabled={safePage===1}>PREMIER</PageBtn>
        <PageBtn onClick={() => setPage(p => Math.max(1,p-1))} disabled={safePage===1}>AVANT</PageBtn>
        {getPages().map((p,i) =>
          p === '...'
            ? <span key={`d${i}`} style={{ padding:'0 4px', fontSize:12, color:DARK, userSelect:'none', fontWeight:900 }}>…</span>
            : <PageBtn key={p} active={p===safePage} onClick={() => setPage(p)}>{p}</PageBtn>
        )}
        <PageBtn onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={safePage===totalPages}>SUIVANT</PageBtn>
        <PageBtn onClick={() => setPage(totalPages)} disabled={safePage===totalPages}>DERNIER</PageBtn>
      </div>
    </div>
  )
}