'use client'
import { useEffect, useRef } from 'react'
import s from './Philosophy.module.css'

const VALUES = [
  { num: '100%', label: 'Массив дерева' },
  { num: '15+',  label: 'Лет мастерства' },
  { num: '500+', label: 'Готовых проектов' },
  { num: '∞',    label: 'Уникальных форм' },
]

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null)
  const h2Ref      = useRef<HTMLHeadingElement>(null)
  const body1Ref   = useRef<HTMLParagraphElement>(null)
  const body2Ref   = useRef<HTMLParagraphElement>(null)
  const divRef     = useRef<HTMLDivElement>(null)
  const valRefs    = useRef<(HTMLDivElement|null)[]>([])
  const eyeRef     = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    import('gsap').then(({ gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger)
        const ctx = gsap.context(() => {
          const mobile = window.matchMedia('(max-width: 900px)').matches
          const sceneTrigger = mobile ? sectionRef.current : sectionRef.current?.parentElement
          // ── Entry fade — dissolves in as Hero exits ──────────────────
          // No exit fade here: Philosophy is sandwiched between two GSAP-
          // pinned video sections. The next section (Production) handles
          // its own entry via crossfade, so Philosophy simply needs to be
          // visible while in view — fading it out early created black gaps.
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

          // Eyebrow — first, quieter
          gsap.fromTo(eyeRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1.2, ease: 'power1.out',
              scrollTrigger: { trigger: sceneTrigger, start: mobile ? 'top 88%' : 'top -28%' } }
          )

          // Headline — no y movement, pure opacity + very slight drift
          gsap.fromTo(h2Ref.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1.6, ease: 'power2.out',
              scrollTrigger: { trigger: sceneTrigger, start: mobile ? 'top 84%' : 'top -28%' } }
          )

          // Body paragraphs — stagger, very gentle
          gsap.fromTo([body1Ref.current, body2Ref.current],
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 1.4, stagger: 0.2, ease: 'power2.out',
              scrollTrigger: { trigger: sceneTrigger, start: mobile ? 'top 80%' : 'top -28%' } }
          )

          // Divider — draws left to right
          gsap.fromTo(divRef.current,
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 1.6, ease: 'power2.inOut',
              scrollTrigger: { trigger: sceneTrigger, start: mobile ? 'top 76%' : 'top -28%' } }
          )

          // Values — stagger in with opacity + minimal drift
          valRefs.current.forEach((el, i) => {
            if (!el) return
            gsap.fromTo(el,
              { opacity: 0, y: 16 },
              { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out',
                scrollTrigger: { trigger: sceneTrigger, start: mobile ? 'top 74%' : 'top -28%' },
                delay: i * 0.09,
              }
            )
          })
        }, sectionRef)
        return () => ctx.revert()
      })
    })
  }, [])

  return (
    <div className={s.scene} data-scroll-reading>
    <section ref={sectionRef} className={s.section} id="philosophy">
      <div className={s.inner}>
        <div className={s.left}>
          <p ref={eyeRef} className={s.eyebrow}>Философия</p>
          <h2 ref={h2Ref} className={s.headline}>
            Дерево — не просто материал.<br />
            <em>Это характер дома.</em>
          </h2>
        </div>
        <div className={s.right}>
          <p ref={body1Ref} className={s.body}>
            Мы работаем только с массивом, сохраняя естественную красоту
            дерева и превращая его в архитектурные элементы, созданные
            служить десятилетиями.
          </p>
          <p ref={body2Ref} className={s.body}>
            Каждое изделие рождается из внимания к деталям: современные
            технологии обеспечивают точность, а опыт мастеров — безупречное
            качество.
          </p>
          <div ref={divRef} className={s.divider} />
          <div className={s.values}>
            {VALUES.map((v, i) => (
              <div key={v.label} ref={el => { valRefs.current[i] = el }} className={s.value}>
                <p className={s.valueNum}>{v.num}</p>
                <p className={s.valueLabel}>{v.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </div>
  )
}
