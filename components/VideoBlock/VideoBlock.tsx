'use client'
import { useEffect, useRef } from 'react'
import s from './VideoBlock.module.css'
import { createVideoScrollScrubber } from '@/lib/createVideoScrollScrubber'

interface Props {
  src: string
  id?: string
  eyebrow?: string
  headline: string
  body?: string
  pills?: string[]
  children?: React.ReactNode
  zIndex?: number
  displayWord?: string
}

export default function VideoBlock({
  src, id, eyebrow, headline, body, pills, children, zIndex = 1, displayWord
}: Props) {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const pinnedRef  = useRef<HTMLDivElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)
  const headRef    = useRef<HTMLHeadingElement>(null)
  const bodyRef    = useRef<HTMLParagraphElement>(null)
  const eyeRef     = useRef<HTMLParagraphElement>(null)
  const pillsRef   = useRef<HTMLDivElement>(null)
  const displayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const vid    = videoRef.current
    const wrap   = wrapRef.current
    const pinned = pinnedRef.current
    if (!vid || !wrap || !pinned) return

    let gsapCtx: any = null
    let scrubber: ReturnType<typeof createVideoScrollScrubber> | null = null

    // Force first frame to render — prevents black screen on paused video
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
            gsap.set([eyeRef.current, headRef.current, bodyRef.current, pillsRef.current, displayRef.current], {
              opacity: 1, y: 0,
            })
            return
          }

          // Long take: one decoded seek at a time; stale intermediate frames are dropped.
          scrubber = createVideoScrollScrubber(vid)
          ScrollTrigger.create({
            trigger: wrap,
            start: mobileFlow ? 'top bottom' : 'top top',
            end: mobileFlow ? 'bottom top' : 'bottom bottom',
            invalidateOnRefresh: true,
            onUpdate: self => scrubber?.setProgress(self.progress),
            onRefresh: self => scrubber?.setProgress(self.progress),
          })

          // Split-line rise: copy arrives before the chapter fully pins.
          const reveal = gsap.timeline({
            scrollTrigger: {
              trigger: wrap,
              start: 'top 94%',
              end: 'top 28%',
              scrub: 0.5,
            },
          })
          if (eyeRef.current) reveal.fromTo(eyeRef.current,
            { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' }, 0)
          reveal.fromTo(headRef.current,
            { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.08)
          if (bodyRef.current) reveal.fromTo(bodyRef.current,
            { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.3)
          if (pillsRef.current) reveal.fromTo(Array.from(pillsRef.current.children),
            { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }, 0.42)
          if (displayRef.current) reveal.fromTo(displayRef.current,
            { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.05)

          // Short portal reveal: the new scene opens inside the previous frame.
          gsap.fromTo(pinned,
            { opacity: 0, scale: 0.94, clipPath: 'inset(8% 5% 8% 5% round 24px)' },
            {
              opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 0px)',
              ease: 'none',
              scrollTrigger: {
                trigger: wrap,
                start: mobileFlow ? 'top 94%' : 'top top',
                end: mobileFlow ? 'top 70%' : 'top -18%',
                scrub: 0.35,
              }
            }
          )

          // ── Subtle scale breathe (no yPercent — avoids black borders) ───
          gsap.fromTo(vid,
            { scale: 1.04 },
            {
              scale: 1.0,
              ease: 'none',
              scrollTrigger: {
                trigger: wrap,
                start: 'top top',
                end: '40% top',
                scrub: 0.8,
              }
            }
          )

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
    <div ref={wrapRef} className={s.sectionWrap} id={id} style={{ zIndex }}>
      <div ref={pinnedRef} className={s.pinned}>
        <video
          ref={videoRef}
          className={s.video}
          src={src}
          muted
          playsInline
          preload="auto"
        />
        <div className={s.gradTop} aria-hidden />
        <div className={s.gradBot} aria-hidden />
        <div className={s.grain}   aria-hidden />

        <div className={s.content}>
          <div>
            {eyebrow && <p ref={eyeRef} className={s.eyebrow}>{eyebrow}</p>}
            <h2 ref={headRef} className={s.headline}>{headline}</h2>
            {body && <p ref={bodyRef} className={s.body}>{body}</p>}
            {pills && pills.length > 0 && (
              <div ref={pillsRef} className={s.pills}>
                {pills.map(p => <span key={p} className={s.pill}>{p}</span>)}
              </div>
            )}
            {children}
          </div>
        </div>

        {displayWord && (
          <div ref={displayRef} className={s.displayWord} aria-hidden>
            {displayWord}
          </div>
        )}
      </div>
    </div>
  )
}
