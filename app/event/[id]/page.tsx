'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

type Event = {
    id: string
    title: string
    description?: string
    location?: string
    image_url?: string
}

type Slot = {
    id: string
    datetime: string
}

export default function EventPage() {
    const { id } = useParams()
    const [event, setEvent] = useState<Event | null>(null)
    const [slots, setSlots] = useState<Slot[]>([])
    const [booked, setBooked] = useState<string[]>([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [slotId, setSlotId] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            const [eventRes, slotsRes, bookingsRes] = await Promise.all([
                fetch('/api/events'),
                fetch(`/api/events/${id}/slots`),
                fetch('/api/bookings'),
            ])

            const events = await eventRes.json()
            setEvent(events.find((e: Event) => e.id === id))

            setSlots(await slotsRes.json())
            const bookings = await bookingsRes.json()
            setBooked(bookings.map((b: any) => b.slot_id))
        }

        fetchData()
    }, [id])

    const submit = async () => {
        const res = await fetch('/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, slotId }),
        })

        const result = await res.json()
        setMessage(result.error || 'Prenotazione effettuata')
    }

    if (!event) return <div className="p-6">Caricamento evento...</div>

    return (
        <main className="max-w-2xl mx-auto p-6 space-y-6">
            {event.image_url && (
                <img src={event.image_url} alt="Header" className="rounded-lg w-full h-64 object-cover" />
            )}

            <div className="space-y-2">
                <h1 className="text-3xl font-bold">{event.title}</h1>
                {event.description && <p>{event.description}</p>}
                {event.location && <p className="text-gray-600 italic">📍 {event.location}</p>}
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    submit()
                }}
                className="space-y-4"
            >
                <h2 className="text-xl font-semibold">Prenota uno slot</h2>

                {slots.map((slot) => (
                    <label key={slot.id} className="block">
                        <input
                            type="radio"
                            name="slot"
                            value={slot.id}
                            disabled={booked.includes(slot.id)}
                            onChange={() => setSlotId(slot.id)}
                        />
                        <span className="ml-2">
              {new Date(slot.datetime).toLocaleString()}
                            {booked.includes(slot.id) && ' (occupato)'}
            </span>
                    </label>
                ))}

                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome"
                    className="border p-2 w-full"
                    required
                />
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="border p-2 w-full"
                    required
                />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                    Prenota
                </button>

                {message && <p className="mt-2 text-green-700">{message}</p>}
            </form>
        </main>
    )
}
