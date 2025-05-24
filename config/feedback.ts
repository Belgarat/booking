export const FEEDBACK_CONFIG = {
    VARIANTS: {
        SUCCESS: 'success',
        ERROR: 'error',
        INFO: 'info',
        WARNING: 'warning'
    } as const,
    MESSAGES: {
        ERROR: {
            LOGIN: { text: 'Password errata', variant: 'error' },
            CREATE_EVENT: { text: 'Errore nella creazione dell\'evento: ', variant: 'error' },
            GENERIC: { text: 'Si è verificato un errore', variant: 'error' }
        },
        SUCCESS: {
            EVENT_UPDATED: { text: 'Evento aggiornato', variant: 'success' },
            EVENT_CREATED: { text: 'Evento creato', variant: 'success' },
            EVENT_DELETED: { text: 'Evento eliminato', variant: 'success' },
            SLOT_ADDED: { text: 'Slot aggiunto', variant: 'success' },
            SLOT_DELETED: { text: 'Slot eliminato', variant: 'success' }
        },
        INFO: {
            SELECT_EVENT: { text: 'Seleziona un evento per gestire gli slot.', variant: 'info' }
        },
        WARNING: {
            UNSAVED_CHANGES: { text: 'Ci sono modifiche non salvate.', variant: 'warning' }
        }
    }
} as const
