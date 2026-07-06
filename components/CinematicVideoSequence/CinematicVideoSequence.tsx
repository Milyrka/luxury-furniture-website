'use client'

import { useEffect, useRef } from 'react'
import { createVideoScrollScrubber } from '@/lib/createVideoScrollScrubber'
import s from './CinematicVideoSequence.module.css'

const CHAPTERS = [
  {
    id: 'production', src: '/videos/production.mp4', eyebrow: 'Производство', word: 'ДВЕРИ',
    title: 'Современное производство',
    body: 'Высокоточное оборудование создаёт безупречную геометрию каждой детали. Автоматизация обеспечивает точность, а итоговое качество мы всегда проверяем вручную.',
    pills: ['Точная обработка', 'Массив дерева', 'Контроль качества'],
  },
  {
    id: 'craft', src: '/videos/craft.mp4', eyebrow: 'Мастерство', word: 'КУХНИ',
    title: 'Мастерство в каждой детали',
    body: 'Каждую поверхность мы проверяем вручную. Изучаем рисунок древесины, соединения и мельчайшие детали, чтобы изделие выглядело безупречно сегодня и спустя десятилетия.',
  },
  {
    id: 'interior', src: '/videos/interior.mp4', eyebrow: 'Интерьер', word: 'ДЕТАЛИ',
    title: 'Интерьер начинается с детали',
    body: 'Двери, кухни и гардеробные складываются в единое архитектурное пространство — интерьер, где каждый элемент звучит как часть целого.',
  },
]

const PLAY = 1
const DISSOLVE = 0.12
const STARTS = [0, PLAY + DISSOLVE, (PLAY + DISSOLVE) * 2]
const TOTAL = PLAY * 3 + DISSOLVE * 2
const clamp = (v: number) => Math.max(0, Math.min(1, v))

export default function CinematicVideoSequence() {
  const wrapRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    let ctx: any
    const scrubbers = videoRefs.current.map(video => video ? createVideoScrollScrubber(video) : null)

    videoRefs.current.forEach(video => {
      if (!video) return
      video.muted = true
      video.pause()
      if (video.readyState >= 1) video.currentTime = 0
      else video.addEventListener('loadedmetadata', () => { video.currentTime = 0; video.pause() }, { once: true })
    })

    import('gsap').then(({ gsap }) => import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger)
      ctx = gsap.context(() => {
        gsap.fromTo(stageRef.current, { opacity: 0, scale: 0.985 }, {
          opacity: 1,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top top', end: 'top -18%', scrub: 0.35 },
        })
        gsap.set(layerRefs.current, { opacity: 0 })
        gsap.set(layerRefs.current[0], { opacity: 1 })

        ScrollTrigger.create({
          trigger: wrap,
          start: 'top top',
          end: 'bottom bottom',
          invalidateOnRefresh: true,
          onUpdate: self => {
            const phase = self.progress * TOTAL

            STARTS.forEach((start, index) => {
              // Each movie owns a complete PLAY interval: 0 → 100%.
              scrubbers[index]?.setProgress(clamp((phase - start) / PLAY))
            })

            let opacity0 = 1
            let opacity1 = 0
            let opacity2 = 0
            if (phase >= 1 && phase < 1 + DISSOLVE) {
              const mix = clamp((phase - 1) / DISSOLVE)
              opacity0 = 1 - mix; opacity1 = mix
            } else if (phase >= 1 + DISSOLVE && phase < 2 + DISSOLVE) {
              opacity0 = 0; opacity1 = 1
            } else if (phase >= 2 + DISSOLVE && phase < 2 + DISSOLVE * 2) {
              const mix = clamp((phase - (2 + DISSOLVE)) / DISSOLVE)
              opacity0 = 0; opacity1 = 1 - mix; opacity2 = mix
            } else if (phase >= 2 + DISSOLVE * 2) {
              opacity0 = 0; opacity1 = 0; opacity2 = 1
            }
            gsap.set(layerRefs.current[0], { opacity: opacity0 })
            gsap.set(layerRefs.current[1], { opacity: opacity1 })
            gsap.set(layerRefs.current[2], { opacity: opacity2 })
          },
          onRefresh: self => self.update(),
        })
      }, wrap)
    }))

    return () => {
      scrubbers.forEach(scrubber => scrubber?.destroy())
      ctx?.revert()
    }
  }, [])

  return (
    <section ref={wrapRef} className={s.sequence} aria-label="Производство и мастерство">
      <div ref={stageRef} className={s.stage}>
        {CHAPTERS.map((chapter, index) => (
          <div
            key={chapter.id}
            id={chapter.id}
            ref={node => { layerRefs.current[index] = node }}
            className={s.layer}
          >
            <video
              ref={node => { videoRefs.current[index] = node }}
              className={s.video}
              src={chapter.src}
              muted playsInline preload="auto"
            />
            <div className={s.shade} aria-hidden />
            <div className={s.content}>
              <p className={s.eyebrow}>{chapter.eyebrow}</p>
              <h2 className={s.title}>{chapter.title}</h2>
              <p className={s.body}>{chapter.body}</p>
              {chapter.pills && <div className={s.pills}>{chapter.pills.map(pill => <span key={pill}>{pill}</span>)}</div>}
            </div>
            <div className={s.word} aria-hidden>{chapter.word}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
