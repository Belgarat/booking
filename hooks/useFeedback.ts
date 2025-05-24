import { useState } from 'react'
import { FEEDBACK_CONFIG } from '@/config/feedback'

export type FeedbackVariant = typeof FEEDBACK_CONFIG.VARIANTS[keyof typeof FEEDBACK_CONFIG.VARIANTS]

export interface FeedbackMessageType {
    text: string
    variant: FeedbackVariant
}

export function useFeedback() {
    const [feedback, setFeedback] = useState<FeedbackMessageType | null>(null)

    const showFeedback = (message: FeedbackMessageType) => {
        setFeedback(message)
        setTimeout(() => setFeedback(null), 5000)
    }

    return {
        feedback,
        showFeedback,
        clearFeedback: () => setFeedback(null)
    }
}
