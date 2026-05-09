import { useState, useEffect } from 'react'
import { ThreeDot } from 'react-loading-indicators'
import { BG_PAGE } from '../../styles/dashboard/tokens'

/**
 * A spinner that only appears after a certain delay (default 300ms).
 * This prevents the "flicker" of loading states for fast requests.
 */
export default function Spinner({ fullPage = false, delay = 0, color = "#C19A6B" }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!show) return null

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...(fullPage ? {
        position: 'fixed',
        inset: 0,
        background: BG_PAGE,
        zIndex: 9999,
        height: '100vh'
      } : {
        padding: '64px 0',
        width: '100%',
        minHeight: '200px',
      }),
    }}>
      <ThreeDot variant="bounce" color={color} size="small" text="" textColor="" />
    </div>
  )
}
