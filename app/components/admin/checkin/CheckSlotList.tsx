'use client'

import { formatDateToItalianLocale } from '@/utils/date'
import { BookingWithSlot } from "@/types/enriched";

type Props = {

    slots: BookingWithSlot[]

    onSelectSlot: (booking: BookingWithSlot) => void
}

export default function CheckinSlotList({ slots, onSelectSlot }: Props) {


    if (!slots || slots.length === 0) {
        return (
            <section className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Prenotazioni per gli slot</h2>
                <p className="text-gray-500">Nessuna prenotazione trovata per gli slot di oggi o per la data selezionata.</p>
            </section>
        );
    }

    return (
        <section className="space-y-4">
            {/* Il titolo potrebbe essere "Prenotazioni" o simile, dato che elenchiamo singole prenotazioni */}
            <h2 className="text-xl font-bold text-gray-800">Prenotazioni negli slot disponibili</h2>
            <ul className="space-y-3">
                {/* Iteriamo sull'array di prenotazioni. Rinomino 'slot' in 'booking' per chiarezza */}
                {slots.map((booking) => {
                    // 'booking' qui è un oggetto BookingWithSlot, come quello nell'esempio:
                    // { id: "booking_id", name: "Marco", ..., event_slots: { datetime: "..." } }

                    // Non c'è 'booking.bookings', perché 'booking' è già una singola prenotazione.
                    // Le informazioni sui partecipanti e sullo stato checked_in sono dirette proprietà di 'booking'.
                    const numberOfPeople = booking.people;
                    const isCheckedIn = booking.checked_in;

                    return (
                        <li
                            key={booking.id} // L'ID della prenotazione
                            className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out cursor-pointer"
                            onClick={() => onSelectSlot(booking)} // Passa l'intera prenotazione al gestore del click
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
                                    type="button" // Buona pratica per i bottoni non di submit
                                    className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
                                >
                                    Gestisci
                                </button>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </section>
    )
}