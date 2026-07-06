'use client'
import { useEffect, useRef } from 'react'
import s from './Contact.module.css'

const INFO = [
  { label: 'Телефон', value: '+1 000 000 0000', href: 'tel:+10000000000' },
  { label: 'Эл. почта', value: 'hello@woodatelier.com', href: 'mailto:hello@woodatelier.com' },
  { label: 'Студия', value: 'Нью-Йорк', href: null },
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const headRef    = useRef<HTMLHeadingElement>(null)
  const bodyRef    = useRef<HTMLParagraphElement>(null)
  const ctaRef     = useRef<HTMLAnchorElement>(null)
  const infoRefs   = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        const ctx = gsap.context(() => {
          const mobile = window.matchMedia('(max-width: 900px)').matches
          const sceneTrigger = mobile ? sectionRef.current : sectionRef.current?.parentElement
          // ── Whole-section entry crossfade ────────────────────────────────
          // Contact is the final section — only needs to dissolve IN from
          // FinalSection's video; there is nothing after it to fade out to.
          gsap.fromTo(sectionRef.current,
            { opacity: 0, scale: 0.985 },
            {
              opacity: 1, scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: sceneTrigger,
                start: mobile ? 'top 94%' : 'top -8%',
                end: mobile ? 'top 70%' : 'top -34%',
                scrub: 0.55,
              }
            }
          )

          gsap.from([headRef.current, bodyRef.current, ctaRef.current], {
            opacity: 0, y: 32,
            duration: 1.3, stagger: .18,
            ease: 'power2.out',
            scrollTrigger: { trigger: sceneTrigger, start: mobile ? 'top 80%' : 'top -28%' },
          })
          infoRefs.current.forEach((el, i) => {
            if (!el) return
            gsap.from(el, {
              opacity: 0, y: 24,
              duration: 1.1, ease: 'power2.out',
              scrollTrigger: { trigger: sceneTrigger, start: mobile ? 'top 76%' : 'top -28%' },
              delay: i * .12,
            })
          })
        }, sectionRef)
        return () => ctx.revert()
      })
    })
  }, [])

  return (
    <div className={s.scene} data-scroll-reading>
    <section ref={sectionRef} className={s.section} id="contact">
      <div className={s.inner}>
        {/* Left — headline + CTA */}
        <div className={s.left}>
          <p className={s.eyebrow}>Контакты</p>
          <h2 ref={headRef} className={s.headline}>
            Давайте обсудим<br />ваш проект
          </h2>
          <p ref={bodyRef} className={s.body}>
            Расскажите нам о своей идее, и мы предложим решение,
            которое раскроет характер вашего пространства.
          </p>
          <a ref={ctaRef} href="mailto:hello@woodatelier.com" className={s.cta}>
            Связаться с нами
            <span className={s.arrow} aria-hidden />
          </a>
        </div>

        {/* Right — contact info */}
        <div className={s.right}>
          {INFO.map((item, i) => (
            <div
              key={item.label}
              ref={el => { infoRefs.current[i] = el }}
              className={s.infoBlock}
            >
              <p className={s.infoLabel}>{item.label}</p>
              {item.href ? (
                <a href={item.href} className={s.infoValue}>{item.value}</a>
              ) : (
                <span className={s.infoValue}>{item.value}</span>
              )}
              {i < INFO.length - 1 && <div className={s.divider} />}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className={s.footer}>
        <span className={s.footerLogo}>MASSIV</span>
        <span className={s.footerCopy}>
          © {new Date().getFullYear()} — Мебель из массива дерева
        </span>
      </footer>
    </section>
    </div>
  )
}
