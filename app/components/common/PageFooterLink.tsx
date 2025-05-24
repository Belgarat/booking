type Props = {
    href: string
    children: React.ReactNode
}

export default function PageFooterLink({ href, children }: Props) {
    return (
        <div className="text-right mt-8">
            <a
                href={href}
                target="_blank"
                className="text-primary dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-sm underline"
            >
                {children}
            </a>
        </div>
    )
}
