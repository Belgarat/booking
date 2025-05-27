// components/common/FullScreenSpinner.tsx
'use client'

import Image from 'next/image'

type Props = {
  text?: string
}

export default function FullScreenSpinner({ text = 'Caricamento...' }: Props) {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-black/80 z-50 flex flex-col items-center justify-center space-y-4">
      <Image
        src="/Logo-a-colori-1k.webp" // metti il file in `public/Logo-a-colori-1k.webp`
        alt="Loading"
        width={64}
        height={64}
        priority
      />
      <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{text}</p>
    </div>
  )
}
