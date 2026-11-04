import { motion } from 'framer-motion'
import {
  AppleLogo,
  InstagramLogo,
  SpotifyLogo,
  TiktokLogo,
  YoutubeLogo,
  ArrowUpRight,
} from '@phosphor-icons/react'
import { LINKS, RELEASE, TRACKS } from '../data/links'

const PLATFORMS = [
  { name: 'Spotify', href: LINKS.spotifyTrack, icon: SpotifyLogo },
  { name: 'Apple Music', href: LINKS.appleArtist, icon: AppleLogo },
  { name: 'YouTube', href: LINKS.youtube, icon: YoutubeLogo },
  { name: 'Instagram', href: LINKS.instagram, icon: InstagramLogo },
  { name: 'TikTok', href: LINKS.tiktok, icon: TiktokLogo },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export const Listen = () => (
  <section id="listen" className="relative overflow-hidden bg-wine-950 py-28 md:py-36">
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(80% 60% at 85% 10%, rgba(97,27,49,0.5) 0%, rgba(42,11,22,0) 60%' +
          '), radial-gradient(60% 50% at 10% 90%, rgba(47,79,208,0.10) 0%, rgba(42,11,22,0) 60%)',
      }}
    />

    <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
      <div className="grid grid-cols-1 gap-14 md:grid-cols-2 lg:gap-20">
        <div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} custom={0}>
            <p className="mb-4 flex items-center gap-3 text-[12px] font-medium tracking-[0.32em] uppercase text-gold-300">
              <span className="h-px w-10 bg-gold-500/60" />
              La Música
            </p>
            <h2 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-bone-100 md:text-6xl">
              SBK Vol. 1<span className="text-gold-500">.</span>
            </h2>
            <p className="mt-4 text-sm tracking-wide text-bone-100/50">
              {RELEASE.kind} · {RELEASE.label} · {RELEASE.date}
            </p>
          </motion.div>

          <motion.figure
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            custom={1}
            className="group relative mt-10 w-full max-w-md"
          >
            <div className="relative overflow-hidden rounded-3xl border border-gold-500/15 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.6)]">
              <img
                src={RELEASE.artwork}
                alt={`${RELEASE.title} cover art`}
                width={640}
                height={640}
                className="w-full transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <svg
                viewBox="0 0 10 16"
                width="14"
                height="22"
                aria-hidden="true"
                className="absolute bottom-5 right-6 opacity-30 transition-opacity duration-500 group-hover:opacity-80"
              >
                <path d="M5 0 C 8 4, 9 9, 5 16 C 1 9, 2 4, 5 0 Z" fill="#c1272d" />
              </svg>
            </div>
          </motion.figure>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            custom={2}
            className="mt-10 flex flex-wrap gap-3"
          >
            {PLATFORMS.map((p) => (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5 rounded-full border border-bone-100/15 bg-wine-900/50 px-5 py-2.5 text-sm text-bone-100/80 transition-all duration-300 hover:-translate-y-[1px] hover:border-gold-500/50 hover:bg-wine-800 hover:text-bone-100"
              >
                <p.icon
                  size={18}
                  className="text-bone-100/50 transition-colors group-hover:text-gold-300"
                />
                {p.name}
              </a>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col gap-10">
          <motion.ol
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            custom={1}
            className="divide-y divide-bone-100/10 border-y border-bone-100/10"
          >
            {TRACKS.map((t) => (
              <motion.li
                key={t.no}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: t.no * 0.08 }}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-5 transition-colors md:grid-cols-[2.5rem_1fr_auto_auto]"
              >
                <span className="font-mono text-sm text-gold-500/70">{String(t.no).padStart(2, '0')}</span>
                <span className="font-display text-xl font-medium text-bone-100 transition-transform duration-300 group-hover:translate-x-1 md:text-2xl">
                  {t.title}
                </span>
                <span className="hidden font-mono text-sm text-bone-100/40 md:block">
                  {t.duration}
                </span>
                <span className="flex items-center gap-3">
                  <a
                    href={t.apple}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${t.title} on Apple Music`}
                    className="text-bone-100/40 transition-colors hover:text-bone-100"
                  >
                    <AppleLogo size={19} />
                  </a>
                  <a
                    href={`${LINKS.spotifySearch}${encodeURIComponent(t.spotifyQuery)}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${t.title} on Spotify`}
                    className="text-bone-100/40 transition-colors hover:text-bone-100"
                  >
                    <SpotifyLogo size={19} />
                  </a>
                </span>
              </motion.li>
            ))}
          </motion.ol>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            custom={2}
            className="overflow-hidden rounded-2xl border border-bone-100/10 bg-wine-900/40"
          >
            <iframe
              title={`Spotify player: ${TRACKS[1].title}`}
              src={LINKS.spotifyEmbed}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="block"
            />
          </motion.div>

          <motion.dl
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            custom={3}
            className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-bone-100/10 bg-bone-100/[0.04] sm:grid-cols-3"
          >
            {[
              ['Composer', RELEASE.composer],
              ['Executive Producer', RELEASE.executiveProducer],
              ['Genre', RELEASE.genre],
            ].map(([k, v]) => (
              <div key={k} className="px-6 py-5">
                <dt className="text-[11px] tracking-[0.22em] uppercase text-gold-500/70">{k}</dt>
                <dd className="mt-1.5 text-sm text-bone-100/85">{v}</dd>
              </div>
            ))}
          </motion.dl>

          <motion.a
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            custom={4}
            href={LINKS.youtubeReact}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center justify-between rounded-2xl border border-bone-100/10 bg-bone-100/[0.03] px-6 py-5 transition-colors hover:border-gold-500/40"
          >
            <span>
              <span className="block text-[11px] tracking-[0.22em] uppercase text-gold-500/70">
                Official channel
              </span>
              <span className="mt-1 block text-lg text-bone-100/90 group-hover:text-bone-100">
                Videos and live takes, first hand
              </span>
            </span>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-bone-100/20 transition-all duration-300 group-hover:-rotate-45 group-hover:border-gold-400 group-hover:text-gold-300">
              <ArrowUpRight size={18} />
            </span>
          </motion.a>
        </div>
      </div>
    </div>
  </section>
)
