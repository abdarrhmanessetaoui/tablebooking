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
        background: dark ? (hov ? B.mid : B.dark) : (hov ? B.tint : B.surface),
        border: `1.5px solid ${dark ? 'transparent' : (hov ? B.tintBdr : B.border)}`,
        borderRadius: 13,
        padding: '17px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
        cursor: 'pointer',
        transition: 'all 0.16s ease',
        boxShadow: dark
          ? (hov ? `0 6px 20px ${B.dark}70` : `0 3px 10px ${B.dark}50`)
          : (hov ? `0 4px 14px rgba(160,124,56,0.13)` : '0 1px 4px rgba(0,0,0,0.05)'),
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 11,
        background: dark ? 'rgba(255,255,255,0.1)' : iconBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        border: dark ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}>
        <Icon size={20} color={dark ? B.muted : iconColor} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: dark ? '#fff' : B.text }}>
          {title}
        </p>
        <p style={{
          margin: '3px 0 0', fontSize: 12, fontWeight: 600,
          color: dark ? 'rgba(255,255,255,0.45)' : B.textMute,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {sub}
        </p>
      </div>
      <ChevronRight size={18} color={dark ? 'rgba(255,255,255,0.4)' : (hov ? B.warm : B.textMute)} strokeWidth={2.5} />
    </div>
  )
}

export default function QuickNav({ tomorrow, onCalendar, onReservations }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11, height: '100%' }}>

      <NavRow
        icon={CalendarDays} iconColor={B.warm} iconBg={B.tint}
        title="Planning" sub="Voir le calendrier complet"
        onClick={onCalendar}
      />

      <NavRow
        icon={ClipboardList} iconColor={B.muted} iconBg={B.mid}
        title="Réservations" sub="Gérer toutes les réservations"
        onClick={onReservations} dark
      />

      {/* Demain card */}
      <div style={{
        background: B.surface,
        border: `1.5px solid ${B.border}`,
        borderRadius: 13, padding: '17px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        marginTop: 'auto',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: B.indigoBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Sunrise size={20} color={B.indigo} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: B.text }}>Demain</p>
          <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: 600, color: B.textMute }}>Réservations prévues</p>
        </div>
        <div style={{
          background: B.tint, border: `1.5px solid ${B.tintBdr}`,
          borderRadius: 10, padding: '6px 14px',
        }}>
          <span style={{
            fontSize: 26, fontWeight: 900, color: B.warm,
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px',
          }}>
            {tomorrow}
          </span>
        </div>
      </div>

    </div>
  )
}