import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutGrid, Link2, MapPin } from 'lucide-react'
import { DARK, GOLD, GREEN, BORDER } from '../../../styles/reservations/tokens'

export default function AssignTableCell({ r, onOpenAssign }) {
  const { t } = useTranslation()
  const [hov, setHov] = useState(false)
  const hasTable = !!r.table_idx

  if (hasTable) {
    return (
      <div
        onClick={e => { e.stopPropagation(); onOpenAssign(r) }}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        title={t('change_table')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '3px 8px',
          background: hov ? DARK : '#f0fdf4',
          border: `1px solid ${hov ? DARK : GREEN}`,
          fontSize: 11, fontWeight: 800,
          color: hov ? GOLD : '#16a34a',
          cursor: 'pointer', transition: 'all 0.12s', whiteSpace: 'nowrap',
        }}
      >
        <LayoutGrid size={10} strokeWidth={2.5} />
        {t('table_header')} {r.table_number ?? r.table_idx}
        {r.table_location && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 2,
            marginLeft: 3,
            opacity: hov ? 0.75 : 0.6,
            fontSize: 10, fontWeight: 700,
          }}>
            <MapPin size={9} strokeWidth={2.5} />
            {r.table_location}
          </span>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={e => { e.stopPropagation(); onOpenAssign(r) }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 8px', background: 'none',
        border: `1.5px dashed ${hov ? DARK : BORDER}`,
        fontSize: 11, fontWeight: 800,
        color: hov ? DARK : 'rgba(43,33,24,0.4)',
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'all 0.12s', whiteSpace: 'nowrap',
      }}
    >
      <Link2 size={10} strokeWidth={2.5} />
      {t('assign_btn')}
    </button>
  )
}