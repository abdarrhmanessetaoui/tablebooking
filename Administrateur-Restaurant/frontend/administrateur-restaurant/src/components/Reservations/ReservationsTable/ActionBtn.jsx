import { useState } from 'react'
import { useTranslation } from "react-i18next"
import { DARK, GOLD, RED } from '../../../styles/reservations/tokens'
import { actionBtnStyle } from '../../../styles/reservations/table.styles'

export default function ActionBtn({ onClick, icon: Icon, danger, titleKey }) {
  const [hov, setHov] = useState(false)
  const { t } = useTranslation()

  return (
    <button
      title={t(titleKey)}
      onClick={e => { e.stopPropagation(); onClick() }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={actionBtnStyle(hov, danger)}
    >
      <Icon
        size={12} strokeWidth={2.5}
        color={danger ? (hov ? '#fff' : RED) : (hov ? GOLD : DARK)}
      />
    </button>
  )
}