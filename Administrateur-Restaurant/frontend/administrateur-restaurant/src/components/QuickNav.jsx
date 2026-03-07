import { useState } from 'react'
import { CalendarDays, ClipboardList, ChevronRight, Sunrise } from 'lucide-react'
import { B } from '../utils/brand'
import Card from './Dashboard/Card'
import IBox from './Dashboard/IBox'

export default function QuickNav({ tomorrow, onCalendar, onReservations }) {
  const [h1, setH1] = useState(false)
  const [h2, setH2] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>

      {/* Planning */}
      <div
        onClick={onCalendar}
        onMouseEnter={() => setH1(true)}
        onMouseLeave={() => setH1(false)}
        style={{
          background: '#fff', border: `1.5px solid ${h1 ? B.border : '#F0EBE3'}`,
          borderRadius: 16, padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
          boxShadow: h1 ? '0 6px 20px rgba(61,31,13,0.09)' : '0 1px 4px rgba(0,0,0,0.04)',
          transition: 'all 0.18s ease',
          transform: h1 ? 'translateY(-1px)' : 'none',
        }}
      >
        <IBox icon={CalendarDays} color={B.mid} bg={B.tint} size={18} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#111827' }}>Planning</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>Voir le calendrier</p>
        </div>
        <ChevronRight size={16} color={h1 ? B.mid : '#D1D5DB'} style={{ transition: 'color 0.15s' }} />
      </div>

      {/* Réservations */}
      <div
        onClick={onReservations}
        onMouseEnter={() => setH2(true)}
        onMouseLeave={() => setH2(false)}
        style={{
          background: h2 ? B.mid : B.dark,
          borderRadius: 16, padding: '16px 18px',
          display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer',
          boxShadow: h2 ? `0 8px 24px ${B.dark}50` : `0 4px 12px ${B.dark}30`,
          transition: 'all 0.18s ease',
          transform: h2 ? 'translateY(-1px)' : 'none',
        }}
      >
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ClipboardList size={18} color="#fff" strokeWidth={1.8} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#fff' }}>Réservations</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Gérer tout</p>
        </div>
        <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
      </div>

      {/* Demain */}
      <Card style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
        <IBox icon={Sunrise} color="#6366f1" bg="#EEF2FF" size={17} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#111827' }}>Demain</p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9CA3AF' }}>{tomorrow} réservation(s) prévue(s)</p>
        </div>
        <span style={{ fontSize: 28, fontWeight: 900, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>
          {tomorrow}
        </span>
      </Card>

    </div>
  )
}