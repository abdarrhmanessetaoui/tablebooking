import { useState } from 'react'
import { CalendarDays, ClipboardList, Sunrise, ChevronRight, ArrowRight } from 'lucide-react'
import { B } from '../../utils/brand'

function NavCard({ icon: Icon, title, sub, onClick, dark = false }) {
  const [hov, setHov] = useState(false)

  if (dark) return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? '#111' : B.dark,
        borderRadius: 14, padding: '18px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        cursor: 'pointer',
        transition: 'background 0.15s ease',
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 11, flexShrink: 0,
        background: 'rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color="#E5C97A" strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>{title}</p>
        <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: 600, color: B.darkMuted }}>{sub}</p>
      </div>
      <ArrowRight
        size={15}
        color={hov ? '#E5C97A' : 'rgba(255,255,255,0.3)'}
        strokeWidth={2.5}
        style={{ transition: 'color 0.15s, transform 0.15s', transform: hov ? 'translateX(2px)' : 'none' }}
      />
    </div>
  )

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: B.surface,
        border: `1.5px solid ${hov ? B.borderMed : B.border}`,
        borderRadius: 14, padding: '18px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        cursor: 'pointer',
        transition: 'border-color 0.15s ease',
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 11, flexShrink: 0,
        background: B.goldTint,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={B.gold} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: B.ink }}>{title}</p>
        <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: 600, color: B.inkMute }}>{sub}</p>
      </div>
      <ChevronRight size={15} color={B.inkMute} strokeWidth={2.5} />
    </div>
  )
}

export default function QuickNav({ tomorrow, onCalendar, onReservations }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>

      <NavCard
        icon={CalendarDays}
        title="Planning"
        sub="Voir le calendrier complet"
        onClick={onCalendar}
      />

      <NavCard
        icon={ClipboardList}
        title="Réservations"
        sub="Gérer toutes les réservations"
        onClick={onReservations}
        dark
      />

      {/* Tomorrow box */}
      <div style={{
        background: B.surface,
        border: `1.5px solid ${B.border}`,
        borderRadius: 14, padding: '18px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        marginTop: 'auto',
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11, flexShrink: 0,
          background: B.indigoBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sunrise size={20} color={B.indigo} strokeWidth={2} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: B.ink }}>Demain</p>
          <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: 600, color: B.inkMute }}>Réservations prévues</p>
        </div>
        {/* Badge */}
        <div style={{
          background: B.goldTint,
          borderRadius: 12, padding: '7px 16px', textAlign: 'center',
        }}>
          <span style={{
            fontSize: 28, fontWeight: 900, color: B.gold,
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px',
            display: 'block', lineHeight: 1,
          }}>
            {tomorrow}
          </span>
          <span style={{ fontSize: 9, fontWeight: 800, color: B.goldLight, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            rés.
          </span>
        </div>
      </div>

    </div>
  )
}