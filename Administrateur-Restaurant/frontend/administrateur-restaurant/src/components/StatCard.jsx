import { ChevronRight } from 'lucide-react'
import Card from './Card'
import FadeUp from './FadeUp'
import IBox from './IBox'
import useCountUp from '../hooks/useCountUp'

export default function StatCard({ icon, iconColor, iconBg, value, label, onClick, delay = 0 }) {
  const n = useCountUp(value, 700, delay + 200)
  return (
    <FadeUp delay={delay} style={{ height: '100%' }}>
      <Card onClick={onClick} style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <IBox icon={icon} color={iconColor} bg={iconBg} />
          {onClick && <ChevronRight size={16} color="#D1D5DB" />}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 40, fontWeight: 900, color: '#111827', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
            {n}
          </p>
          <p style={{ margin: '7px 0 0', fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{label}</p>
        </div>
      </Card>
    </FadeUp>
  )
}