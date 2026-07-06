'use client'
import { useEffect, useRef } from 'react'
import s from './FinalSection.module.css'
import { createVideoScrollScrubber } from '@/lib/createVideoScrollScrubber'

export default function FinalSection() {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const pinnedRef = useRef<HTMLDivElement>(null)
  const videoRef  = useRef<HTMLVideoElement>(null)
  const ruleRef   = useRef<HTMLDivElement>(null)
  const headRef   = useRef<HTMLHeadingElement>(null)
  const ctaRef    = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const vid    = videoRef.current
    const wrap   = wrapRef.current
    const pinned = pinnedRef.current
    if (!vid || !wrap || !pinned) return

    let gsapCtx: any = null
    let scrubber: ReturnType<typeof createVideoScrollScrubber> | null = null

    const onMeta = () => {
      vid.currentTime = 0
      vid.pause()
    }
    if (vid.readyState >= 1) onMeta()
    else vid.addEventListener('loadedmetadata', onMeta, { once: true })

    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)

        gsapCtx = gsap.context(() => {
          const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          const mobileFlow = window.matchMedia('(max-width: 768px)').matches
          if (reduceMotion) {
            gsap.set([ruleRef.current, headRef.current, ctaRef.current], { opacity: 1, y: 0, scaleY: 1 })
            return
          }

          scrubber = createVideoScrollScrubber(vid)
          ScrollTrigger.create({
            trigger: wrap,
            start: mobileFlow ? 'top bottom' : 'top top',
            end: mobileFlow ? 'bottom top' : 'bottom bottom',
            invalidateOnRefresh: true,
            onUpdate: self => scrubber?.setProgress(self.progress),
            onRefresh: self => scrubber?.setProgress(self.progress),
          })

          // Crane reveal: the closing message rises before the final frame pins.
          const reveal = gsap.timeline({
            scrollTrigger: { trigger: wrap, start: 'top 94%', end: 'top 28%', scrub: 0.5 },
          })
          reveal.fromTo(ruleRef.current,
            { scaleY: 0, opacity: 0, transformOrigin: 'top center' },
            { scaleY: 1, opacity: 1, duration: 0.35, ease: 'power2.inOut' }, 0)
            .fromTo(headRef.current,
              { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.12)
            .fromTo(ctaRef.current,
              { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.35)
          gsap.set(vid, { scale: 1.06, transformOrigin: 'center center' })

          // Scale breathe — no yPercent
          gsap.to(vid, {
            scale: 1.0, ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top top',
              end: '35% top',
              scrub: 0.8,
            }
          })

        }, wrap)
      })
    })

    return () => {
      vid.removeEventListener('loadedmetadata', onMeta)
      scrubber?.destroy()
      if (gsapCtx) gsapCtx.revert()
    }
  }, [])

  return (
    <div ref={wrapRef} className={s.sectionWrap}>
      <div ref={pinnedRef} className={s.pinned}>
        <video
          ref={videoRef}
          className={s.video}
          src="/videos/final.mp4"
          muted playsInline preload="auto"
        />
        <div className={s.overlay} aria-hidden />
        <div className={s.grain}   aria-hidden />
        <div className={s.content}>
          <div ref={ruleRef} className={s.rule} aria-hidden />
          <h2 ref={headRef} className={s.headline}>
            Создаём интерьеры из массива,<br />которые служат десятилетиями.
          </h2>
          <a ref={ctaRef} href="#contact" className={s.cta}>
            Обсудить проект
            <span className={s.arrow} aria-hidden />
          </a>
        </div>
      </div>
    </div>
  )
}
