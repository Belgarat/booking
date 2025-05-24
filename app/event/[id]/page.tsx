'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Modal, {Variant} from "@/app/components/common/Modal";
import Link from "next/link";
import {format} from "date-fns-tz";
import {formatDateLabel} from "@/utils/date";

type Event = {
    id: string
    title: string
    description?: string
    location?: string
    image_url?: string
    created_at: string
    max_people_per_slot: number
    website_url?: string
    booked: number
    max: number
    remaining: number
}

type Slot = {
    id: string
    datetime: string
}

type Booking = {
    slot_id: string
    people: number
}

export default function EventPage() {
    const { id } = useParams()
    const [event, setEvent] = useState<Event | null>(null)
    const [slots, setSlots] = useState<Slot[]>([])
    const [bookings, setBookings] = useState<Booking[]>([])
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [people, setPeople] = useState(1)
    const [message, setMessage] = useState('')
    const [messageVariant, setMessageVariant] = useState<Variant>('success')
    const [emailError, setEmailError] = useState('')
    const [pending, setPending] = useState(false)
    const [open, setOpen] = useState(false)

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
            setBookings(await bookingsRes.json())
        }

        fetchData()
    }, [id])

    const getRemaining = (slotId: string): number => {
        console.log(bookings)
        const bookedForSlot = bookings
            .filter((b) => b.slot_id === slotId)
            .reduce((sum, b) => sum + (Number(b.people) || 1), 0)
        console.log(bookedForSlot)
        return (event?.max_people_per_slot || 0) - bookedForSlot
    }

    const isSlotAvailable = (slotId: string) => getRemaining(slotId) > 0

    const canSubmit = selectedSlot && getRemaining(selectedSlot.id) >= people && !pending

    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const submit = async () => {
        setEmailError('')
        setPending(true)


        if (!selectedSlot || !canSubmit) return

        if (!isValidEmail(email)) {
            setEmailError('Email non valida')
            return
        }

        const res = await fetch('/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email,
                phone,
                people,
                slotId: selectedSlot.id,
            }),
        })

        const result = await res.json()
        console.log('Booking result: ', result)

        if (res.ok) {
            setMessage('Prenotazione effettuata, riceverai una notifica via email. Grazie!')
            setMessageVariant('success')
            setOpen(true)
            setName('')
            setPhone('')
            setPeople(1)

            const bookingsRes = await fetch('/api/bookings')
            const updatedBookings = await bookingsRes.json()
            setBookings(updatedBookings)

            const slotsRes = await fetch(`/api/events/${id}/slots`)
            const updatedSlots = await slotsRes.json()
            setSlots(updatedSlots)
            setPending(false)
        } else {
            setMessage(result.error || 'Errore durante la prenotazione')
            setMessageVariant('error')
            setPending(false)
            setOpen(true)
        }
    }

    if (!event) return <div className="p-6">Caricamento evento...</div>

    return (
        <main className="max-w-3xl mx-auto p-4 md:p-8 space-y-10 text-gray-800">
            {event.image_url && (
                <div className="relative h-64 w-full rounded-lg overflow-hidden shadow">
                    <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-end p-4">
                        <h1 className="text-3xl font-bold text-white">{event.title}</h1>
                    </div>
                </div>
            )}

            <section className="space-y-3">
                {event.location && (
                    <p className="text-sm dark:text-gray-50 text-gray-500 italic">📍 {event.location}</p>
                )}

                {event.description && (
                    <p className="text-base dark:text-gray-50 text-gray-700 leading-relaxed">
                        {event.description}
                    </p>
                )}

                {event.website_url && (
                    <a
                        href={event.website_url}
                        target="_blank"
                        className="inline-block text-sm dark:text-gray-50 text-blue-600 underline hover:text-blue-800"
                    >
                        🌐 Vai al sito ufficiale
                    </a>
                )}
            </section>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    submit()
                }}
                className="border rounded-lg p-6 shadow-sm space-y-6"
            >
                <h2 className="text-xl font-semibold dark:text-gray-50 text-gray-800">Prenota uno slot disponibile</h2>

                {slots.filter((s) => isSlotAvailable(s.id)).length === 0 && (
                    <p className="text-red-600">Nessuno slot disponibile al momento.</p>
                )}

                {Object.entries(
                    slots
                        .filter((s) => isSlotAvailable(s.id))
                        .reduce((acc: Record<string, Slot[]>, slot) => {
                            const day = formatDateLabel(slot.datetime)
                            acc[day] = acc[day] || []
                            acc[day].push(slot)
                            return acc
                        }, {})
                ).map(([day, daySlots]) => (
                    <details key={day} open={false} className="border border-gray-300 rounded">
                        <summary className="cursor-pointer px-4 py-2 font-semibold bg-gray-50 dark:bg-gray-800 dark:text-white">
                            {day}
                        </summary>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4">
                            {daySlots.map((slot) => {
                                const remaining = getRemaining(slot.id)
                                const selected = selectedSlot?.id === slot.id

                                return (
                                    <label
                                        key={slot.id}
                                        className={`border p-2 rounded cursor-pointer transition text-sm
              ${selected ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
              dark:text-white`}
                                    >
                                        <input
                                            type="radio"
                                            name="slot"
                                            value={slot.id}
                                            checked={selected}
                                            onChange={() => setSelectedSlot(slot)}
                                            className="mr-2"
                                        />
                                        {format(new Date(slot.datetime), 'HH:mm')} ({remaining} posti)
                                    </label>
                                )
                            })}
                        </div>
                    </details>
                ))}


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nome"
                        className="border p-2 w-full rounded dark:bg-gray-50"
                        required
                    />

                    <div className="space-y-1">
                        <input
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setEmailError('')
                            }}
                            onBlur={() => {
                                if (!isValidEmail(email)) {
                                    setEmailError('Email non valida')
                                }
                            }}
                            placeholder="Email"
                            className="border p-2 w-full rounded dark:bg-gray-50"
                            required
                        />
                        {emailError && <p className="text-red-600 text-sm">{emailError}</p>}
                    </div>

                    <div>
                        <label className="block text-sm mb-1 dark:text-gray-50">Numero di telefono (opzionale)</label>
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Telefono (opzionale)"
                            className="border p-2 w-full rounded dark:bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1 dark:text-gray-50">
                            Numero partecipanti{' '}
                            {selectedSlot && (
                                <strong>(max {getRemaining(selectedSlot.id)})</strong>
                            )}
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={people}
                            onChange={(e) => setPeople(Number(e.target.value))}
                            className="border p-2 w-full rounded dark:bg-gray-50"
                            required
                        />
                        {!canSubmit && selectedSlot && (
                            <p className="text-red-600 text-sm mt-1">
                                Posti insufficienti nello slot selezionato.
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-2 rounded font-medium disabled:opacity-50 w-full"
                            disabled={!canSubmit}
                        >
                            Prenota ora
                        </button>

                        <Modal
                            isOpen={open}
                            onClose={() => setOpen(false)}
                            title="Stato prenotazione"
                            variant={messageVariant}
                        >
                            <p>
                                {message}
                            </p>
                            <p className="mt-2">
                                Vuoi annullare? {selectedSlot && (
                                  <Link
                                    href={`/event/booking/${selectedSlot.id}?email=${email}`}
                                    className="underline text-blue-600"
                                  >
                                    Gestisci la tua prenotazione
                                  </Link>
                                )}
                            </p>
                        </Modal>
                    </div>
                </div>
            </form>
        </main>
    )
}