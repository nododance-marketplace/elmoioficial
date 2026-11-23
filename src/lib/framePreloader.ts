/*
 * EL MOI — film frame preloader.
 *
 * Loads every frame of the scroll film with a bounded concurrency pool,
 * per-image timeout and retries (a hung request can never wedge the pool),
 * and reports progress.
 *
 * Memory discipline (this is what keeps iOS from crashing the page):
 *   - the pool holds only the COMPRESSED webp images (~17 MB total)
 *   - decoded bitmaps are created ON DEMAND and kept in a bounded LRU
 *     (max 24 decoded frames near the viewer's position) — memory stays
 *     flat no matter how many frames the film has
 */

export const FRAME_COUNT = 247

const POOL = 8
const TIMEOUT_MS = 12000
const MAX_ATTEMPTS = 3
const RETRY_DELAY_MS = 1200

const SMALL = typeof window !== 'undefined' && window.innerWidth < 768
const TW = SMALL ? 1080 : 1920
const TH = SMALL ? 608 : 1080
const MAX_BITMAPS = 24

export function frameSrc(i: number): string {
  return SMALL
    ? `/frames/small/s_${String(i + 1).padStart(4, '0')}.webp`
    : `/frames/w_${String(i + 1).padStart(4, '0')}.webp`
}

const cache: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT)
const settled: boolean[] = new Array(FRAME_COUNT).fill(false)
const attempts: number[] = new Array(FRAME_COUNT).fill(0)

const bitmaps = new Map<number, ImageBitmap>()
let focus = 0

let progress = 0
let doneCount = 0
let started = false
let next = 0
let inFlight = 0
let doneResolve: (() => void) | null = null
const listeners = new Set<(p: number) => void>()

/** the scroll film calls this on every frame change — steers the LRU eviction */
export function setFocus(i: number): void {
  focus = i
}

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

function unsettledCount(): number {
  let n = 0
  for (let i = 0; i < FRAME_COUNT; i++) if (!settled[i]) n++
  return n
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

/**
 * Decoded frame, on demand: returns a pre-decoded bitmap when one is
 * cached nearby, otherwise decodes now. The decoded store is an LRU
 * capped at MAX_BITMAPS — far frames are evicted to keep memory flat.
 */
export async function getFrameBitmap(
  i: number,
): Promise<ImageBitmap | HTMLImageElement | undefined> {
  const hit = bitmaps.get(i)
  if (hit) {
    bitmaps.delete(i)
    bitmaps.set(i, hit) // refresh LRU order
    return hit
  }

  const img = getFrame(i)
  if (!img) return undefined

  let decoded: ImageBitmap | HTMLImageElement = img
  try {
    decoded = await createImageBitmap(img, {
      resizeWidth: TW,
      resizeHeight: TH,
      resizeQuality: 'high',
    })
  } catch {
    decoded = img // older browsers: draw the raw image
  }

  if (decoded instanceof ImageBitmap) {
    bitmaps.set(i, decoded)
    while (bitmaps.size > MAX_BITMAPS) {
      let far = -1
      let dist = -1
      bitmaps.forEach((_, k) => {
        const d = Math.abs(k - focus)
        if (d > dist && k !== i) {
          dist = d
          far = k
        }
      })
      if (far < 0) break
      bitmaps.delete(far)
    }
  }
  return decoded
}
