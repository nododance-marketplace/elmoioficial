import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/*
 * EL MOI — the threshold.
 *
 * The loading film plays in the device's natural orientation:
 *   desktop (landscape screen) — horizontal film, full screen, and the
 *           final frame splits with a horizontal seam (top lifts, bottom sinks)
 *   mobile (portrait screen)  — vertical film (rotated 90°), full screen,
 *           and the final frame splits with a vertical seam (left/right)
 *
 * The doors are the film's own final frame, captured live from the video
 * element — no separate stills. Body scroll stays locked until they part.
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

  // keep the orientation current
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
  const horizontal = vh <= vw // landscape screen → horizontal film

  const filmEnded = () => {
    // capture the video's true final frame with the same cover geometry it
    // was displayed with, so the doors continue it pixel-for-pixel
    const v = videoRef.current
    if (v) {
      try {
        const c = document.createElement('canvas')
        c.width = vw
        c.height = vh
        const ctx = c.getContext('2d')
        if (ctx) {
          const iw = v.videoWidth
          const ih = v.videoHeight
          if (horizontal) {
            const s = Math.max(vw / iw, vh / ih)
            ctx.drawImage(v, (vw - iw * s) / 2, (vh - ih * s) / 2, iw * s, ih * s)
          } else {
            const s = Math.max(vw / ih, vh / iw)
            ctx.translate(vw / 2, vh / 2)
            ctx.rotate(Math.PI / 2)
            ctx.drawImage(v, (-iw * s) / 2, (-ih * s) / 2, iw * s, ih * s)
          }
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
          {/* ---------- THE FILM (holds its final frame after ending;
                hidden the instant the doors start parting so the gap
                reveals the real page) ---------- */}
          <motion.div
            key="film"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {/* the film lives on a plain element — framer never touches its
                transform; rotated only on portrait screens */}
            <video
              ref={videoRef}
              src="/video/loading-page.mp4"
              autoPlay
              muted
              playsInline
              onEnded={filmEnded}
              onError={filmEnded}
              className="absolute"
              style={
                horizontal
                  ? {
                      visibility: doorsOpen ? 'hidden' : 'visible',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }
                  : {
                      visibility: doorsOpen ? 'hidden' : 'visible',
                      top: '50%',
                      left: '50%',
                      width: Math.max(vw, Math.round((vh * 9) / 16) * (16 / 9)),
                      height: Math.max(vw, Math.round((vh * 9) / 16)),
                      maxWidth: 'none',
                      transform: 'translate(-50%, -50%) rotate(90deg)',
                      objectFit: 'cover',
                    }
              }
            />
          </motion.div>

          {/* ---------- THE DOORS: the film's own final frame, split ---------- */}
          {frameUrl && horizontal ? (
            <>
              <motion.div
                className="absolute inset-x-0 top-0 h-1/2"
                style={{
                  backgroundImage: `url(${frameUrl})`,
                  backgroundSize: '100% 200vh',
                  backgroundPosition: 'center top',
                  backgroundRepeat: 'no-repeat',
                }}
                initial={{ y: 0 }}
                animate={doorsOpen ? { y: '-100%' } : { y: 0 }}
                transition={{ duration: 1.4, ease: [0.7, 0, 0.2, 1] }}
              />
              <motion.div
                className="absolute inset-x-0 bottom-0 h-1/2"
                style={{
                  backgroundImage: `url(${frameUrl})`,
                  backgroundSize: '100% 200vh',
                  backgroundPosition: 'center bottom',
                  backgroundRepeat: 'no-repeat',
                }}
                initial={{ y: 0 }}
                animate={doorsOpen ? { y: '100%' } : { y: 0 }}
                transition={{ duration: 1.4, ease: [0.7, 0, 0.2, 1] }}
              />
            </>
          ) : frameUrl ? (
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
          ) : null}

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
