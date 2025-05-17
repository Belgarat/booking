'use client'

import { useEffect, useState } from 'react'
import Loader from "@/app/components/Loader";


type Event = {
    id: string
    title: string
    description?: string
    location?: string
    image_url?: string
    website_url?: string
    max_people_per_slot: number
    created_at: string
    totalMax: number       // totale iscritti
    totalBooked: number          // capacità massima totale (slot * max_people_per_slot)
    remaining: number    // max - booked
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
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
                setError(errorMessage);
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [])

    if (loading) return <Loader />
    if (error) return <div className="p-6 text-red-600">{error}</div>

    return (
        <main className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">📋 Lista Eventi</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="rounded-lg shadow-md bg-white border overflow-hidden hover:shadow-lg transition"
                    >
                        <img
                            src={event.image_url || `https://placehold.co/600x300?text=Evento`}
                            alt={event.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 space-y-2">
                            <h2 className="text-xl font-semibold text-gray-800">{event.title}</h2>
                            <p className="text-sm text-gray-500">
                                Creato il: {new Date(event.created_at).toLocaleString()}
                            </p>

                            {event.description && (
                                <p className="text-gray-700 text-sm">{event.description}</p>
                            )}

                            <div className="text-sm text-gray-600">
                                {(event.totalMax <= 0) && (<span className="text-orange-500 font-medium">Slot non ancora disponibili</span>)}
                                {(event.remaining <= 0 && event.totalMax > 0) && (
                                    <span className="text-red-700 font-medium">
                  Tutti i slot sono occupati ({event.totalMax} iscritti)
                </span>
                                )}
                                {event.remaining > 0 && (
                                    <span className="text-green-700 font-medium">
                  Iscritti {event.totalBooked}, posti rimasti {event.remaining}
                </span>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <a
                                    href={`/event/${event.id}`}
                                    target="_blank"
                                    className="text-sm text-blue-600 underline hover:text-blue-800"
                                >
                                    Vai alla pagina evento →
                                </a>
                                {event.website_url && (
                                    <a
                                        href={event.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-purple-600 underline hover:text-purple-800"
                                    >
                                        🌐 Sito ufficiale
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="text-right mt-8">
                <a
                    href="/admin"
                    target="_blank"
                    className="text-sm text-gray-400 hover:text-gray-600 underline"
                >
                    ↗ Vai alla pagina admin
                </a>
            </div>
        </main>
    )
}
