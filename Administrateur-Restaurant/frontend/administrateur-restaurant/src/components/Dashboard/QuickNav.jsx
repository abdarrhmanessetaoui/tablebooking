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
        background: dark
          ? (hov ? B.mid : B.dark)
          : (hov ? B.tint : B.surface),
        border: `1.5px solid ${dark ? 'transparent' : (hov ? B.tintBdr : B.border)}`,
        borderRadius: 11,
        padding: '15px 16px',
        display: 'flex', alignItems: 'center', gap: 13,
        cursor: 'pointer',
        transition: 'all 0.16s ease',
        boxShadow: dark
          ? (hov ? `0 6px 18px ${B.dark}70` : `0 2px 8px ${B.dark}40`)
          : (hov ? `0 3px 10px rgba(160,124,56,0.12)` : '0 1px 3px rgba(0,0,0,0.04)'),
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 9,
        background: dark ? 'rgba(255,255,255,0.1)' : iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        border: dark ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}>
        <Icon size={16} color={dark ? B.muted : iconColor} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: 13, fontWeight: 700,
          color: dark ? '#fff' : B.text,
        }}>
          {title}
        </p>
        <p style={{
          margin: '2px 0 0', fontSize: 11, fontWeight: 500,
          color: dark ? 'rgba(255,255,255,0.45)' : B.textMute,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {sub}
        </p>
      </div>
      <ChevronRight
        size={15}
        color={dark ? 'rgba(255,255,255,0.35)' : (hov ? B.warm : B.textMute)}
        strokeWidth={2.2}
      />
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
        icon={ClipboardList} iconColor={B.muted} iconBg={B.mid}
        title="Réservations" sub="Gérer toutes les réservations"
        onClick={onReservations} dark
      />

      {/* Demain */}
      <div style={{
        background: B.surface,
        border: `1.5px solid ${B.border}`,
        borderRadius: 11,
        padding: '15px 16px',
        display: 'flex', alignItems: 'center', gap: 13,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        marginTop: 'auto',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 9,
          background: B.indigoBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Sunrise size={16} color={B.indigo} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: B.text }}>Demain</p>
          <p style={{ margin: '2px 0 0', fontSize: 11, fontWeight: 500, color: B.textMute }}>Réservations prévues</p>
        </div>
        <div style={{
          background: B.tint,
          border: `1.5px solid ${B.tintBdr}`,
          borderRadius: 9, padding: '5px 12px',
        }}>
          <span style={{
            fontSize: 22, fontWeight: 800, color: B.warm,
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px',
          }}>
            {tomorrow}
          </span>
        </div>
      </div>

    </div>
  )
}