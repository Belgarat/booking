'use client'

import { useEffect, type ReactNode } from 'react'
import {
    XMarkIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/solid'

export type Variant = 'success' | 'error' | 'info' | 'warning'

type ModalProps = {
    isOpen: boolean
    onClose: () => void
    title?: string
    variant?: Variant
    children: ReactNode
    wide?: boolean
}

const variantStyles: Record<Variant, string> = {
    success: 'text-green-600',
    error: 'text-red-600',
    info: 'text-blue-600',
    warning: 'text-yellow-600',
}

const variantIcons: Record<Variant, ReactNode> = {
    success: <CheckCircleIcon className="w-6 h-6 text-green-600" />,
    error: <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />,
    info: <InformationCircleIcon className="w-6 h-6 text-blue-600" />,
    warning: <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />,
}

export default function Modal({
                                  isOpen,
                                  onClose,
                                  title,
                                  variant = 'info',
                                  children,
                                  wide = false,
                              }: ModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown)
        }
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
            <div
                className={`bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 ${
                    wide ? 'max-w-4xl' : 'max-w-md'
                }`}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                    aria-label="Chiudi modale"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>

                {/* Title and icon */}
                <div className="flex items-center space-x-3">
                    {variantIcons[variant]}
                    {title && <h2 className={`text-lg font-semibold ${variantStyles[variant]}`}>{title}</h2>}
                </div>

                {/* Content */}
                <div className="text-gray-700 dark:text-gray-200 text-sm">
                    {children}
                </div>

                {/* Footer */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mt-4 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
                    >
                        Chiudi
                    </button>
                </div>
            </div>
        </div>
    )
}
