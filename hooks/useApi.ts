// hooks/useApi.ts
import { useCallback, useMemo } from 'react'; // Importa useCallback e useMemo
import { API_CONFIG } from '@/config/api';
import { FeedbackMessageType } from './useFeedback';

export function useApi(password: string, onFeedback: (msg: FeedbackMessageType) => void) {

    // Memorizza l'oggetto headers. Si ricrea solo se 'password' cambia.
    const headers = useMemo(() => ({
        ...API_CONFIG.HEADERS.JSON,
        ...(password && { authorization: password })
    }), [password]); // Dipende solo da password

    // handleResponse è una funzione interna, può essere definita qui senza useCallback
    // poiché viene chiamata solo all'interno di makeRequest.
    // L'unica sua dipendenza è 'onFeedback', che deve essere stabile.
    const handleResponse = async (response: Response) => {
        // La logica originale del feedback di successo qui non c'è,
        // quindi non faremo onFeedback qui se non specificato.
        // Se vuoi aggiungere un feedback di successo qui, devi passare
        // il messaggio di successo a makeRequest e poi a handleResponse.
        return response;
    };

    // Stabilizza makeRequest con useCallback.
    // makeRequest dipende da 'headers' (che è stabile) e da 'onFeedback' (che deve essere stabile).
    const makeRequest = useCallback(async (endpoint: string, options: RequestInit = {}) => {
        const response = await fetch(endpoint, {
            ...options,
            headers: { ...headers, ...options.headers }
        });
        return handleResponse(response);
    }, [headers, onFeedback]); // makeRequest si ricrea solo se headers o onFeedback cambiano

    // Memorizza l'oggetto restituito dall'hook. Si ricrea solo se 'makeRequest' cambia.
    return useMemo(() => ({
        makeRequest,
    }), [makeRequest]); // L'oggetto 'api' restituito è stabile finché makeRequest è stabile
}