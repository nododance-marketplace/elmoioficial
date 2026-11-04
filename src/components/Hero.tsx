import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, PlayCircle } from '@phosphor-icons/react'
import { useRef } from 'react'
import { RedFlower } from './RedFlower'
import { MagneticButton } from './MagneticButton'
import { LINKS } from '../data/links'

const AMBIENT_PETALS = [
  { left: '6%', delay: 0, duration: 14, size: 18, drift: -60 },
  { left: '18%', delay: 3, duration: 18, size: 13, drift: 40 },
  { left: '38%', delay: 7, duration: 15, size: 9, drift: -30 },
  { left: '74%', delay: 2, duration: 20, size: 15, drift: 50 },
  { left: '88%', delay: 5, duration: 16, size: 11, drift: -45 },
  { left: '55%', delay: 9, duration: 21, size: 7, drift: 30 },
]

const PetalDrift = ({ p }: { p: (typeof AMBIENT_PETALS)[number] }) => (
  <motion.svg
    viewBox="0 0 10 16"
    width={p.size}
    height={p.size * 1.6}
    className="pointer-events-none absolute top-0 opacity-25"
    style={{ left: p.left }}
    initial={{ y: '-6vh', rotate: 0 }}
    animate={{ y: '106vh', x: [0, p.drift, 0], rotate: [0, 260, 400] }}
    transition={{
      duration: p.duration,
      delay: p.delay,
      repeat: Infinity,
      ease: 'linear',
      x: { repeat: Infinity },
    }}
  >
    <path
      d="M5 0 C 8 4, 9 9, 5 16 C 1 9, 2 4, 5 0 Z"
      fill="#c1272d"
    />
  </motion.svg>
)

export const Hero = () => {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yFlower = useTransform(scrollYProgress, [0, 1], [0, 140])
  const yText = useTransform(scrollYProgress, [0, 1], [0, -60])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-wine-950"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 78% 18%, rgba(195,134,42,0.32) 0%, rgba(120,42,55,0.22) 38%, rgba(42,11,22,0) 70%), radial-gradient(90% 70% at 15% 85%, rgba(97,27,49,0.55) 0%, rgba(42,11,22,0) 65%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute right-[-10%] top-[-20%] h-[130%] w-[55%] opacity-[0.35]"
        style={{
          background:
            'conic-gradient(from 200deg at 50% 40%, transparent 0deg, rgba(224,197,139,0.14) 40deg, transparent 90deg)',
          filter: 'blur(30px)',
        }}
      />

      {AMBIENT_PETALS.map((p, i) => (
        <PetalDrift key={i} p={p} />
      ))}

      <motion.div
        style={{ y: yFlower, opacity: fade }}
        className="pointer-events-none absolute right-[2%] top-[12%] hidden w-[34vw] max-w-[560px] min-w-[380px] lg:block"
      >
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <RedFlower state="fresh" className="w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]" />
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: yText }}
        className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center px-4 pt-32 md:px-8 lg:pt-24"
      >
        <div className="max-w-2xl lg:max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mb-6 flex items-center gap-3 text-[12px] font-medium tracking-[0.32em] uppercase text-gold-300"
          >
            <span className="h-px w-10 bg-gold-500/60" />
            Dancer · Artist · Tech Founder
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="font-display text-7xl font-semibold leading-[0.9] tracking-tight text-bone-100 md:text-8xl lg:text-[7.5rem]"
          >
            El Moi
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-6 font-display text-2xl italic leading-snug text-gold-200/90 md:text-3xl"
          >
            Music made for real dance floors.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-6 max-w-[62ch] text-base leading-relaxed text-bone-100/70 md:text-lg"
          >
            Latin partner-dance music. One universe, told in chapters —
            starting with <span className="text-bone-100">SBK Vol. 1</span>, out now.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton href="#listen" variant="gold">
              <PlayCircle size={18} weight="fill" />
              Listen now
            </MagneticButton>
            <MagneticButton href={LINKS.youtube} variant="ghost" className="!text-bone-100 !border-bone-100/30 hover:!bg-bone-100 hover:!text-wine-950">
              Watch videos
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="relative z-10 mx-auto mb-6 mt-10 hidden items-center gap-2 text-bone-100/40 md:flex"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} />
        </motion.span>
        <span className="text-[11px] tracking-[0.3em] uppercase">Scroll</span>
      </motion.div>

      <div className="relative z-10 w-full overflow-hidden border-y border-gold-500/15 bg-wine-900/60 py-4 backdrop-blur-sm">
        <div className="animate-marquee flex w-max items-center whitespace-nowrap">
          {[0, 1].map((n) => (
            <div key={n} className="flex items-center" aria-hidden={n === 1}>
              {[
                'SBK Vol. 1 — Out Now',
                'Latin partner-dance music',
                'One universe, told in chapters',
                'Dancer · Artist · Tech Founder',
              ].map((t) => (
                <span key={t} className="flex items-center">
                  <span className="font-display text-lg italic text-gold-300/90 md:text-xl">{t}</span>
                  <svg viewBox="0 0 10 10" className="mx-8 h-2.5 w-2.5" aria-hidden="true">
                    <circle cx="5" cy="5" r="4" fill="#c1272d" />
                  </svg>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
