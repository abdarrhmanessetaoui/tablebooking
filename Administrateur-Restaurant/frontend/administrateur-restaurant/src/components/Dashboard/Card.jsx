import { useState } from 'react'
import { B } from '../../utils/brand'

export default function Card({ children, onClick, style = {} }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}

    >
      {children}
    </div>
  )
}