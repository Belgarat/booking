// hooks/useLoaderFetch.ts
import { useState } from 'react'

export function useLoaderFetch<T = any>() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<T | null>(null)

    const fetchData = async (url: string, options?: RequestInit) => {
        setLoading(true)
        setError(null)
        setData(null)

        try {
            const res = await fetch(url, options)
            const json = await res.json()

            if (!res.ok) throw new Error(json.error || 'Errore generico')

            setData(json)
            return json
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Errore sconosciuto')
            return null
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, data, fetchData }
}
