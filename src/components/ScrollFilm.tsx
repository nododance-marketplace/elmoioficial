import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { LINKS } from '../data/links'
import { FRAME_COUNT, getFrame, preloadFrames, whenReady } from '../lib/framePreloader'

/*
 * EL MOI — the walk through the salon.
 *
 * 276 frames drawn to one sticky canvas. Scroll is the only thing that
 * moves the film: progress across the section maps to the frame index,
 * with flat hold zones on the iso view, the portrait and the clothing
 * rack. On each hold, clickable hotspots appear over the real things in
 * the frame — the nodo computer, the social icons on the painting, the
 * Desterrado shop frame.
 */

const SECTION_VH = 2000 // scroll length of the walk (half of the previous speed)

// scroll progress -> frame index, with flat holds (frame index is 0-based)
const KEYFRAMES: Array<[number, number]> = [
  [0.0, 0],    // iso wide (arrival)
  [0.05, 0],   // brief arrival hold
  [0.24, 116], // glide to the portrait
  [0.36, 116], // HOLD — portrait (social icons)
  [0.56, 165], // glide to the Nodo desk
  [0.68, 165], // HOLD — Nodo dance pit stop (the screen)
  [0.88, 233], // glide to the clothing rack
  [1.0, 233],  // HOLD — rack (Desterrado shop frame)
]

function frameAt(p: number): number {
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const [p0, f0] = KEYFRAMES[i]
    const [p1, f1] = KEYFRAMES[i + 1]
    if (p >= p0 && p <= p1) {
      if (p1 === p0) return f0
      const t = (p - p0) / (p1 - p0)
      return Math.round(f0 + (f1 - f0) * t)
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1][1]
}

type Hold = 'nodo' | 'portrait' | 'rack' | null
function holdAt(frame: number): Hold {
  if (frame === 165) return 'nodo'
  if (frame === 116) return 'portrait'
  if (frame >= FRAME_COUNT - 1) return 'rack'
  return null
}

/*
 * Hotspots are placed as fractions of the SOURCE frame; they are mapped
 * through the cover-crop rect the canvas draws with, so they sit exactly
 * on the things in the picture at any viewport size.
 */
type Hotspot = { fx: number; fy: number; href: string; label: string; icon: 'node' | 'ig' | 'yt' | 'tt' | 'sp' | 'am' | 'ym' | 'dz' }

const HOTSPOTS: Record<'nodo' | 'portrait' | 'rack', Hotspot[]> = {
  nodo: [{ fx: 0.455, fy: 0.35, href: LINKS.nododance, label: 'nododance.com', icon: 'node' }],
  portrait: [
    { fx: 0.335, fy: 0.075, href: LINKS.instagram, label: 'Instagram', icon: 'ig' },
    { fx: 0.5, fy: 0.09, href: LINKS.youtube, label: 'YouTube', icon: 'yt' },
    { fx: 0.655, fy: 0.11, href: LINKS.tiktok, label: 'TikTok', icon: 'tt' },
    { fx: 0.335, fy: 0.925, href: LINKS.appleMusic, label: 'Apple Music', icon: 'am' },
    { fx: 0.5, fy: 0.945, href: LINKS.spotify, label: 'Spotify', icon: 'sp' },
    { fx: 0.665, fy: 0.925, href: LINKS.youtubeMusic, label: 'YouTube Music', icon: 'ym' },
  ],
  rack: [{ fx: 0.52, fy: 0.26, href: LINKS.desterrado, label: 'Desterrado — Capítulo I', icon: 'dz' }],
}

function IconGlyph({ icon }: { icon: Hotspot['icon'] }) {
  const cls = 'h-4 w-4'
  switch (icon) {
    case 'node':
      return <span className={`${cls} grid place-items-center rounded-full bg-gold-400 font-sans text-[9px] font-bold text-ink-950`}>nd</span>
    case 'dz':
      return <span className={`${cls} grid place-items-center rounded-full bg-gold-400 font-sans text-[9px] font-bold text-ink-950`}>D</span>
    case 'ig':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      )
    case 'yt':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor">
          <path d="M23 12s0-3.8-.5-5.5c-.3-1-1.1-1.8-2.1-2C18.7 4 12 4 12 4s-6.7 0-8.4.5c-1 .2-1.8 1-2.1 2C1 8.2 1 12 1 12s0 3.8.5 5.5c.3 1 1.1 1.8 2.1 2 1.7.5 8.4.5 8.4.5s6.7 0 8.4-.5c-1 .2 1.8-1 2.1-2 .5-1.7.5-5.5.5-5.5ZM9.8 15.5v-7l6.2 3.5-6.2 3.5Z" />
        </svg>
      )
    case 'tt':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor">
          <path d="M16.5 3c.4 2.2 1.8 3.9 4 4.3v3.1c-1.6 0-3-.5-4-1.3v6.4c0 3.4-2.7 6.2-6.1 6.2S4.2 19 4.2 15.5c0-3.4 2.7-6.2 6.2-6.2.3 0 .7 0 1 .1v3.3c-.3-.1-.7-.2-1-.2-1.7 0-3 1.4-3 3s1.3 3 3 3 3-1.4 3-3V3h3.1Z" />
        </svg>
      )
    case 'sp':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor">
          <path d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22Zm5 16.2c-.2.3-.6.4-.9.2-2.6-1.6-5.9-2-9.8-1.1-.4.1-.7-.1-.8-.5-.1-.4.1-.7.5-.8 4.2-1 7.9-.5 10.8 1.3.3.2.4.6.2.9Zm1.3-3.1c-.2.4-.7.5-1.1.3-3-1.9-7.6-2.4-11.2-1.3-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 4.1-1.2 9.1-.6 12.5 1.4.4.2.5.7.3 1.1Zm.1-3.2C14.9 8.8 8.9 8.6 5.4 9.7c-.5.1-1-.1-1.2-.6-.1-.5.1-1 .6-1.2 4-1.2 10.6-1 14.7 1.4.5.3.6.9.4 1.3-.3.5-.9.6-1.5.3Z" />
        </svg>
      )
    case 'am':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor">
          <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.4 14.3c-.2.3-.6.4-.9.2-2.4-1.5-5.5-1.8-9.1-1-.4.1-.7-.2-.8-.6-.1-.4.2-.7.6-.8 3.9-.9 7.3-.5 10 1.2.3.2.4.6.2 1Zm1.2-2.9c-.2.4-.7.5-1 .3-2.8-1.7-7-1.9-10.2-1-.4.1-.8-.1-.9-.5-.1-.4.1-.8.5-.9 3.7-1.1 8.2-.9 11.4 1.1.4.2.5.7.2 1Zm.1-3c-3.2-1.9-8.5-2.1-11.6-1.2-.5.1-1-.2-1.1-.6-.1-.5.2-1 .6-1.1 3.6-1.1 9.4-.9 13 1.3.4.2.6.8.3 1.2-.2.4-.8.6-1.2.4Z" />
        </svg>
      )
    case 'ym':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="currentColor">
          <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.4a2.8 2.8 0 0 0-2 2C2 8.9 2 12.3 2 12.3s0 3.4.4 5.1a2.8 2.8 0 0 0 2 2c1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2c.4-1.7.4-5.1.4-5.1s0-3.4-.4-5.1ZM10 15.5V9.1l5.5 3.2-5.5 3.2Z" />
        </svg>
      )
  }
}

export function ScrollFilm() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const rectRef = useRef({ dx: 0, dy: 0, w: 1, h: 1 })
  const [frame, setFrame] = useState(0)
  const [inView, setInView] = useState(false)

  // kick the preload (shared with the intro)
  useEffect(() => {
    preloadFrames()
  }, [])

  // track visibility so the intro only releases when the film can draw
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '200px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // draw the current frame with object-cover geometry
  const draw = (i: number) => {
    const canvas = canvasRef.current
    const img = getFrame(i)
    if (!canvas || !img) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const vw = window.innerWidth
    const vh = window.innerHeight
    const cw = Math.round(vw * dpr)
    const ch = Math.round(vh * dpr)
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw
      canvas.height = ch
    }
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    const scale = Math.max(cw / iw, ch / ih)
    const w = iw * scale
    const h = ih * scale
    const dx = (cw - w) / 2
    const dy = (ch - h) / 2
    rectRef.current = { dx: dx / dpr, dy: dy / dpr, w: w / dpr, h: h / dpr }
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, w, h)
  }

  // the film is driven by scroll — the position is polled (bulletproof in
  // every environment) and mapped straight to the frame index
  useEffect(() => {
    let lastY = -1
    const tick = () => {
      const el = sectionRef.current
      if (!el) return
      const y = window.scrollY
      if (y === lastY) return
      lastY = y
      const total = el.offsetHeight - window.innerHeight
      if (total <= 0) return
      const p = Math.min(1, Math.max(0, y / total))
      const i = frameAt(p)
      if (i !== frameRef.current) {
        frameRef.current = i
        setFrame(i)
        draw(i)
      }
    }
    tick()
    const t = window.setInterval(tick, 120)
    window.addEventListener('resize', tick)
    return () => {
      window.clearInterval(t)
      window.removeEventListener('resize', tick)
    }
  }, [])

  // self-healing repaint: every beat while the walk is on screen, redraw
  // the current frame — covers a draw that fired before its frame arrived
  useEffect(() => {
    let cancelled = false
    whenReady().then(() => {
      if (!cancelled) draw(frameRef.current)
    })
    const t = window.setInterval(() => {
      if (inView && !cancelled) draw(frameRef.current)
    }, 400)
    return () => {
      cancelled = true
      window.clearInterval(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  const hold = holdAt(frame)
  const showHotspots = inView && hold !== null
  const rect = rectRef.current

  return (
    <section ref={sectionRef} aria-label="El Moi salon walkthrough" className="relative" style={{ height: `${SECTION_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-ink-950">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* hotspot layer — mapped through the cover rect */}
        {showHotspots && hold && (
          <div
            className="absolute"
            style={{ left: rect.dx, top: rect.dy, width: rect.w, height: rect.h }}
          >
            {HOTSPOTS[hold].map((hs) => (
              <motion.a
                key={hs.href + hs.label}
                href={hs.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2"
                style={{ left: `${hs.fx * 100}%`, top: `${hs.fy * 100}%` }}
              >
                <span className="grid h-12 w-12 place-items-center rounded-full border border-gold-300 bg-ink-950/80 text-gold-200 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-colors group-hover:border-gold-100 group-hover:text-gold-100">
                  <IconGlyph icon={hs.icon} />
                </span>
                <span className="whitespace-nowrap rounded-sm border border-gold-400/50 bg-ink-950/75 px-3 py-1.5 font-sans text-[10px] uppercase tracking-[0.3em] text-gold-200 shadow-[0_6px_20px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-colors group-hover:border-gold-200 group-hover:text-gold-100">
                  {hs.label}
                </span>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
