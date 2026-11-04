import { motion } from 'framer-motion'
import { GlobeHemisphereWest, ArrowUpRight } from '@phosphor-icons/react'
import { MagneticButton } from './MagneticButton'
import { LINKS } from '../data/links'

export const Dance = () => (
  <section id="dance" className="relative overflow-hidden bg-wine-900 py-28 md:py-32">
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(70% 60% at 50% 120%, rgba(47,79,208,0.14) 0%, rgba(42,11,22,0) 60%), radial-gradient(50% 40% at 90% 0%, rgba(224,197,139,0.10) 0%, rgba(42,11,22,0) 55%)',
      }}
    />

    <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[2fr_1fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="mb-4 flex items-center gap-3 text-[12px] font-medium tracking-[0.32em] uppercase text-gold-300"
          >
            <span className="h-px w-10 bg-gold-500/60" />
            Dance-first, always
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-bone-100 md:text-6xl"
          >
            Built for real floors,
            <br />
            <span className="italic text-gold-200/90">on every continent</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-[60ch] text-base leading-relaxed text-bone-100/70 md:text-lg"
          >
            Dance communities carry the songs. Every chapter ends on a
            dance floor — if these records move at all, they move somewhere
            with chairs pushed back.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="rounded-3xl border border-bone-100/10 bg-wine-950/60 p-8 backdrop-blur-sm"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-500/30 text-gold-300">
            <GlobeHemisphereWest size={22} />
          </div>
          <h3 className="mt-5 font-display text-2xl font-semibold text-bone-100">
            nododance
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-bone-100/60">
            Founded by El Moi. A platform for partner dancing around the world.
          </p>
          <MagneticButton href={LINKS.nododance} variant="gold" className="mt-6 !rounded-2xl">
            Visit nododance
            <ArrowUpRight size={15} weight="bold" />
          </MagneticButton>
        </motion.div>
      </div>
    </div>
  </section>
)
