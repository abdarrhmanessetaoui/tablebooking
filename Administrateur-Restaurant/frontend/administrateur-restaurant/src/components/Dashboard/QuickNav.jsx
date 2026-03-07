import { useState } from 'react'
import { CalendarDays, ClipboardList, Sunrise, ChevronRight, ArrowRight } from 'lucide-react'
import { B } from '../../utils/brand'

function NavCard({ icon: Icon, title, sub, onClick, dark = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: dark ? B.dark : B.surface,
        borderRadius: 14, padding: '18px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 11, flexShrink: 0,
        background: dark ? 'rgba(255,255,255,0.07)' : B.goldTint,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={dark ? '#E5C97A' : B.gold} strokeWidth={2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: dark ? '#FFFFFF' : B.ink }}>{title}</p>
        <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: 600, color: dark ? B.darkMuted : B.inkMute }}>{sub}</p>
      </div>
      {dark
        ? <ArrowRight size={15} color="rgba(255,255,255,0.3)" strokeWidth={2.5} />
        : <ChevronRight size={15} color={B.inkMute} strokeWidth={2.5} />
      }
    </div>
  )
}

export default function QuickNav({ tomorrow, onCalendar, onReservations }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>

      <NavCard icon={CalendarDays} title="Planning" sub="Voir le calendrier complet" onClick={onCalendar} />
      <NavCard icon={ClipboardList} title="Réservations" sub="Gérer toutes les réservations" onClick={onReservations} dark />

      <div style={{
        background: B.surface,
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
        <div style={{ background: B.goldTint, borderRadius: 12, padding: '7px 16px', textAlign: 'center' }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: B.gold, display: 'block', lineHeight: 1, letterSpacing: '-1px' }}>
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