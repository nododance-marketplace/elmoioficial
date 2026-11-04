import { motion } from 'framer-motion'
import { ArrowUpRight } from '@phosphor-icons/react'
import { LINKS } from '../data/links'

export const Bio = () => (
  <section id="story" className="relative overflow-hidden bg-bone-50 py-28 md:py-36">
    <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="mb-4 flex items-center gap-3 text-[12px] font-medium tracking-[0.32em] uppercase text-wine-600">
            <span className="h-px w-10 bg-wine-700/40" />
            The story
          </p>
          <h2 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-wine-950 md:text-6xl">
            One universe,
            <br />
            <span className="italic text-wine-700">told in chapters</span>
          </h2>

          <div className="mt-10 overflow-hidden rounded-2xl border border-wine-700/15 bg-bone-100">
            <div className="border-b border-wine-700/15 px-6 py-4 text-[11px] tracking-[0.24em] uppercase text-wine-700/60">
              Chapter ledger
            </div>
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 px-6 py-5">
              <div>
                <p className="font-display text-lg font-semibold text-wine-950">
                  One
                </p>
                <p className="text-sm text-ink-900/60">
                  Latin partner-dance music · <span className="text-cobalt-600">cobalt accent</span>
                </p>
              </div>
              <span className="flex items-center gap-2 rounded-full border border-cobalt-600/30 px-3 py-1 text-[11px] tracking-[0.18em] uppercase text-cobalt-700">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cobalt-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cobalt-600" />
                </span>
                Now
              </span>
            </div>
            <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-wine-700/10 px-6 py-5 opacity-45">
              <div>
                <p className="font-display text-lg font-semibold text-wine-950">Two — Sealed</p>
                <p className="text-sm text-ink-900/60">Only one chapter is public at a time</p>
              </div>
              <span className="rounded-full border border-wine-700/20 px-3 py-1 text-[11px] tracking-[0.18em] uppercase text-wine-700/60">
                Soon
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="font-display text-2xl italic leading-snug text-wine-900 md:text-[1.7rem]"
          >
            Dancer. Artist. Tech founder.
          </motion.p>

          {[
            'El Moi makes Latin partner-dance music — records built for real social floors, sung in Spanish, moving between eras like a protagonist through one long story.',
            'The catalog advances one chapter at a time: one world, one color, a handful of songs, and a finale on the dance floor.',
          ].map((text, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="max-w-[65ch] text-base leading-relaxed text-ink-900/75 md:text-lg"
            >
              {i === 1 ? text.replace('.', '') : text}
            </motion.p>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="max-w-[65ch] text-base leading-relaxed text-ink-900/75 md:text-lg"
          >
            He is also the founder of{' '}
            <a
              href={LINKS.nododance}
              target="_blank"
              rel="noreferrer"
              className="text-wine-700 underline decoration-wine-700/30 underline-offset-4 transition-colors hover:decoration-wine-700"
            >
              nododance
            </a>
            , a platform for partner dancing around the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group flex items-center gap-3 self-start rounded-full border border-wine-700/20 px-5 py-2.5 text-sm text-wine-800 transition-colors hover:border-wine-700/50 hover:bg-bone-100"
          >
            <a href="#listen" className="tracking-wide">
              Start with SBK Vol. 1
            </a>
            <ArrowUpRight size={15} className="text-wine-600 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.div>
        </div>
      </div>
    </div>
  </section>
)
