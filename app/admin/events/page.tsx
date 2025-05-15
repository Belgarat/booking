'use client'

import { useEffect, useState } from 'react'

type Event = {
    id: string
    title: string
    description?: string
    created_at: string
}

export default function AdminEventListPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events')
                if (!res.ok) throw new Error('Errore nel recupero eventi')
                const data = await res.json()
                setEvents(data)
            } catch (err: any) {
                setError(err.message || 'Errore sconosciuto')
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [])

    if (loading) return <div className="p-6">Caricamento eventi...</div>
    if (error) return <div className="p-6 text-red-600">{error}</div>

    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Lista Eventi</h1>

            <ul className="space-y-4">
                {events.map(event => (
                    <li key={event.id} className="border p-4 rounded shadow">
                        <h2 className="text-lg font-semibold">{event.title}</h2>
                        <p className="text-sm text-gray-600">ID: {event.id}</p>
                        <p className="text-sm text-gray-500">Creato il: {new Date(event.created_at).toLocaleString()}</p>
                        <a
                            href={`/event/${event.id}`}
                            target="_blank"
                            className="text-blue-600 underline text-sm mt-2 inline-block"
                        >
                            Vai alla pagina evento →
                        </a>
                    </li>
                ))}
            </ul>
        </main>
    )
}
