import { API_CONFIG } from '@/config/api'
import { FeedbackMessageType } from './useFeedback'

export function useApi(password: string, onFeedback: (msg: FeedbackMessageType) => void) {
    const headers = {
        ...API_CONFIG.HEADERS.JSON,
        ...(password && { authorization: password })
    }

    const handleResponse = async (response: Response, successMessage?: FeedbackMessageType) => {
        if (response.ok && successMessage) {
            onFeedback(successMessage)
        }
        return response
    }

    return {
        async makeRequest(endpoint: string, options: RequestInit = {}) {
            const response = await fetch(endpoint, {
                ...options,
                headers: { ...headers, ...options.headers }
            })
            return handleResponse(response)
        }
    }
}
