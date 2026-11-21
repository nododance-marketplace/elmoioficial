import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/*
 * EL MOI — the threshold.
 *
 * No stills, no gate. The loading film autoplays the moment the page
 * loads; when it ends, its own final frame is captured and split —
 * the doors part and the website shows through.
 *
 *   desktop  — horizontal seam: top half lifts, bottom half sinks
 *   mobile   — vertical seam: the film is rotated 90° to fill the
 *              portrait screen, and the frame splits into a left door
 *              and a right door that slide apart
 *
 * Body scroll stays locked until the doors finish parting.
 */

type Phase = 'film' | 'split' | 'revealed'

export function LoadingIntro() {
  const [phase, setPhase] = useState<Phase>('film')
  const [gone, setGone] = useState(false)
  const [frameUrl, setFrameUrl] = useState<string | null>(null)
  const [vertical, setVertical] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timers = useRef<number[]>([])

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // lock body scroll until the doors finish parting
  useEffect(() => {
    document.body.style.overflow = phase === 'revealed' ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [phase])

  const filmEnded = () => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const isVertical = vw < 768 || vw < vh
    setVertical(isVertical)

    // capture the video's true final frame — rotated on mobile — with the
    // same cover geometry it was displayed with, so the doors continue it
    // pixel-for-pixel
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
          if (isVertical) {
            // rotated 90°: the film's height becomes the screen's width
            const s = Math.max(vw / ih, vh / iw)
            ctx.translate(vw / 2, vh / 2)
            ctx.rotate(Math.PI / 2)
            ctx.drawImage(v, (-iw * s) / 2, (-ih * s) / 2, iw * s, ih * s)
          } else {
            const s = Math.max(vw / iw, vh / ih)
            ctx.drawImage(v, (vw - iw * s) / 2, (vh - ih * s) / 2, iw * s, ih * s)
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

  // shared style for both door halves; the mapping differs per orientation
  const doorStyle = vertical
    ? {
        backgroundImage: frameUrl ? `url(${frameUrl})` : undefined,
        backgroundSize: '200vw 100vh',
        backgroundRepeat: 'no-repeat' as const,
      }
    : {
        backgroundImage: frameUrl ? `url(${frameUrl})` : undefined,
        backgroundSize: '100% 100vh',
        backgroundRepeat: 'no-repeat' as const,
      }

  const partEase = [0.7, 0, 0.2, 1] as const

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
                reveals the real page) — rotated on mobile ---------- */}
          <motion.video
            key="film"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            ref={videoRef}
            src="/video/loading-page.mp4"
            autoPlay
            muted
            playsInline
            onEnded={filmEnded}
            onError={filmEnded}
            className="absolute inset-0 h-full w-full object-cover"
            style={
              vertical
                ? {
                    visibility: doorsOpen ? 'hidden' : 'visible',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100vh',
                    height: '100vw',
                    transform: 'translate(-50%, -50%) rotate(90deg)',
                    objectFit: 'cover',
                  }
                : { visibility: doorsOpen ? 'hidden' : 'visible' }
            }
          />

          {/* ---------- THE DOORS: the film's own final frame, split ---------- */}
          {frameUrl && !vertical && (
            <>
              <motion.div
                className="absolute inset-x-0 top-0 h-1/2"
                style={{ ...doorStyle, backgroundPosition: 'center top' }}
                initial={{ y: 0 }}
                animate={doorsOpen ? { y: '-100%' } : { y: 0 }}
                transition={{ duration: 1.4, ease: [...partEase] }}
              />
              <motion.div
                className="absolute inset-x-0 bottom-0 h-1/2"
                style={{ ...doorStyle, backgroundPosition: 'center bottom' }}
                initial={{ y: 0 }}
                animate={doorsOpen ? { y: '100%' } : { y: 0 }}
                transition={{ duration: 1.4, ease: [...partEase] }}
              />
            </>
          )}
          {frameUrl && vertical && (
            <>
              <motion.div
                className="absolute inset-y-0 left-0 w-1/2"
                style={{ ...doorStyle, backgroundPosition: 'left top' }}
                initial={{ x: 0 }}
                animate={doorsOpen ? { x: '-100%' } : { x: 0 }}
                transition={{ duration: 1.4, ease: [...partEase] }}
              />
              <motion.div
                className="absolute inset-y-0 right-0 w-1/2"
                style={{ ...doorStyle, backgroundPosition: 'right top' }}
                initial={{ x: 0 }}
                animate={doorsOpen ? { x: '100%' } : { x: 0 }}
                transition={{ duration: 1.4, ease: [...partEase] }}
              />
            </>
          )}

          {/* film duration — one thin gold line */}
          {phase !== 'revealed' && (
            <div className="absolute inset-x-0 bottom-0 z-10 h-px bg-bone-100/10">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
                className="h-full w-full origin-left bg-gradient-to-r from-gold-500 via-gold-400 to-gold-200"
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
