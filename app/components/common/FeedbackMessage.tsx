// components/ui/FeedbackMessage.tsx
type Variant = 'error' | 'success' | 'warning' | 'info'

type Props = {
    message: string
    variant?: Variant
}

const styles: Record<Variant, string> = {
    error: 'text-red-600 bg-red-50 border border-red-200',
    success: 'text-green-600 bg-green-50 border border-green-200',
    warning: 'text-yellow-800 bg-yellow-50 border border-yellow-200',
    info: 'text-blue-600 bg-blue-50 border border-blue-200',
}

export default function FeedbackMessage({ message, variant = 'info' }: Props) {
    return (
        <div className={`p-4 rounded-md text-sm ${styles[variant]}`}>
            {message}
        </div>
    )
}
