'use client'
import dynamic from 'next/dynamic'

const Hero           = dynamic(() => import('@/components/Hero/Hero'),                   { ssr: false })
const Philosophy     = dynamic(() => import('@/components/Philosophy/Philosophy'),       { ssr: false })
const CinematicVideoSequence = dynamic(() => import('@/components/CinematicVideoSequence/CinematicVideoSequence'), { ssr: false })
const Projects       = dynamic(() => import('@/components/Projects/Projects'),           { ssr: false })
const FinalSection   = dynamic(() => import('@/components/FinalSection/FinalSection'),   { ssr: false })
const Contact        = dynamic(() => import('@/components/Contact/Contact'),             { ssr: false })

export default function Page() {
  return (
    <main>
      <Hero />
      <Philosophy />
      <CinematicVideoSequence />
      <Projects />
      <FinalSection />
      <Contact />
    </main>
  )
}
