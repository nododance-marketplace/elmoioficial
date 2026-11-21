import { LoadingIntro } from './components/LoadingIntro'
import { ScrollFilm } from './components/ScrollFilm'
import { Footer } from './components/Footer'

/*
 * EL MOI — under reconstruction.
 *
 * The loading threshold is the only thing that remains; everything else
 * lives in New Website Assets\old-website-backup until the new page is
 * built on the scroll-driven film.
 */
export default function App() {
  return (
    <div className="grain bg-ink-950">
      <LoadingIntro />
      <ScrollFilm />
      <Footer />
    </div>
  )
}
