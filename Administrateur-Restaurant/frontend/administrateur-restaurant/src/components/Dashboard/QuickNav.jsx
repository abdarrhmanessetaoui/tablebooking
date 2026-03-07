import { useState } from 'react'
import { CalendarDays, ClipboardList, ChevronRight, Sunrise } from 'lucide-react'
import { B } from '../../utils/brand'

function NavRow({ icon: Icon, iconColor, iconBg, title, sub, onClick, dark = false }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: dark ? (hov ? B.mid : B.dark) : (hov ? B.bg : B.surface),
        border: `1px solid ${dark ? 'transparent' : (hov ? B.borderHov : B.border)}`,
        borderRadius: 10,
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer',
        transition: 'all 0.16s ease',
        boxShadow: dark
          ? (hov ? `0 4px 14px ${B.dark}60` : `0 2px 8px ${B.dark}30`)
          : (hov ? '0 2px 8px rgba(0,0,0,0.07)' : '0 1px 3px rgba(0,0,0,0.04)'),
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: dark ? 'rgba(255,255,255,0.12)' : iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={16} color={dark ? '#fff' : iconColor} strokeWidth={1.9} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: dark ? '#fff' : B.text }}>{title}</p>
        <p style={{ margin: '1px 0 0', fontSize: 11, color: dark ? 'rgba(255,255,255,0.5)' : B.textMute, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</p>
      </div>
      <ChevronRight size={14} color={dark ? 'rgba(255,255,255,0.4)' : (hov ? B.textSub : B.textMute)} />
    </div>
  )
}

export default function QuickNav({ tomorrow, onCalendar, onReservations }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>

      <NavRow
        icon={CalendarDays} iconColor={B.warm} iconBg={B.tint}
        title="Planning" sub="Voir le calendrier"
        onClick={onCalendar}
      />

      <NavRow
        icon={ClipboardList} iconColor="#fff" iconBg={B.warm}
        title="Réservations" sub="Gérer toutes les réservations"
        onClick={onReservations} dark
      />

      {/* Demain card */}
      <div style={{
        background: B.surface,
        border: `1px solid ${B.border}`,
        borderRadius: 10,
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        marginTop: 'auto',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: '#EEF2FF',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Sunrise size={16} color="#4F46E5" strokeWidth={1.9} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: B.text }}>Demain</p>
          <p style={{ margin: '1px 0 0', fontSize: 11, color: B.textMute }}>Réservations prévues</p>
        </div>
        <div style={{
          background: '#EEF2FF', border: '1px solid #C7D2FE',
          borderRadius: 8, padding: '4px 10px',
        }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#4F46E5', fontVariantNumeric: 'tabular-nums' }}>
            {tomorrow}
          </span>
        </div>
      </div>

    </div>
  )
}