import { useTranslation } from 'react-i18next'
import { CalendarCheck, Users, TrendingUp, Clock } from 'lucide-react'
import useCountUp from '../../hooks/Dashboard/useCountUp'
import { DARK, WHITE, BORDER, RADIUS, LIGHT_BROWN, GREEN, AMBER } from '../../styles/dashboard/tokens'

function KPICard({ icon: Icon, value, label, suffix = '', color = LIGHT_BROWN, delay = 0 }) {
  const n = useCountUp(value, 700, delay)

  return (
    <div style={{
      background: WHITE,
      borderRadius: RADIUS.sm,
      border: `1px solid ${BORDER}`,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      flex: 1,
      minWidth: 0,
    }}>
      <div style={{
        width: 32, height: 32,
        borderRadius: RADIUS.sm,
        background: '#F8F6F4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={16} strokeWidth={2.5} color={color} />
      </div>

      <div>
        <p style={{
          margin: 0,
          fontSize: 24,
          fontWeight: 800,
          color: DARK,
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {n}{suffix}
        </p>
        <p style={{
          margin: '4px 0 0',
          fontSize: 11,
          fontWeight: '800',
          color: DARK,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          {label}
        </p>
      </div>
    </div>
  )
}

export default function KPICards({ stats }) {
  const { t } = useTranslation()

  const cards = [
    {
      icon: CalendarCheck,
      value: stats.total || 0,
      label: t('total_reservations') || 'Total Réservations',
      color: LIGHT_BROWN,
      delay: 0,
    },
    {
      icon: Users,
      value: stats.today || 0,
      label: t('today_reservations') || "Aujourd'hui",
      color: GREEN,
      delay: 100,
    },
    {
      icon: TrendingUp,
      value: stats.confirmed || 0,
      label: t('confirmed_plural') || 'Confirmées',
      color: LIGHT_BROWN,
      delay: 200,
    },
    {
      icon: Clock,
      value: stats.pending || 0,
      label: t('pending_plural') || 'En attente',
      color: AMBER,
      delay: 300,
    },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: 16,
      marginBottom: 24,
    }}>
      {cards.map((card, i) => (
        <KPICard key={i} {...card} />
      ))}
    </div>
  )
}
