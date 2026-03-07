import { useState, useEffect, useRef } from 'react'

export default function useCountUp(target, duration = 700, delay = 0) {
  const safeTarget = isNaN(Number(target)) ? 0 : Number(target)
  const [count, setCount] = useState(0)
  const raf   = useRef(null)
  const timer = useRef(null)

  useEffect(() => {
    timer.current = setTimeout(() => {
      if (safeTarget === 0) { setCount(0); return }
      const start = performance.now()
      const animate = (now) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        // ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(eased * safeTarget))
        if (progress < 1) raf.current = requestAnimationFrame(animate)
      }
      raf.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timer.current)
      cancelAnimationFrame(raf.current)
    }
  }, [safeTarget, duration, delay])

  return count
}