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
        background: dark ? (hov ? B.darkHov : B.dark) : (hov ? B.goldLight : B.surface),
        border: `1.5px solid ${dark ? 'transparent' : (hov ? B.goldBdr : B.border)}`,
        borderRadius: 14,
        padding: '17px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        cursor: 'pointer',
        transition: 'all 0.17s ease',
        boxShadow: dark
          ? (hov ? '0 6px 20px rgba(0,0,0,0.22)' : '0 3px 10px rgba(0,0,0,0.16)')
          : (hov ? '0 4px 16px rgba(154,111,46,0.15)' : '0 1px 4px rgba(0,0,0,0.06)'),
      }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 12,
        background: dark ? 'rgba(255,255,255,0.08)' : iconBg,
        border: dark ? '1.5px solid rgba(255,255,255,0.06)' : `1.5px solid ${B.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={21} color={dark ? '#E5C97A' : iconColor} strokeWidth={2} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: 15, fontWeight: 800,
          color: dark ? '#FFFFFF' : B.text,
          letterSpacing: '-0.2px',
        }}>
          {title}
        </p>
        <p style={{
          margin: '3px 0 0', fontSize: 12, fontWeight: 600,
          color: dark ? 'rgba(255,255,255,0.42)' : B.textMute,
        }}>
          {sub}
        </p>
      </div>

      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: dark ? 'rgba(255,255,255,0.07)' : (hov ? B.goldLight : B.bg),
        border: dark ? '1px solid rgba(255,255,255,0.06)' : `1px solid ${hov ? B.goldBdr : B.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        transition: 'all 0.15s',
      }}>
        <ChevronRight size={15}
          color={dark ? 'rgba(255,255,255,0.4)' : (hov ? B.gold : B.textMute)}
          strokeWidth={2.5}
        />
      </div>
    </div>
  )
}

export default function QuickNav({ tomorrow, onCalendar, onReservations }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>

      <NavRow
        icon={CalendarDays} iconColor={B.gold} iconBg={B.goldLight}
        title="Planning" sub="Voir le calendrier complet"
        onClick={onCalendar}
      />

      <NavRow
        icon={ClipboardList} iconColor="#E5C97A" iconBg="rgba(255,255,255,0.1)"
        title="Réservations" sub="Gérer toutes les réservations"
        onClick={onReservations} dark
      />

      {/* Demain */}
      <div style={{
        background: B.surface,
        border: `1.5px solid ${B.border}`,
        borderRadius: 14, padding: '17px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        marginTop: 'auto',
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 12,
          background: B.indigoBg, border: `1.5px solid ${B.indigoBdr}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Sunrise size={21} color={B.indigo} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin:0, fontSize:15, fontWeight:800, color: B.text }}>Demain</p>
          <p style={{ margin:'3px 0 0', fontSize:12, fontWeight:600, color: B.textMute }}>Réservations prévues</p>
        </div>
        <div style={{
          background: B.goldLight,
          border: `1.5px solid ${B.goldBdr}`,
          borderRadius: 11, padding: '6px 16px',
          textAlign: 'center',
        }}>
          <span style={{
            fontSize: 28, fontWeight: 900, color: B.gold,
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px',
            display: 'block', lineHeight: 1,
          }}>
            {tomorrow}
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: B.goldBdr, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            rés.
          </span>
        </div>
      </div>

    </div>
  )
}