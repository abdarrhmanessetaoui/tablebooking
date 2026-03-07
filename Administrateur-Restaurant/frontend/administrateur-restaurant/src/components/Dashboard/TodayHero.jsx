import { useState, useEffect } from 'react'
import { Users, ArrowRight } from 'lucide-react'
import { B } from '../../utils/brand'
import useCountUp from '../../hooks/Dashboard/useCountUp'
import Card from './Card'

function PulseDot() {
  return (
    <>
      <span style={{ position: 'relative', display: 'inline-flex', width: 10, height: 10, flexShrink: 0 }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: B.brown, opacity: 0.3, animation: 'livepulse 2s ease-in-out infinite' }} />
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: B.brown, display: 'block', position: 'relative' }} />
      </span>
      <style>{`@keyframes livepulse{0%,100%{transform:scale(1);opacity:.3}50%{transform:scale(2.6);opacity:0}}`}</style>
    </>
  )
}

// Simple number count-up
function useCountUp(target = 0, duration = 900, delay = 0) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start, raf
    const t = setTimeout(() => {
      const step = ts => {
        if (!start) start = ts
        const p = Math.min((ts - start) / duration, 1)
        setVal(Math.round(p * target))
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => { clearTimeout(t); cancelAnimationFrame(raf) }
  }, [target])
  return val
}

export default function TodayHero({ value, onClick }) {
  const [hov, setHov] = useState(false)
  const n = useCountUp(value, 900, 80)

  return (
    <Card onClick={onClick} padding={0} style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ padding: 'clamp(24px,4vw,40px)' }}>

          {/* Live badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <PulseDot />
            <span style={{ fontSize: 11, fontWeight: 900, color: B.inkMute, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              En direct
            </span>
          </div>

          {/* Big number + label side by side */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 'clamp(80px,13vw,160px)', fontWeight: 900,
              color: B.black, lineHeight: 0.88,
              fontVariantNumeric: 'tabular-nums', letterSpacing: '-6px',
              fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui",
            }}>
              {n}
            </span>
            <div style={{ paddingBottom: 6 }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: B.blackSoft, lineHeight: 1.2 }}>
                réservations<br />aujourd'hui
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <Users size={13} color={B.inkMute} strokeWidth={2} />
                <span style={{ fontSize: 12, fontWeight: 600, color: B.inkMute }}>
                  ~{(value * 2.3).toFixed(0)} couverts estimés
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '15px clamp(24px,4vw,40px)',
          background: hov ? B.brown : '#F0F0F0',
          transition: 'background 0.2s ease',
        }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: hov ? '#fff' : B.blackSoft, transition: 'color 0.2s' }}>
            Gérer les réservations
          </span>
          <ArrowRight size={17} strokeWidth={2.5} color={hov ? '#fff' : B.inkMute}
            style={{ transition: 'color 0.2s, transform 0.2s', transform: hov ? 'translateX(4px)' : 'none' }} />
        </div>
      </div>
    </Card>
  )
}