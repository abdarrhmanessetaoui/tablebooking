import { useState, useEffect, useRef, useCallback } from 'react'
import { DARK, LIGHT_BROWN, BORDER, BG_CARD, RADIUS, SHADOW } from '../../styles/dashboard/tokens'

// ── Smooth area chart with brown gradient fill ───────────────────
export default function BookingChart({ data = [], title = 'Tendances des réservations' }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [dims, setDims] = useState({ w: 600, h: 280 })
  const [hoverIdx, setHoverIdx] = useState(-1)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const animRef = useRef(0)

  // Generate demo data if none provided
  const chartData = data.length > 0 ? data : [
    { label: 'Lun', value: 12 },
    { label: 'Mar', value: 28 },
    { label: 'Mer', value: 19 },
    { label: 'Jeu', value: 35 },
    { label: 'Ven', value: 42 },
    { label: 'Sam', value: 58 },
    { label: 'Dim', value: 31 },
  ]

  // Resize observer
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const { width } = e.contentRect
        setDims({ w: width, h: Math.min(280, Math.max(200, width * 0.35)) })
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Animate & draw
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const { w, h } = dims

    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.scale(dpr, dpr)

    const padL = 44, padR = 24, padT = 24, padB = 40
    const cw = w - padL - padR
    const ch = h - padT - padB

    const maxVal = Math.max(...chartData.map(d => d.value), 1) * 1.15
    const stepX = cw / Math.max(chartData.length - 1, 1)

    // Animation progress
    const startTime = performance.now()
    const duration = 900

    function draw(now) {
      const progress = Math.min((now - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3) // ease out cubic

      ctx.clearRect(0, 0, w, h)

      // Y-axis grid lines
      const gridCount = 4
      for (let i = 0; i <= gridCount; i++) {
        const y = padT + (ch / gridCount) * i
        ctx.beginPath()
        ctx.strokeStyle = '#F0EBE5'
        ctx.lineWidth = 1
        ctx.moveTo(padL, y)
        ctx.lineTo(w - padR, y)
        ctx.stroke()

        // Y labels
        const val = Math.round(maxVal - (maxVal / gridCount) * i)
        ctx.fillStyle = '#B8A99A'
        ctx.font = '500 10px Inter, system-ui'
        ctx.textAlign = 'right'
        ctx.fillText(val, padL - 8, y + 4)
      }

      // Build points
      const points = chartData.map((d, i) => ({
        x: padL + i * stepX,
        y: padT + ch - (d.value / maxVal) * ch * ease,
        value: d.value,
        label: d.label,
      }))

      // Gradient fill
      const gradient = ctx.createLinearGradient(0, padT, 0, padT + ch)
      gradient.addColorStop(0, `rgba(75, 54, 33, ${0.12 * ease})`)
      gradient.addColorStop(0.5, `rgba(200, 169, 126, ${0.06 * ease})`)
      gradient.addColorStop(1, 'rgba(200, 169, 126, 0)')

      // Draw filled area with smooth curve
      ctx.beginPath()
      ctx.moveTo(points[0].x, padT + ch)
      ctx.lineTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        const cpx = (prev.x + curr.x) / 2
        ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y)
      }
      ctx.lineTo(points[points.length - 1].x, padT + ch)
      ctx.closePath()
      ctx.fillStyle = gradient
      ctx.fill()

      // Draw line
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1]
        const curr = points[i]
        const cpx = (prev.x + curr.x) / 2
        ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y)
      }
      ctx.strokeStyle = '#4B3621'
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()

      // Draw points and X labels
      points.forEach((p, i) => {
        // X label
        ctx.fillStyle = '#B8A99A'
        ctx.font = '500 11px Inter, system-ui'
        ctx.textAlign = 'center'
        ctx.fillText(p.label, p.x, h - 12)

        // Point
        const isHover = i === hoverIdx
        const radius = isHover ? 6 : 4

        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = isHover ? '#4B3621' : '#ffffff'
        ctx.fill()
        ctx.strokeStyle = '#4B3621'
        ctx.lineWidth = isHover ? 3 : 2
        ctx.stroke()

        // Hover tooltip
        if (isHover && progress >= 1) {
          const tooltipText = `${p.value} réservations`
          ctx.font = '600 12px Inter, system-ui'
          const tw = ctx.measureText(tooltipText).width
          const tx = Math.max(padL, Math.min(p.x - tw / 2 - 10, w - padR - tw - 20))
          const ty = p.y - 36

          // Tooltip bg
          const tooltipR = 8
          ctx.beginPath()
          ctx.roundRect(tx, ty, tw + 20, 28, tooltipR)
          ctx.fillStyle = '#4B3621'
          ctx.fill()
          ctx.shadowColor = 'rgba(75,54,33,0.2)'
          ctx.shadowBlur = 8
          ctx.shadowOffsetY = 2
          ctx.fill()
          ctx.shadowColor = 'transparent'
          ctx.shadowBlur = 0
          ctx.shadowOffsetY = 0

          // Tooltip arrow
          ctx.beginPath()
          ctx.moveTo(p.x - 5, ty + 28)
          ctx.lineTo(p.x, ty + 34)
          ctx.lineTo(p.x + 5, ty + 28)
          ctx.fillStyle = '#4B3621'
          ctx.fill()

          // Tooltip text
          ctx.fillStyle = '#ffffff'
          ctx.font = '600 11px Inter, system-ui'
          ctx.textAlign = 'left'
          ctx.fillText(tooltipText, tx + 10, ty + 18)
        }
      })

      if (progress < 1) {
        animRef.current = requestAnimationFrame(draw)
      }
    }

    animRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animRef.current)
  }, [dims, chartData, hoverIdx])

  // Mouse events
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const { w, h } = dims
    const padL = 44, padR = 24
    const cw = w - padL - padR
    const stepX = cw / Math.max(chartData.length - 1, 1)

    let closest = -1
    let minDist = 30
    chartData.forEach((_, i) => {
      const px = padL + i * stepX
      const dist = Math.abs(x - px)
      if (dist < minDist) {
        minDist = dist
        closest = i
      }
    })
    setHoverIdx(closest)
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [dims, chartData])

  return (
    <div style={{
      background: BG_CARD,
      borderRadius: RADIUS.lg,
      border: `1px solid ${BORDER}`,
      boxShadow: SHADOW.card,
      padding: '24px 24px 16px',
      marginBottom: 24,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
      }}>
        <h3 style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 600,
          color: DARK,
          fontFamily: "'Poppins','Inter',system-ui,sans-serif",
        }}>
          {title}
        </h3>
        <span style={{
          fontSize: 11,
          fontWeight: 500,
          color: '#000000',
          padding: '4px 12px',
          background: '#F5F1ED',
          borderRadius: 8,
        }}>
          Cette semaine
        </span>
      </div>
      <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIdx(-1)}
          style={{ width: '100%', cursor: 'crosshair' }}
        />
      </div>
    </div>
  )
}
