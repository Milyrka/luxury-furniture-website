'use client'
import { useEffect, useRef } from 'react'
import s from './Hero.module.css'
import { useLenis } from '@/lib/useLenis'
import { createVideoScrollScrubber } from '@/lib/createVideoScrollScrubber'

const NAV = [
  { label: 'Двери',   href: '#production' },
  { label: 'Кухни',   href: '#craft' },
  { label: 'Шкафы',   href: '#projects' },
  { label: 'Ремесло', href: '#interior' },
]

export default function Hero() {
  useLenis()

  const sectionRef = useRef<HTMLElement>(null)
  const heroRef    = useRef<HTMLDivElement>(null)   // the pinned panel
  const videoRef   = useRef<HTMLVideoElement>(null)
  const hairlineRef= useRef<HTMLDivElement>(null)
  const navRef     = useRef<HTMLElement>(null)
  const ruleRef    = useRef<HTMLDivElement>(null)
  const h1Ref      = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const ctaRef     = useRef<HTMLAnchorElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cueRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const vid    = videoRef.current
    const wrap   = sectionRef.current
    const pinned = heroRef.current
    if (!vid || !wrap || !pinned) return

    let gsapCtx: any = null
    let scrubber: ReturnType<typeof createVideoScrollScrubber> | null = null

    const onMeta = () => {
      vid.currentTime = 0
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
            gsap.set([navRef.current, hairlineRef.current, ruleRef.current, h1Ref.current,
              subRef.current, ctaRef.current, cueRef.current, contentRef.current], {
              opacity: 1, x: 0, y: 0, scale: 1,
            })
            return
          }
          // ── Set initial states ────────────────────────────────────────────
          gsap.set([navRef.current, hairlineRef.current,
                    ruleRef.current, h1Ref.current,
                    subRef.current,  ctaRef.current, cueRef.current],
            { opacity: 0 })
          gsap.set(ruleRef.current, { scaleX: 0, transformOrigin: 'left center' })
          gsap.set(hairlineRef.current, { scaleX: 0, transformOrigin: 'left center' })
          gsap.set(vid, { scale: 1.1, transformOrigin: 'center center' })

          // ── Cinematic opening sequence ────────────────────────────────────
          const tl = gsap.timeline({ delay: 0.15 })
          tl.to(vid,             { scale: 1.0, duration: 4.2, ease: 'power1.inOut' }, 0)
            .to(hairlineRef.current, { opacity: 1, scaleX: 1, duration: 1.4, ease: 'power3.out' }, 0.6)
            .to(navRef.current,  { opacity: 1, duration: 1.6, ease: 'power2.out' }, 0.6)
            .to(ruleRef.current, { opacity: 1, scaleX: 1, duration: 1.1, ease: 'power3.out' }, 1.4)
            .fromTo(h1Ref.current,  { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.6, ease: 'power2.out' }, 1.7)
            .fromTo(subRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' }, 2.1)
            .fromTo(ctaRef.current, { opacity: 0, y:  8 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 2.5)
            .fromTo(cueRef.current, { opacity: 0 },        { opacity: 1, duration: 1.8, ease: 'power1.inOut' },     3.0)

          // Long take: coalesced frame seeking prevents decoder back-pressure.
          scrubber = createVideoScrollScrubber(vid)
          ScrollTrigger.create({
            trigger: wrap,
            start: 'top top',
            end: mobileFlow ? 'bottom top' : 'bottom bottom',
            invalidateOnRefresh: true,
            onUpdate: self => scrubber?.setProgress(self.progress),
            onRefresh: self => scrubber?.setProgress(self.progress),
          })


          // ── Content fades out as user scrolls away ─────────────────────
          gsap.to(contentRef.current, {
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top top',
              end: '48% top',
              scrub: 0.8,
            }
          })

          // Scroll cue fades immediately
          gsap.to(cueRef.current, {
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: wrap,
              start: 'top top',
              end: '8% top',
              scrub: 1,
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
    <section ref={sectionRef} className={s.heroWrap} id="hero">
      <div ref={heroRef} className={s.hero}>
        <video
          ref={videoRef}
          className={s.video}
          src="/videos/hero.mp4"
          muted playsInline preload="auto"
        />
        <div className={s.gradTop} aria-hidden />
        <div className={s.gradBot} aria-hidden />
        <div className={s.grain}   aria-hidden />

        <div ref={hairlineRef} className={s.hairline} aria-hidden />

        <nav ref={navRef} className={s.nav}>
          <a href="/" className={s.logo}>
            MASSIV<span className={s.logoBar} aria-hidden />МЕБЕЛЬ
          </a>
          <ul className={s.navLinks}>
            {NAV.map(n => <li key={n.href}><a href={n.href}>{n.label}</a></li>)}
          </ul>
          <a href="#contact" className={s.pillBtn}>
            <span className={s.dot} aria-hidden />Контакты
          </a>
        </nav>

        <div className={s.content}>
          <div ref={contentRef} className={s.inner}>
            <div ref={ruleRef} className={s.rule} />
            <h1 ref={h1Ref} className={s.headline}>
              Массив дерева,<br />созданный <em>на века</em>
            </h1>
            <p ref={subRef} className={s.sub}>
              Кухни, двери и гардеробные — современное производство
              с точностью ручной работы.
            </p>
            <a ref={ctaRef} href="#contact" className={s.cta}>
              Обсудить проект
              <span className={s.arrow} aria-hidden />
            </a>
          </div>
        </div>

        <div ref={cueRef} className={s.scrollCue}>
          <div className={s.scrollLine} />
          <span className={s.scrollText}>Листайте</span>
        </div>
      </div>
    </section>
  )
}
