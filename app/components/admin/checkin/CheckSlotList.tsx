'use client'

import { useMemo, useState } from 'react'
import { formatDateToItalianLocale } from '@/utils/date'
import { BookingWithSlot } from "@/types/enriched"

type Props = {
    slots: BookingWithSlot[]
    onSelectSlot: (booking: BookingWithSlot) => void
}

const PAGE_SIZE = 5

export default function CheckinSlotList({ slots, onSelectSlot }: Props) {
    const [showOnlyNotCheckedIn, setShowOnlyNotCheckedIn] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    const filteredSlots = useMemo(() => {
        const base = showOnlyNotCheckedIn
            ? slots.filter(slot => !slot.checked_in)
            : slots
        return base.sort((a, b) =>
            new Date(a.event_slots.datetime).getTime() - new Date(b.event_slots.datetime).getTime()
        )
    }, [slots, showOnlyNotCheckedIn])

    const totalPages = Math.ceil(filteredSlots.length / PAGE_SIZE)

    const paginatedSlots = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE
        return filteredSlots.slice(start, start + PAGE_SIZE)
    }, [filteredSlots, currentPage])

    if (!slots || slots.length === 0) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Prenotazioni per gli slot</h2>
                <p className="text-gray-500">Nessuna prenotazione trovata.</p>
            </section>
        )
    }

    return (
        <section className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Prenotazioni negli slot disponibili</h2>
                <label className="inline-flex items-center text-sm text-gray-700 space-x-2">
                    <input
                        type="checkbox"
                        checked={!showOnlyNotCheckedIn}
                        onChange={() => {
                            setShowOnlyNotCheckedIn(prev => !prev)
                            setCurrentPage(1)
                        }}
                        className="form-checkbox h-4 w-4 text-green-600"
                    />
                    <span>Mostra tutti</span>
                </label>
            </div>

            <ul className="space-y-3">
                {paginatedSlots.map((booking) => {
                    const numberOfPeople = booking.people
                    const isCheckedIn = booking.checked_in

                    return (
                        <li
                            key={booking.id}
                            className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out cursor-pointer"
                            onClick={() => onSelectSlot(booking)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-grow">
                                    <p className="text-gray-500 text-sm italic">
                                        {booking.event_slots?.events?.title || 'Evento senza nome'}
                                    </p>
                                    <p className="font-semibold text-lg text-gray-900">{booking.name}</p>
                                    <p className="text-sm text-indigo-600">
                                        Orario Slot: {formatDateToItalianLocale(booking.event_slots.datetime)}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {numberOfPeople} {numberOfPeople === 1 ? 'persona' : 'persone'}
                                    </p>
                                    {isCheckedIn ? (
                                        <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                                                <circle cx="4" cy="4" r="3" />
                                            </svg>
                                            Presente
                                        </span>
                                    ) : (
                                        <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            <svg className="-ml-0.5 mr-1.5 h-2 w-2 text-red-400" fill="currentColor" viewBox="0 0 8 8">
                                                <circle cx="4" cy="4" r="3" />
                                            </svg>
                                            Non presente
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
                                >
                                    Gestisci
                                </button>
                            </div>
                        </li>
                    )
                })}
            </ul>

            {/* PAGINAZIONE */}
            {totalPages > 1 && (
                <div className="flex justify-between text-sm items-center pt-4 border-t">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="text-blue-600 disabled:text-gray-400"
                    >
                        ← Indietro
                    </button>
                    <span>Pagina {currentPage} di {totalPages}</span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="text-blue-600 disabled:text-gray-400"
                    >
                        Avanti →
                    </button>
                </div>
            )}
        </section>
    )
}
