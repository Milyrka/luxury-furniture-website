'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import s from './Projects.module.css'

// Each card: real photo + card identity
// Images hosted in /public/images/ — order matches the editorial grid:
// card 0 = large left = Kitchens, card 1 = top-right = Doors, card 2 = bottom-right = Wardrobes
const CARDS = [
  { num: '01', title: 'Кухни из массива', img: '/images/kitchen.png', alt: 'Кухня из массива тёмного ореха с каменным островом' },
  { num: '02', title: 'Межкомнатные двери', img: '/images/door.png', alt: 'Межкомнатная дверь из массива ореха с латунной ручкой' },
  { num: '03', title: 'Шкафы и гардеробные', img: '/images/wardrobe.png', alt: 'Гардеробная из тёмного ореха со встроенной подсветкой' },
]

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef    = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const eyeRef     = useRef<HTMLParagraphElement>(null)
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([])
  const imgRefs    = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        const ctx = gsap.context(() => {
          // Photo Ken Burns — subtle scale on scroll
          imgRefs.current.forEach(img => {
            if (!img) return
            gsap.fromTo(img,
              { scale: 1.1 },
              {
                scale: 1.0, ease: 'none',
                scrollTrigger: {
                  trigger: img,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 1.4,
                }
              }
            )
          })

        }, sectionRef)
        return () => ctx.revert()
      })
    })
  }, [])

  return (
    <div className={s.scene} data-scroll-reading="photos">
    <section ref={sectionRef} className={s.section} id="projects">
      <div className={s.header}>
        <div>
          <p ref={eyeRef} className={s.eyebrow}>Проекты</p>
          <h2 ref={headRef} className={s.headline}>Реализованные проекты</h2>
        </div>
        <p ref={subRef} className={s.sub}>
          Интерьеры для частных домов, квартир и коммерческих пространств.
        </p>
      </div>

      <div className={s.grid}>
        {CARDS.map((c, i) => (
          <div key={c.num} ref={el => { cardRefs.current[i] = el }} className={s.card}>
            {/* Photo layer — clips the Ken Burns zoom via overflow:hidden on .card */}
            <div ref={el => { imgRefs.current[i] = el }} className={s.cardImg}>
              <Image
                src={c.img}
                alt={c.alt}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority={i === 0}
              />
            </div>

            {/* Dark luxury tint overlay — matches editorial mood */}
            <div className={s.cardTint} aria-hidden />

            {/* Label */}
            <div className={s.cardLabel}>
              <p className={s.cardNum}>{c.num}</p>
              <p className={s.cardTitle}>{c.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
    </div>
  )
}
