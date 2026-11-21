/*
 * EL MOI — film frame preloader.
 *
 * Loads every frame of the scroll film with a bounded concurrency pool,
 * per-image timeout and retries (a hung request can never wedge the pool),
 * and reports progress. The loaded images stay cached here; the scroll
 * film draws from this cache.
 */

export const FRAME_COUNT = 247

export function frameSrc(i: number): string {
  return `/frames/w_${String(i + 1).padStart(4, '0')}.webp`
}

const POOL = 8
const TIMEOUT_MS = 12000
const MAX_ATTEMPTS = 3
const RETRY_DELAY_MS = 1200

const cache: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT)
const settled: boolean[] = new Array(FRAME_COUNT).fill(false)
const attempts: number[] = new Array(FRAME_COUNT).fill(0)

let progress = 0
let doneCount = 0
let started = false
let next = 0
let inFlight = 0
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
  if (doneCount >= FRAME_COUNT) return Promise.resolve()
  return new Promise((resolve) => {
    doneResolve = resolve
  })
}

function setProgress() {
  progress = doneCount / FRAME_COUNT
  listeners.forEach((fn) => fn(progress))
  if (doneCount >= FRAME_COUNT && doneResolve) {
    const r = doneResolve
    doneResolve = null
    r()
  }
}

function loadImage(i: number): void {
  inFlight++
  attempts[i]++
  settled[i] = false

  const img = new Image()
  img.decoding = 'async'

  const settle = (ok: boolean) => {
    if (settled[i]) return
    inFlight--
    settled[i] = true
    if (ok) cache[i] = img
    doneCount++
    setProgress()
    if (!ok && attempts[i] < MAX_ATTEMPTS) {
      window.setTimeout(() => {
        loadImage(i)
        pump()
      }, RETRY_DELAY_MS)
      return
    }
    pump()
  }

  img.onload = () => settle(true)
  img.onerror = () => settle(false)

  // stall guard: a request that never settles is treated as failed and
  // retried, so the pool can never wedge
  window.setTimeout(() => {
    if (!settled[i]) settle(false)
  }, TIMEOUT_MS)

  img.src = frameSrc(i)
}

function pump(): void {
  while (next < FRAME_COUNT && inFlight < POOL) {
    loadImage(next++)
  }
  setProgress()
}

/** Kick off loading every frame. Safe to call repeatedly. */
export function preloadFrames(): void {
  if (started) return
  started = true
  pump()
}
