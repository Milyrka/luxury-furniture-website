'use client'
import VideoBlock from '@/components/VideoBlock/VideoBlock'

export default function Production() {
  return (
    <VideoBlock
      id="production"
      zIndex={2}
      src="/videos/production.mp4"
      eyebrow="Производство"
      displayWord="ДВЕРИ"
      headline="Современное производство"
      body="Высокоточное оборудование создаёт безупречную геометрию каждой детали. Автоматизация обеспечивает точность, а итоговое качество мы всегда проверяем вручную."
      pills={['Точная обработка', 'Массив дерева', 'Контроль качества']}
    />
  )
}
