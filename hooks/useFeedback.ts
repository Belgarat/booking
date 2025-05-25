// hooks/useFeedback.ts
import { useState, useCallback, useMemo } from 'react'; // Importa useCallback e useMemo
import { FEEDBACK_CONFIG } from '@/config/feedback';

export type FeedbackVariant = typeof FEEDBACK_CONFIG.VARIANTS[keyof typeof FEEDBACK_CONFIG.VARIANTS];

export interface FeedbackMessageType {
    text: string;
    variant: FeedbackVariant;
}

export function useFeedback() {
    const [feedback, setFeedback] = useState<FeedbackMessageType | null>(null);

    // Stabilizza showFeedback con useCallback
    const showFeedback = useCallback((message?: FeedbackMessageType | null) => {
        if (message) {
            setFeedback(message);
            // Non pulire il feedback qui se vuoi che persista fino al prossimo trigger
            // O gestisci la pulizia esternamente / con un altro setTimeout specifico
            setTimeout(() => setFeedback(null), 5000); // Mantiene il tuo timeout attuale
        } else {
            setFeedback(null);
        }
    }, []); // showFeedback non dipende da alcuno stato o prop che cambi, quindi è stabile.

    // Stabilizza l'oggetto restituito dall'hook con useMemo
    return useMemo(() => ({
        feedback,
        showFeedback,
        clearFeedback: () => setFeedback(null) // clearFeedback è già stabile perché setFeedback è una funzione di React
    }), [feedback, showFeedback]); // L'oggetto restituito dipende da feedback (stato) e showFeedback (stabile)
}