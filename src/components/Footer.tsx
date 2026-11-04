import { InstagramLogo, TiktokLogo, YoutubeLogo } from '@phosphor-icons/react'
import { FlowerMark } from './FlowerMark'
import { LINKS } from '../data/links'

export const Footer = () => (
  <footer className="bg-wine-950 py-14">
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <FlowerMark className="h-8 w-8" />
          <div>
            <p className="font-display text-xl font-semibold text-bone-100">El Moi</p>
            <p className="text-xs tracking-[0.2em] uppercase text-bone-100/40">
              Dancer · Artist · Tech Founder
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {[
            { href: LINKS.instagram, icon: InstagramLogo, label: 'Instagram' },
            { href: LINKS.tiktok, icon: TiktokLogo, label: 'TikTok' },
            { href: LINKS.youtube, icon: YoutubeLogo, label: 'YouTube' },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-bone-100/15 text-bone-100/60 transition-all duration-300 hover:-translate-y-[2px] hover:border-gold-500/50 hover:text-gold-300"
            >
              <s.icon size={17} />
            </a>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-t border-bone-100/10 pt-6 text-xs text-bone-100/40 md:flex-row md:items-center md:justify-between">
        <p>
          © 2026 El Moi · Music &nbsp;℗&nbsp; Sazon Records · SBK Vol. 1. out everywhere
        </p>
        <div className="flex items-center gap-6">
          <a
            href={LINKS.nododance}
            target="_blank"
            rel="noreferrer"
            className="tracking-wide transition-colors hover:text-gold-300"
          >
            nododance
          </a>
          <span className="tracking-[0.2em] uppercase opacity-70">DESTERRADO — coming soon</span>
        </div>
      </div>
    </div>
  </footer>
)
