import { useState, useEffect } from 'react'

export default function useCountUp(target, ms = 900, delay = 0) {
  const [v, setV] = useState(0)
  useEffect(() => {
    let raf, t0 = null
    const id = setTimeout(() => {
      const tick = (ts) => {
        if (!t0) t0 = ts
        const p = Math.min((ts - t0) / ms, 1)
        setV(Math.round((1 - Math.pow(1 - p, 3)) * target))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => { clearTimeout(id); cancelAnimationFrame(raf) }
  }, [target, ms, delay])
  return v
}