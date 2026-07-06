'use client'
import { useEffect } from 'react'

let initialized = false
let readingZoneActive = false
const activeReadingZones = new Set<Element>()

export function useLenis() {
  useEffect(() => {
    if (initialized) return
    initialized = true

    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 0.95,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
        infinite: false,
        virtualScroll: (event: any) => {
          if (readingZoneActive && event.event?.type === 'wheel') {
            // A light local pause for the photo gallery only. The rest of the
            // site keeps the normal wheel speed.
            event.deltaY *= 0.68
          }
          return true
        },
      })

      const readingZones = Array.from(document.querySelectorAll('[data-scroll-reading="photos"]'))
      const readingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.15) activeReadingZones.add(entry.target)
          else activeReadingZones.delete(entry.target)
        })
        readingZoneActive = activeReadingZones.size > 0
      }, { threshold: [0.08, 0.15, 0.35] })
      readingZones.forEach(zone => readingObserver.observe(zone))

      // Single RAF loop via GSAP ticker — prevents double-update stutter
      import('gsap').then(({ gsap }) => {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          gsap.registerPlugin(ScrollTrigger)

          // Lenis drives native scroll; ScrollTrigger reads native scroll
          lenis.on('scroll', ScrollTrigger.update)
          gsap.ticker.add((time) => { lenis.raf(time * 1000) })
          gsap.ticker.lagSmoothing(500, 33)

          // Recalculate pin positions after Lenis alters layout
          ScrollTrigger.refresh()
        })
      })
    })
  }, [])
}
