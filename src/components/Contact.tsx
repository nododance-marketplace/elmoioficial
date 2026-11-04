import { motion } from 'framer-motion'
import { InstagramLogo, YoutubeLogo, TiktokLogo, AppleLogo, SpotifyLogo } from '@phosphor-icons/react'
import { FlowerMark } from './FlowerMark'
import { LINKS } from '../data/links'

const SOCIALS = [
  { name: 'Instagram', handle: '@elmoioficial', href: LINKS.instagram, icon: InstagramLogo },
  { name: 'TikTok', handle: '@el_moi_oficial', href: LINKS.tiktok, icon: TiktokLogo },
  { name: 'YouTube', handle: '@ElMoiOficial', href: LINKS.youtube, icon: YoutubeLogo },
  { name: 'Spotify', handle: 'El Moi', href: LINKS.spotifyTrack, icon: SpotifyLogo },
  { name: 'Apple Music', handle: 'El Moi', href: LINKS.appleArtist, icon: AppleLogo },
]

export const Contact = () => (
  <section id="contact" className="relative overflow-hidden bg-bone-100 py-28 md:py-36">
    <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
      <div className="grid grid-cols-1 items-end gap-14 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="mb-4 flex items-center gap-3 text-[12px] font-medium tracking-[0.32em] uppercase text-wine-600">
            <span className="h-px w-10 bg-wine-700/40" />
            Booking · Press · Collaboration
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-wine-950 md:text-7xl"
          >
            Bring the party
            <br />
            <span className="italic text-wine-700">to your city.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-[55ch] text-base leading-relaxed text-ink-900/70 md:text-lg"
          >
            Live sets, press and partner inquiries — the door is through the
            socials, first hand.
          </motion.p>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="divide-y divide-wine-700/15 border-y border-wine-700/15"
        >
          {SOCIALS.map((s, i) => (
            <motion.li
              key={s.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-4 py-4.5 transition-colors"
              >
                <span className="flex items-center gap-4">
                  <s.icon size={20} className="text-wine-700/60 transition-colors group-hover:text-wine-700" />
                  <span className="text-base font-medium text-ink-900">{s.name}</span>
                </span>
                <span className="text-sm text-ink-900/45 transition-colors group-hover:text-wine-700">
                  {s.handle}
                </span>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>

    <FlowerMark className="pointer-events-none absolute -bottom-10 right-[4%] h-56 w-56 opacity-[0.08] md:h-72 md:w-72" />
  </section>
)
