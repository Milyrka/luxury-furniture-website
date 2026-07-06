'use client'
import VideoBlock from '@/components/VideoBlock/VideoBlock'

export default function Craftsmanship() {
  return (
    <VideoBlock
      id="craft"
      zIndex={3}
      src="/videos/craft.mp4"
      eyebrow="Мастерство"
      displayWord="КУХНИ"
      headline="Мастерство в каждой детали"
      body="Каждую поверхность мы проверяем вручную. Изучаем рисунок древесины, соединения и мельчайшие детали, чтобы изделие выглядело безупречно сегодня и спустя десятилетия."
    />
  )
}
