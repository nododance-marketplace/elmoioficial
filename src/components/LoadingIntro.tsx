import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/*
 * EL MOI — the threshold.
 *
 * The loading film plays VERTICALLY on every device — rotated 90° so El Moi
 * lies up the screen, contained like a phone-format film (soft side bars on
 * wide monitors). When it ends, its own final frame is captured and split
 * along the vertical seam — the left door slides left, the right door
 * slides right — and the website shows through.
 *
 * Body scroll stays locked until the doors finish parting.
 */

type Phase = 'film' | 'split' | 'revealed'

export function LoadingIntro() {
  const [phase, setPhase] = useState<Phase>('film')
  const [gone, setGone] = useState(false)
  const [frameUrl, setFrameUrl] = useState<string | null>(null)
  const [dims, setDims] = useState(() => ({ vw: window.innerWidth, vh: window.innerHeight }))
  const videoRef = useRef<HTMLVideoElement>(null)
  const timers = useRef<number[]>([])

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // keep the vertical geometry current
  useEffect(() => {
    const onResize = () => setDims({ vw: window.innerWidth, vh: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // lock body scroll until the doors finish parting
  useEffect(() => {
    document.body.style.overflow = phase === 'revealed' ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [phase])

  const { vw, vh } = dims

  // the film, rotated 90°:
  //   portrait screens — COVER: it fills the phone edge to edge
  //   landscape screens — CONTAIN: the full vertical frame with soft bars
  const isPortraitScreen = vh > vw
  const coverH = Math.max(vw, Math.round((vh * 9) / 16))
  const coverW = Math.round((coverH * 16) / 9)
  const filmW = isPortraitScreen ? coverW : Math.min(vh, Math.round((vw * 16) / 9))
  const filmH = isPortraitScreen ? coverH : Math.round((filmW * 9) / 16)

  const filmEnded = () => {
    // capture the screen composite (rotated film on its backdrop) so the
    // doors continue it pixel-for-pixel
    const v = videoRef.current
    if (v) {
      try {
        const c = document.createElement('canvas')
        c.width = vw
        c.height = vh
        const ctx = c.getContext('2d')
        if (ctx) {
          ctx.fillStyle = '#1a1414'
          ctx.fillRect(0, 0, vw, vh)
          ctx.save()
          ctx.translate(vw / 2, vh / 2)
          ctx.rotate(Math.PI / 2)
          ctx.drawImage(v, -filmW / 2, -filmH / 2, filmW, filmH)
          ctx.restore()
          setFrameUrl(c.toDataURL('image/jpeg', 0.9))
        }
      } catch {
        // if capture fails, the doors simply part over the held video frame
      }
    }
    setPhase('split')
    // a breath on the final frame, then the doors part
    later(450, () => setPhase('revealed'))
    later(2200, () => setGone(true))
  }

  const doorsOpen = phase === 'revealed'

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          key="threshold"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className={`fixed inset-0 z-[100] overflow-hidden ${
            doorsOpen ? 'pointer-events-none bg-transparent' : 'bg-ink-950'
          }`}
        >
          {/* ---------- THE FILM, VERTICAL ---------- */}
          <motion.div
            key="film"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {/* the rotated film lives on a plain element — framer never
                touches its transform */}
            <video
              ref={videoRef}
              src="/video/loading-page.mp4"
              autoPlay
              muted
              playsInline
              onEnded={filmEnded}
              onError={filmEnded}
              className="absolute"
              style={{
                visibility: doorsOpen ? 'hidden' : 'visible',
                top: '50%',
                left: '50%',
                width: filmW,
                height: filmH,
                maxWidth: 'none',
                transform: 'translate(-50%, -50%) rotate(90deg)',
                objectFit: 'cover',
              }}
            />
          </motion.div>

          {/* ---------- THE DOORS: the film's own final frame, split
                down the vertical seam; each half carries half of the
                full-screen frame ---------- */}
          {frameUrl && (
            <>
              <motion.div
                className="absolute inset-y-0 left-0 w-1/2"
                style={{
                  backgroundImage: `url(${frameUrl})`,
                  backgroundSize: '200% 100%',
                  backgroundPosition: 'left top',
                  backgroundRepeat: 'no-repeat',
                }}
                initial={{ x: 0 }}
                animate={doorsOpen ? { x: '-100%' } : { x: 0 }}
                transition={{ duration: 1.4, ease: [0.7, 0, 0.2, 1] }}
              />
              <motion.div
                className="absolute inset-y-0 right-0 w-1/2"
                style={{
                  backgroundImage: `url(${frameUrl})`,
                  backgroundSize: '200% 100%',
                  backgroundPosition: 'right top',
                  backgroundRepeat: 'no-repeat',
                }}
                initial={{ x: 0 }}
                animate={doorsOpen ? { x: '100%' } : { x: 0 }}
                transition={{ duration: 1.4, ease: [0.7, 0, 0.2, 1] }}
              />
            </>
          )}

          {/* film duration — one thin gold line */}
          {phase !== 'revealed' && (
            <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-bone-100/10">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 3.6, ease: 'easeInOut' }}
                className="h-full w-full origin-left bg-gradient-to-r from-gold-500 via-gold-400 to-gold-200"
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
