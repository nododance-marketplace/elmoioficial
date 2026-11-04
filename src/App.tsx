import { motion, useScroll, useSpring } from 'framer-motion'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Listen } from './components/Listen'
import { Visual } from './components/Visual'
import { Bio } from './components/Bio'
import { Dance } from './components/Dance'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 })

  return (
    <div className="grain">
      <motion.div
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-wine-700 via-gold-500 to-flower-600"
      />
      <Nav />
      <main>
        <Hero />
        <Listen />
        <Visual />
        <Bio />
        <Dance />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
