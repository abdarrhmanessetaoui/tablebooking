import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import { B } from '../utils/brand'
import Card from './Card'
import IBox from './IBox'

export default function WeekChart({ todayCount }) {
  const targets = [35, 58, 42, 75, 50, 88, Math.min(Math.max((todayCount / 10) * 100, 12), 100)]
  const [h, setH] = useState(targets.map(() => 0))

  useEffect(() => {
    const t = setTimeout(() => setH(targets), 350)
    return () => clearTimeout(t)
  }, [todayCount])

  return (
    <Card style={{ height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#111827' }}>Cette semaine</p>
          <p style={{ margin: '3px 0 0', fontSize: 12, color: '#9CA3AF' }}>Aperçu des 7 derniers jours</p>
        </div>
        <IBox icon={TrendingUp} color={B.mid} bg={B.tint} size={17} />
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        {/* Y-axis labels */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingBottom: 28, paddingTop: 2 }}>
          {['100', '50', '0'].map(l => (
            <span key={l} style={{ fontSize: 10, color: '#D1D5DB', fontWeight: 600, lineHeight: 1 }}>{l}</span>
          ))}
        </div>

        {/* Bars + day labels */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 90, marginBottom: 8 }}>
            {h.map((val, i) => (
              <div key={i} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{
                  width: '100%', height: `${val}%`, minHeight: 4,
                  borderRadius: '5px 5px 3px 3px',
                  background: i === 6 ? `linear-gradient(180deg, ${B.warm} 0%, ${B.dark} 100%)` : '#EDE8E3',
                  transition: `height 0.65s cubic-bezier(0.34,1.2,0.64,1) ${i * 50}ms`,
                  boxShadow: i === 6 ? `0 4px 14px ${B.mid}55` : 'none',
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: i === 6 ? B.dark : '#D1D5DB' }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}