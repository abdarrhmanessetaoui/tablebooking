import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import TableRow from './TableRow'
import Checkbox from './Checkbox'
import { DARK } from '../../../styles/reservations/tokens'
import { headerCellStyle } from '../../../styles/reservations/table.styles'

export default function DesktopTable({
  pageItems,
  selectedIds,
  highlightId,
  toggleOne,
  pageAllSel,
  pageSomeSel,
  togglePage,
  openView,
  openEdit,
  handleDelete,
  onOpenAssign,
  highlightRef
}) {
  const { t } = useTranslation()

  const HEADERS = [
    t('name'),       // Nom
    t('phone'),      // Tél.
    t('date'),       // Date
    t('time'),       // Heure
    t('guests'),     // Pers.
    t('service'),    // Service
    t('table'),      // Table
    t('status'),     // Statut
    t('actions')     // Actions
  ]

  return (
    <div style={{ width:'100%', overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse', minWidth:800 }}>
        <thead>
          <tr style={{ background:DARK }}>
            <th style={{ padding:'11px 10px', width:36 }}>
              <Checkbox checked={pageAllSel} indeterminate={pageSomeSel} onChange={togglePage} />
            </th>
            {HEADERS.map(label => (
              <th key={label} style={headerCellStyle}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageItems.map((r, i) => (
            <TableRow
              key={r.id} r={r} i={i}
              selected={selectedIds.includes(r.id)}
              highlighted={r.id === highlightId}
              highlightRef={highlightRef}
              toggleOne={toggleOne}
              openView={openView} openEdit={openEdit} handleDelete={handleDelete}
              onOpenAssign={onOpenAssign}
            />
          ))}
          {pageItems.length === 0 && (
            <tr>
              <td colSpan={10} style={{ padding:'52px 24px', textAlign:'center', fontSize:13, fontWeight:700, color:DARK }}>
                {t('no_reservations')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}