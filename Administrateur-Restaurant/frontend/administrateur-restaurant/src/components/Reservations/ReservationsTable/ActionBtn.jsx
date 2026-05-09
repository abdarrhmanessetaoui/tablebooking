import { useState } from 'react'
import { WHITE } from '../../../styles/reservations/tokens'
import { actionBtnStyle } from '../../../styles/reservations/table.styles'

export default function ActionBtn({ onClick, icon: Icon, danger, success, title }) {
  return (
    <button
      title={title}
      onClick={e => { e.stopPropagation(); onClick() }}
      style={actionBtnStyle(danger, success)}
    >
      <Icon
        size={15} strokeWidth={2.5}
        color={WHITE}
      />
    </button>
  )
}
