import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const cursor = cursorRef.current
    const ring = ringRef.current
    if (!cursor || !ring) return

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      cursor.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`
    }

    let animId
    const followRing = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12
      ring.style.transform = `translate(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px)`
      animId = requestAnimationFrame(followRing)
    }
    followRing()

    const expand = () => {
      cursor.style.transform += ' scale(2)'
      ring.style.transform += ' scale(1.5)'
    }
    const shrink = () => {}

    const links = document.querySelectorAll('button, a, [role="button"]')
    links.forEach(el => {
      el.addEventListener('mouseenter', expand)
      el.addEventListener('mouseleave', shrink)
    })

    window.addEventListener('mousemove', move)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', move)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" style={{ willChange: 'transform' }} />
      <div ref={ringRef} className="custom-cursor-ring" style={{ willChange: 'transform' }} />
    </>
  )
}
