import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

export const MagneticButton = ({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
}: {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost' | 'gold'
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 160, damping: 16 })
  const sy = useSpring(my, { stiffness: 160, damping: 16 })
  const tx = useTransform(sx, (v) => v * 0.3)
  const ty = useTransform(sy, (v) => v * 0.3)

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set(e.clientX - (r.left + r.width / 2))
    my.set(e.clientY - (r.top + r.height / 2))
  }

  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  const base =
    'inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium tracking-wide active:scale-[0.97] transition-colors duration-300 will-change-transform'
  const styles = {
    primary: 'bg-wine-700 text-bone-100 hover:bg-wine-600',
    gold: 'bg-gold-500 text-wine-950 hover:bg-gold-400',
    ghost:
      'border border-wine-700/30 text-wine-800 hover:border-wine-700 hover:bg-wine-700 hover:text-bone-100',
  }[variant]

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: tx, y: ty }}
      className="inline-block"
    >
      {href ? (
        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={`${base} ${styles} ${className}`}>
          {children}
        </a>
      ) : (
        <button onClick={onClick} className={`${base} ${styles} ${className}`}>
          {children}
        </button>
      )}
    </motion.div>
  )
}
