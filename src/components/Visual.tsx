import { motion, useScroll, useTransform } from 'framer-motion'
import { ImageSquare } from '@phosphor-icons/react'
import { useRef } from 'react'

type Frame = {
  src: string | null
  ratio: string
  caption?: string
}

const FRAMES: Frame[] = [
  { src: null, ratio: '4 / 5' },
  { src: null, ratio: '16 / 10' },
  { src: null, ratio: '3 / 4' },
]

const Still = ({ frame, index }: { frame: Frame; index: number }) => {
  const inner = (
    <div
      className="group relative overflow-hidden rounded-2xl border border-bone-100/10 bg-wine-900 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.65)]"
      style={{ aspectRatio: frame.ratio }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]"
        style={{
          background:
            index === 0
              ? 'radial-gradient(120% 90% at 20% 10%, rgba(224,197,139,0.20) 0%, rgba(97,27,49,0.35) 45%, rgba(42,11,22,0) 75%), radial-gradient(90% 70% at 85% 90%, rgba(193,39,45,0.22) 0%, rgba(42,11,22,0) 60%)'
              : index === 1
                ? 'radial-gradient(100% 80% at 50% 0%, rgba(47,79,208,0.16) 0%, rgba(42,11,22,0) 60%), radial-gradient(90% 90% at 10% 100%, rgba(224,197,139,0.16) 0%, rgba(42,11,22,0) 65%)'
                : 'radial-gradient(110% 100% at 80% 15%, rgba(193,39,45,0.18) 0%, rgba(42,11,22,0) 65%), radial-gradient(80% 60% at 15% 85%, rgba(148,55,79,0.30) 0%, rgba(42,11,22,0) 60%)',
        }}
      />
      {frame.src ? (
        <img
          src={frame.src}
          alt=""
          className="relative h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center text-bone-100/15">
          <ImageSquare size={44} weight="thin" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]" />
    </div>
  )
  return index === 0 ? inner : inner
}

export const Visual = () => {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yA = useTransform(scrollYProgress, [0, 1], [60, -60])
  const yB = useTransform(scrollYProgress, [0, 1], [-30, 50])

  return (
    <section ref={ref} className="relative overflow-hidden bg-wine-950 py-24 md:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 70% at 85% 20%, rgba(97,27,49,0.45) 0%, rgba(42,11,22,0) 60%), radial-gradient(70% 60% at 10% 85%, rgba(224,197,139,0.08) 0%, rgba(42,11,22,0) 55%)',
        }}
      />

      <motion.svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-[-8%] h-[420px] w-[420px] opacity-[0.10]"
        style={{ y: yB }}
      >
        <g fill="#c1272d">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <ellipse key={a} cx="50" cy="27" rx="9" ry="17" transform={a ? `rotate(${a} 50 48)` : undefined} />
          ))}
        </g>
        <circle cx="50" cy="48" r="9" fill="#c6a15b" />
      </motion.svg>

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
            style={{ y: yA }}
            className="md:col-span-7 md:row-span-2"
          >
            <Still frame={FRAMES[0]} index={0} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.12 }}
            style={{ y: yB }}
            className="md:col-span-5 md:mt-16"
          >
            <Still frame={FRAMES[1]} index={1} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.22 }}
            style={{ y: yA }}
            className="md:col-span-5 md:-mt-10"
          >
            <Still frame={FRAMES[2]} index={2} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
