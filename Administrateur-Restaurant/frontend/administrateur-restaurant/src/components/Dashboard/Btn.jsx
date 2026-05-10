import { useState } from 'react'
import { btnStyle } from '../../styles/dashboard/dashboard.styles'

export default function Btn({ children, onClick, primary, disabled, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={btnStyle(primary, disabled)}
    >
      {Icon && <Icon size={15} strokeWidth={2.2} />}
      <span className="btn-label">{children}</span>
    </button>
  )
}
