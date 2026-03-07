import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react'
import { B } from '../../utils/brand'
import Card from './Card'
import useCountUp from '../../hooks/useCountUp'

export default function TodayHero({ value, confirmed, pending, cancelled, onClick }) {
  const n  = useCountUp(value,     800, 150)
  const c  = useCountUp(confirmed, 700, 320)
  const p  = useCountUp(pending,   700, 400)
  const ca = useCountUp(cancelled, 700, 480)

  const rate = value > 0 ? Math.round((confirmed / value) * 100) : 0
  const [bar, setBar] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setBar(rate), 950)
    return () => clearTimeout(t)
  }, [rate])

  return (
    <Card onClick={onClick}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10 }}>
            <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10b981', opacity: 0.5, animation: 'pulse-ring 1.4s ease infinite' }} />
            <span style={{ position: 'relative', width: 10, height: 10, borderRadius: '50%', background: '#10b981', display: 'block' }} />
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            En direct · Aujourd'hui
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: B.mid, cursor: 'pointer' }}>
          Voir tout <ChevronRight size={14} color={B.mid} />
        </div>
      </div>

      {/* Big number */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginBottom: 28 }}>
        <span style={{ fontSize: 'clamp(72px, 10vw, 110px)', fontWeight: 900, color: B.dark, lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px' }}>
          {n}
        </span>
        <div style={{ paddingBottom: 10 }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#111827' }}>réservations</p>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: '#9ca3af' }}>ce soir</p>
        </div>
      </div>

      {/* 3 status boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 22 }}>
        {[
          { Icon: CheckCircle2, val: c,  label: 'Confirmées', iconColor: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
          { Icon: Clock,        val: p,  label: 'En attente',  iconColor: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
          { Icon: XCircle,      val: ca, label: 'Annulées',    iconColor: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
        ].map(({ Icon, val, label, iconColor, bg, border }) => (
          <div key={label} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 14, padding: '16px 14px' }}>
            <Icon size={18} color={iconColor} strokeWidth={2} />
            <p style={{ margin: '10px 0 0', fontSize: 30, fontWeight: 900, color: '#111827', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{val}</p>
            <p style={{ margin: '5px 0 0', fontSize: 12, fontWeight: 600, color: iconColor }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>Taux de confirmation</span>
          <span style={{ fontSize: 12, fontWeight: 800, color: B.dark }}>{rate}%</span>
        </div>
        <div style={{ height: 7, background: '#F3F4F6', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: `linear-gradient(90deg, ${B.dark} 0%, ${B.warm} 100%)`,
            width: `${bar}%`,
            transition: 'width 1.1s cubic-bezier(0.34,1.4,0.64,1)',
          }} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
          {[['#10b981', 'Confirmées'], ['#f59e0b', 'En attente'], ['#ef4444', 'Annulées']].map(([col, lbl]) => (
            <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: col, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#9ca3af' }}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes pulse-ring { 0% { transform:scale(1); opacity:.5 } 70% { transform:scale(2.2); opacity:0 } 100% { transform:scale(2.2); opacity:0 } }`}</style>
    </Card>
  )
}