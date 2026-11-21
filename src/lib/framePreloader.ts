/*
 * EL MOI — film frame preloader.
 *
 * Loads every frame of the scroll film once, with a bounded concurrency
 * pool, and reports progress so the loading intro can show real progress
 * and gate the reveal on it. The loaded images stay cached here; the
 * scroll film draws from this cache.
 */

export const FRAME_COUNT = 276

export function frameSrc(i: number): string {
  return `/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
}

const cache: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT)

let progress = 0
let started = false
let doneResolve: (() => void) | null = null
const listeners = new Set<(p: number) => void>()

export function getFrame(i: number): HTMLImageElement | undefined {
  return cache[i]
}

export function getProgress(): number {
  return progress
}

export function subscribeProgress(fn: (p: number) => void): () => void {
  listeners.add(fn)
  fn(progress)
  return () => listeners.delete(fn)
}

export function whenReady(): Promise<void> {
  if (progress >= 1) return Promise.resolve()
  return new Promise((resolve) => {
    doneResolve = resolve
  })
}

function setProgress(n: number) {
  progress = n
  listeners.forEach((fn) => fn(n))
  if (progress >= 1 && doneResolve) {
    const r = doneResolve
    doneResolve = null
    r()
  }
}

/** Kick off loading every frame, 8 at a time. Safe to call repeatedly. */
export function preloadFrames(): void {
  if (started) return
  started = true

  let loaded = 0
  let next = 0

  const loadNext = (): void => {
    if (next >= FRAME_COUNT) return
    const i = next++
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      cache[i] = img
      loaded++
      setProgress(loaded / FRAME_COUNT)
      loadNext()
    }
    img.onerror = () => {
      // a missing frame must never wedge the loader
      loaded++
      setProgress(loaded / FRAME_COUNT)
      loadNext()
    }
    img.src = frameSrc(i)
  }

  for (let k = 0; k < 8; k++) loadNext()
}
