'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'

import { ReadingPlace, ReadingPlaces } from '@/lib/reading-place'

function measure(headings: readonly { id: string }[]) {
  const found: { id: string; top: number }[] = []
  for (const heading of headings) {
    const element = document.getElementById(heading.id)
    if (!element) continue
    found.push({
      id: heading.id,
      top: element.getBoundingClientRect().top + window.scrollY
    })
  }
  return found
}

function samePageHash(href: string) {
  if (href.startsWith('#')) return true
  try {
    const url = new URL(href, window.location.href)
    return url.pathname === window.location.pathname && url.hash.length > 1
  } catch {
    return false
  }
}

/**
 * Restores a chapter opened with no hash, and records the place as the
 * reader scrolls or follows a heading on the page.
 */
export function useReadingPlace({
  slug,
  headings,
  signedIn,
  place
}: {
  slug: string
  headings: readonly { id: string }[]
  signedIn: boolean
  place: ReadingPlace | null
}) {
  const headingsRef = useRef(headings)
  headingsRef.current = headings
  const signedInRef = useRef(signedIn)
  signedInRef.current = signedIn
  const placeRef = useRef(place)
  placeRef.current = place
  const stopRestore = useRef(() => {})
  const allowUntil = useRef(0)
  const latest = useRef<ReadingPlace | null>(null)
  const syncTimer = useRef(0)

  const scheduleSync = () => {
    if (!signedInRef.current) return
    window.clearTimeout(syncTimer.current)
    syncTimer.current = window.setTimeout(() => {
      void sendPlaces(ReadingPlaces.read())
    }, 1000)
  }
  const scheduleSyncRef = useRef(scheduleSync)
  scheduleSyncRef.current = scheduleSync

  const remember = (next: ReadingPlace) => {
    latest.current = next
    ReadingPlaces.persist(slug, next)
    scheduleSync()
  }
  const rememberRef = useRef(remember)
  rememberRef.current = remember

  const allow = () => {
    allowUntil.current = Date.now() + 1200
    stopRestore.current()
  }

  useLayoutEffect(() => {
    let cancelled = false
    let userTookOver = false
    const takeOver = () => {
      userTookOver = true
    }
    stopRestore.current = takeOver

    const saved = () =>
      ReadingPlaces.choose(ReadingPlaces.read()[slug] ?? null, placeRef.current)

    const apply = () => {
      if (cancelled || userTookOver || window.location.hash) return
      const current = saved()
      if (!current) return
      const top = ReadingPlaces.scrollTarget(
        current,
        measure(headingsRef.current),
        document.documentElement.scrollHeight,
        window.innerHeight
      )
      if (top < 2 || Math.abs(window.scrollY - top) < 2) return
      window.scrollTo({ top, behavior: 'auto' })
    }

    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    if (!window.location.hash) {
      const current = saved()
      if (current) ReadingPlaces.persist(slug, current)
    }
    apply()
    const frame = requestAnimationFrame(apply)
    const timers = [0, 60, 240, 800].map(delay =>
      window.setTimeout(apply, delay)
    )
    window.addEventListener('load', apply)
    window.addEventListener('wheel', takeOver, { passive: true })
    window.addEventListener('touchstart', takeOver, { passive: true })
    window.addEventListener('keydown', takeOver)
    window.addEventListener('pointerdown', takeOver)
    window.addEventListener('hashchange', takeOver)

    return () => {
      cancelled = true
      stopRestore.current = () => {}
      window.history.scrollRestoration = previous
      cancelAnimationFrame(frame)
      for (const timer of timers) window.clearTimeout(timer)
      window.removeEventListener('load', apply)
      window.removeEventListener('wheel', takeOver)
      window.removeEventListener('touchstart', takeOver)
      window.removeEventListener('keydown', takeOver)
      window.removeEventListener('pointerdown', takeOver)
      window.removeEventListener('hashchange', takeOver)
    }
  }, [slug])

  useEffect(() => {
    let userMoved = false
    let writeTimer = 0
    if (window.location.hash) allowUntil.current = Date.now() + 1200

    const onScroll = () => {
      const headingsNow = measure(headingsRef.current)
      const next = ReadingPlaces.capture({
        headings: headingsNow,
        scrollY: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
        viewport: window.innerHeight,
        at: Date.now()
      })
      const prior = latest.current ?? ReadingPlaces.read()[slug] ?? null
      // A jump back to the top, with no wheel, key, or heading click, is the
      // browser resetting the page on the way out. Keep the place they were reading.
      const intentional = userMoved || Date.now() < allowUntil.current
      if (!intentional && prior && ReadingPlaces.isLayoutReset(prior, next))
        return
      userMoved = false
      latest.current = next
      window.clearTimeout(writeTimer)
      writeTimer = window.setTimeout(() => {
        if (latest.current) rememberRef.current(latest.current)
      }, 350)
    }

    const markUser = () => {
      userMoved = true
    }
    const onHash = () => {
      allowUntil.current = Date.now() + 1200
    }
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const href = target.closest('a')?.getAttribute('href')
      if (href && samePageHash(href)) allowUntil.current = Date.now() + 1200
    }
    const flush = () => {
      window.clearTimeout(writeTimer)
      if (latest.current) ReadingPlaces.persist(slug, latest.current)
      if (!signedInRef.current) return
      window.clearTimeout(syncTimer.current)
      void sendPlaces(ReadingPlaces.read())
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('wheel', markUser, { passive: true })
    window.addEventListener('touchmove', markUser, { passive: true })
    window.addEventListener('keydown', markUser)
    window.addEventListener('hashchange', onHash)
    document.addEventListener('click', onClick)
    window.addEventListener('pagehide', flush)
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    document.addEventListener('visibilitychange', onVisibility)
    if (signedInRef.current) scheduleSyncRef.current()

    return () => {
      window.clearTimeout(writeTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('wheel', markUser)
      window.removeEventListener('touchmove', markUser)
      window.removeEventListener('keydown', markUser)
      window.removeEventListener('hashchange', onHash)
      document.removeEventListener('click', onClick)
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVisibility)
      flush()
    }
  }, [slug])

  return {
    noteHeading(id: string) {
      allow()
      const view = measure(headingsRef.current)
      const heading = view.find(item => item.id === id)
      const at = Date.now()
      const next = heading
        ? ReadingPlaces.atHeading(
            id,
            heading.top,
            document.documentElement.scrollHeight,
            window.innerHeight,
            at
          )
        : ReadingPlaces.capture({
            headings: view,
            scrollY: window.scrollY,
            scrollHeight: document.documentElement.scrollHeight,
            viewport: window.innerHeight,
            at
          })
      remember(next)
    },
    noteTop() {
      allow()
      remember({ id: '', offset: 0, ratio: 0, at: Date.now() })
    }
  }
}

function sendPlaces(places: Record<string, ReadingPlace>) {
  if (Object.keys(places).length === 0) return Promise.resolve()
  return fetch('/api/reading-place', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ places }),
    keepalive: true,
    credentials: 'same-origin'
  }).catch(() => undefined)
}
