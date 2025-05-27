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
    const [privacyAccepted, setPrivacyAccepted] = useState(false)


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

    const isSlotFull = selectedSlot && getRemaining(selectedSlot.id) < people

    const isSlotAvailable = (slotId: string) => getRemaining(slotId) > 0

    const canSubmit =
        selectedSlot &&
        getRemaining(selectedSlot.id) >= people &&
        !pending &&
        privacyAccepted

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
            <div className="max-w-3xl mx-auto mb-4 px-4">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Torna alla lista eventi
                </Link>
            </div>

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
                    <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line dark:text-gray-50">
                        {event.description}
                    </p>
                )}

                {event.website_url && (
                    <a
                        href={event.website_url}
                        target="_blank"
                        className="inline-block text-sm dark:text-gray-50 text-blue-600 underline hover:text-blue-800"
                    >
                        <span><svg className="w-4 h-4 inline-block mr-1" xmlns="http://www.w3.org/2000/svg"
                                   viewBox="0 0 24 24" fill="currentColor"><path
                            d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z"/></svg>Regole e materiali aggiuntivi</span>
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
                        {isSlotFull && !pending && !open && (
                            <p className="text-red-600 text-sm mt-1">
                                Posti insufficienti nello slot selezionato.
                            </p>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <div className="text-sm space-y-2">
                            <label className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    required
                                    className="mt-1"
                                    checked={privacyAccepted}
                                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                />
                                <span>
                                  Dichiaro di aver letto e compreso l’<Link href="/privacy" className="underline text-blue-600" target="_blank">informativa sulla privacy</Link> e acconsento al trattamento dei dati per la gestione della prenotazione.
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-2 rounded font-medium disabled:opacity-50 w-full"
                            disabled={!canSubmit}
                        >
                            Prenota ora
                        </button>

                        <Modal
                            isOpen={open}
                            onClose={() => {
                                if (selectedSlot) setSelectedSlot(null);
                                setOpen(false)
                            }}
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
                            <p>I tuoi dati saranno trattati nel rispetto della normativa vigente.</p>
                        </Modal>
                    </div>
                </div>
            </form>
        </main>
    )
}