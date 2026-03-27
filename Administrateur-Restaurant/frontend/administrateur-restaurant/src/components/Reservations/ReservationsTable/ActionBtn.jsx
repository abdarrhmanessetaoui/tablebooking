import { useState } from 'react'
import { DARK, GOLD, RED } from '../../../styles/reservations/tokens'
import { actionBtnStyle } from '../../../styles/reservations/table.styles'

export default function ActionBtn({ onClick, icon: Icon, danger, success, title }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      title={title}
      onClick={e => { e.stopPropagation(); onClick() }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={actionBtnStyle(hov, danger, success)}
    >
      <Icon
        size={14} strokeWidth={2.5}
        color="#ffffff"
      />
    </button>
  )
}
