'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Booking } from '@/types/event'
import EventCard from "@/app/components/event/EventCard";
import {EventWithStats} from "@/types/enriched";

export default function BookingManagePage() {
    const { slotId } = useParams()
    const searchParams = useSearchParams()
    const email = searchParams.get('email') || ''

    const [events, setEvents] = useState<EventWithStats[]>([])
    const [bookings, setBookings] = useState<Booking[]>([])
    const [error, setError] = useState('')
    const [cancelMessage, setCancelMessage] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!email || !slotId) return

        const load = async () => {
            setLoading(true)
            setError('')
            setCancelMessage('')
            try {
                const res = await fetch(`/api/bookings/${slotId}/manage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                })
                const json = await res.json()
                if (res.ok) {
                    setBookings(json.booking)
                } else {
                    setError(json.error || 'Errore durante il recupero delle prenotazioni')
                }
            } catch (e) {
                setError(`Errore di rete: ${(e as Error).message}`)
            } finally {
                setLoading(false)
            }
        }

        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events')
                if (!res.ok) throw new Error('Errore nel recupero eventi')
                const data = await res.json()
                setEvents(data)
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto'
                setError(errorMessage)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
        load()
    }, [email, slotId])

    const handleCancel = async (bookingId: string) => {
        const confirm = window.confirm('Sei sicuro di voler annullare questa prenotazione?')
        if (!confirm) return

        const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
            method: 'DELETE',
        })

        if (res.ok) {
            setBookings((prev) => prev.filter((b) => b.id !== bookingId))
            setCancelMessage('Prenotazione annullata con successo.')
        } else {
            setError("Errore durante l'annullamento della prenotazione")
        }
    }

    if (!email) return <p className="p-4 text-red-600">Email mancante nell’URL.</p>
    if (loading) return <p className="p-4">Caricamento...</p>
    if (error) return <p className="p-4 text-red-600">{error}</p>
    if (cancelMessage && bookings.length === 0)
        return <p className="p-4 text-green-600">{cancelMessage}</p>
    if (bookings.length === 0)
        return <p className="p-4 text-gray-600">Nessuna prenotazione trovata per questa email.</p>

    return (
        <main className="mx-auto max-w-7xl p-4">
            <h1 className="text-2xl font-bold">Le tue prenotazioni</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                {cancelMessage && <p className="text-green-600">{cancelMessage}</p>}

                {bookings.map((booking) => (
                    <div key={booking.id} className="border rounded p-4 space-y-2">
                        {(() => {
                            const event = events.find((e) => e.id === booking.event_slots?.event_id);
                            return event ? <EventCard event={event} /> : <p>Evento non trovato</p>;
                        })()}
                        <ul className="text-sm space-y-1 text-gray-700">
                            <li><strong>Nome:</strong> {booking.name}</li>
                            <li><strong>Email:</strong> {booking.email}</li>
                            {booking.phone && <li><strong>Telefono:</strong> {booking.phone}</li>}
                            <li><strong>Partecipanti:</strong> {booking.people}</li>
                            <li>
                                <strong>Slot:</strong>{' '}
                                {booking.event_slots?.datetime
                                    ? new Date(booking.event_slots.datetime).toLocaleString()
                                    : 'Data non disponibile'}
                            </li>
                            <li>
                                <strong>Effettuata il:</strong>{' '}
                                {booking.created_at
                                    ? new Date(booking.created_at).toLocaleString()
                                    : 'Data non disponibile'}
                            </li>
                        </ul>

                        <button
                            onClick={() => handleCancel(booking.id)}
                            className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        >
                            Annulla prenotazione
                        </button>
                    </div>
                ))}
            </div>
        </main>
    )
}
