import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LayoutGrid, Link2, MapPin } from 'lucide-react'
import { DARK, LIGHT_BROWN, GREEN, BORDER } from '../../../styles/reservations/tokens'

export default function AssignTableCell({ r, onOpenAssign }) {
  const { t } = useTranslation()
  const [hov, setHov] = useState(false)
  const hasTable = !!r.table_idx

  if (hasTable) {
    return (
      <div
        onClick={e => { e.stopPropagation(); onOpenAssign(r) }}
        title={t('change_table')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          padding: '4px 10px',
          background: LIGHT_BROWN,
          border: `1px solid ${LIGHT_BROWN}`,
          fontSize: 11, fontWeight: 800,
          color: '#ffffff',
          cursor: 'pointer', transition: 'none', whiteSpace: 'nowrap',
          borderRadius: 4,
        }}
      >
        {t('table_header')} {r.table_number ?? r.table_idx}
      </div>
    )
  }

  return (
    <button
      onClick={e => { e.stopPropagation(); onOpenAssign(r) }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 12px', background: DARK,
        border: 'none', borderRadius: 4,
        fontSize: 11, fontWeight: 800,
        color: '#ffffff',
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'none', whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = 0.9} onMouseLeave={e => e.currentTarget.style.opacity = 1}
    >
      <Link2 size={12} strokeWidth={2.5} color="#ffffff" />
      {t('assign_btn')}
    </button>
  )
}
