'use client'
import VideoBlock from '@/components/VideoBlock/VideoBlock'

export default function InteriorJourney() {
  return (
    <VideoBlock
      id="interior"
      zIndex={4}
      src="/videos/interior.mp4"
      eyebrow="Интерьер"
      displayWord="ДЕТАЛИ"
      headline="Интерьер начинается с детали"
      body="Двери, кухни и гардеробные складываются в единое архитектурное пространство — интерьер, где каждый элемент звучит как часть целого."
    />
  )
}
