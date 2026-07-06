import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MASSIV — мебель из массива дерева',
  description: 'Кухни, двери и гардеробные из массива дерева, созданные на века.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
