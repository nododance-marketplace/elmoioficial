import { AnimatePresence, motion } from 'framer-motion'
import { List, X } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { FlowerMark } from './FlowerMark'
import { LINKS } from '../data/links'

const SECTIONS = [
  { label: 'Listen', href: '#listen' },
  { label: 'Story', href: '#story' },
  { label: 'Dance', href: '#dance' },
  { label: 'Contact', href: '#contact' },
]

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-wine-950/85 backdrop-blur-md border-b border-gold-500/15 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
        <a href="#top" className="flex items-center gap-2.5 group">
          <FlowerMark className="h-7 w-7 transition-transform duration-500 group-hover:rotate-[30deg]" />
          <span className="font-display text-xl font-semibold tracking-wide text-bone-100">
            El Moi
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {SECTIONS.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="text-[13px] font-medium tracking-[0.14em] uppercase text-bone-100/70 transition-colors hover:text-gold-300"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-bone-100/20 text-bone-100 md:hidden"
          aria-label="Menu"
        >
          {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="mt-3 flex flex-col gap-1 border-t border-gold-500/10 bg-wine-950/95 px-6 py-4 backdrop-blur-md md:hidden"
          >
            {SECTIONS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm tracking-[0.14em] uppercase text-bone-100/80 hover:bg-wine-800 hover:text-gold-300"
              >
                {s.label}
              </a>
            ))}
            <a
              href={LINKS.spotifySearch}
              target="_blank"
              rel="noreferrer"
              className="mt-2 rounded-full bg-gold-500 px-5 py-3 text-center text-sm font-semibold text-wine-950"
            >
              Listen on Spotify
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
