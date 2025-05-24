export const API_CONFIG = {
    BASE_URL: '/api',
    ENDPOINTS: {
        EVENTS: '/api/events',
        LOGIN: '/api/admin/login',
        SLOTS: '/api/admin/slots',
        EVENT_SLOTS: (eventId: string) => `/api/events/${eventId}/slots` as const,
        ADMIN: {
            EVENTS: '/api/admin/events',
        }
    },
    HEADERS: {
        JSON: { 'Content-Type': 'application/json' }
    }
} as const
