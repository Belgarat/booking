'use client'

import Link from 'next/link'
import Image from 'next/image'

type Props = {
    text: string
    href: string
    title?: string
    showIcon?: boolean
    target?: '_blank' | '_self'
}

export default function DragonButton({
                                         text,
                                         href,
                                         title = 'Scopri di più',
                                         showIcon = true,
                                         target = '_self',
                                     }: Props) {
    return (
        <Link
            href={href}
            target={target}
            title={title}
            className="group inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium border text-white bg-primary rounded-lg shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 dark:bg-primary dark:hover:bg-orange-600"
        >
      <span className="group-hover:text-white transition-colors duration-200">
        {text}
      </span>

            {showIcon && (
                <Image
                    src="/images/dragon.svg"
                    alt="Dragon icon"
                    width={20}
                    height={20}
                    className="transition-transform duration-200 group-hover:scale-110"
                />
            )}
        </Link>
    )
}
