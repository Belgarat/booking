'use client'

import {useState, useEffect, useCallback, useMemo} from 'react'
import { it } from 'date-fns/locale'
import {format, isAfter, parseISO, startOfDay} from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css' // Stili base del DayPicker

import AdminLoginForm from '@/app/components/admin/AdminLoginForm'
import { useFeedback } from '@/hooks/useFeedback'
import { useApi } from '@/hooks/useApi'
import { BookingWithSlot } from '@/types/enriched' // Assicurati che il tipo sia definito correttamente
import CheckinModal from '@/app/components/admin/checkin/CheckinModal'
import CheckinSlotList from "@/app/components/admin/checkin/CheckSlotList";

export default function AdminCheckinPage() {
    const [password, setPassword] = useState('')
    const [authenticated, setAuthenticated] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [slots, setSlots] = useState<BookingWithSlot[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedSlot, setSelectedSlot] = useState<BookingWithSlot | null>(null)
    const [eventDates, setEventDates] = useState<Date[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [futureSlots, setFutureSlots] = useState<BookingWithSlot[]>([])

    const pageSize = 5



    const { feedback, showFeedback } = useFeedback()
    const api = useApi(password, showFeedback)

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const upcomingSlots = useMemo(() => {
        return futureSlots
            .filter(slot => {
                const slotDate = parseISO(slot.event_slots?.datetime || '')
                return isAfter(slotDate, startOfDay(new Date()))
            })
            .sort((a, b) =>
                parseISO(a.event_slots.datetime).getTime() - parseISO(b.event_slots.datetime).getTime()
            )
    }, [futureSlots])

    const totalPages = Math.ceil(upcomingSlots.length / pageSize)

    const paginatedSlots = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return upcomingSlots.slice(start, start + pageSize)
    }, [currentPage, upcomingSlots])

    const fetchBookings = useCallback(async () => {
        if (!authenticated || !selectedDate) {
            setSlots([]);
            return;
        }

        const localDateString = format(selectedDate, 'yyyy-MM-dd');
        showFeedback(null);

        const res = await api.makeRequest(
            `/api/admin/checkin?date=${localDateString}`
        )
        if (res.ok) {
            const data: BookingWithSlot[] = await res.json() // Specifica il tipo per chiarezza
            setSlots(data)
            if (data.length === 0) {
                showFeedback({ text: 'Nessuna prenotazione trovata per questa data.', variant: 'info' });
            }
            // Aggiorna selectedSlot solo se la lista è stata ricaricata e lo slot era aperto
            if (modalOpen && selectedSlot) { // Condiziona l'aggiornamento alla modale aperta
                const updatedSlot = data.find((s) => s.id === selectedSlot.id);
                // Aggiorna solo se lo stato di checked_in è cambiato per evitare re-render non necessari
                if (updatedSlot && updatedSlot.checked_in !== selectedSlot.checked_in) {
                    setSelectedSlot(updatedSlot);
                } else if (!updatedSlot) {
                    setSelectedSlot(null); // Lo slot non esiste più, puliscilo
                }
            }
        } else {
            const errorData = await res.json().catch(() => ({ message: 'Errore nel caricamento delle prenotazioni' }));
            showFeedback({ text: errorData.message || 'Errore nel caricamento delle prenotazioni', variant: 'error' })
            setSlots([]);
        }
    }, [authenticated, selectedDate, api, showFeedback, modalOpen, selectedSlot]); // Dipendenze per useCallback

    useEffect(() => {
        fetchBookings();
    }, [selectedDate, authenticated, refreshTrigger, fetchBookings]);

    useEffect(() => {
        const loadUpcomingSlots = async () => {
            const res = await api.makeRequest('/api/admin/checkin/upcoming')
            if (res.ok) {
                const data = await res.json()
                setFutureSlots(data)
            }
        }

        if (authenticated) loadUpcomingSlots()
    }, [authenticated])


    useEffect(() => {
        const loadEventDates = async () => {
            const res = await api.makeRequest('/api/admin/checkin/days')
            if (!res.ok) return

            const raw = await res.json()
            const dateStrings = Array.from(
                new Set(
                    raw
                        .filter((d: { datetime: string }) => d.datetime)
                        .map((d: { datetime: string }) =>
                            parseISO(d.datetime).toDateString()
                        )
                )
            ) as string[]

            const dates = dateStrings.map((str) => new Date(str))
            console.log('Dates', dates)


            setEventDates(dates)
        }

        if (authenticated) loadEventDates()
    }, [authenticated])


    if (!authenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <AdminLoginForm
                    password={password}
                    setPassword={setPassword}
                    login={async () => {
                        const res = await api.makeRequest('/api/admin/login', {
                            method: 'POST',
                            body: JSON.stringify({ password }),
                        })

                        if (res.ok) {
                            setAuthenticated(true)
                            showFeedback(null);
                            setRefreshTrigger(prev => prev + 1);
                        } else {
                            showFeedback({ text: 'Password errata', variant: 'error' })
                        }
                    }}
                    message={feedback?.text}
                />
            </div>
        )
    }

    const handleOpenSlot = (slot: BookingWithSlot) => {
        setSelectedSlot(slot)
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setSelectedSlot(null);
        setRefreshTrigger(prev => prev + 1);
    }

    return (
        <main className="min-h-screen bg-gray-50 p-6 sm:p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-6 sm:p-8 space-y-8">
                <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
                    Gestione Check-in Prenotazioni
                </h1>

                {/* Sezione Selezione Data */}
                <section className="bg-gray-50 p-6 rounded-lg shadow-inner">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Seleziona una Data</h2>
                    <div id="daypicker" className="flex flex-wrap justify-center">
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                setSelectedDate(date);
                                showFeedback(null);
                            }}
                            locale={it}
                            className="rounded-md border border-gray-200 shadow-md p-2 bg-white" // Classe generale per il container del DayPicker
                            styles={{
                                // Questi sono gli stili accettati: proprietà CSS in camelCase.
                                // NON usare pseudo-classi come '&:hover' o nesting.
                                day: {
                                    borderRadius: '8px', // Bordi più arrotondati per i giorni
                                },
                                caption_label: {
                                    fontWeight: 'bold',
                                    fontSize: '1.125rem', // text-lg
                                    color: '#374151', // gray-700
                                },
                                nav_button_previous: {
                                    color: '#6B7280', // gray-500
                                    // '&:hover' qui non è supportato. Gestiscilo con classNames o CSS standard.
                                },
                                nav_button_next: {
                                    color: '#6B7280', // gray-500
                                    // '&:hover' qui non è supportato. Gestiscilo con classNames o CSS standard.
                                },
                                head: {
                                    color: '#6B7280', // gray-500
                                    fontSize: '0.875rem', // text-sm
                                },
                                day_selected: {
                                    backgroundColor: '#22C55E', // green-500
                                    color: 'white',
                                    // '&:hover' qui non è supportato. Gestiscilo con classNames o CSS standard.
                                },
                                day_outside: {
                                    color: '#9CA3AF', // gray-400
                                },
                                day_today: {
                                    fontWeight: 'bold',
                                    color: '#2563EB', // blue-600
                                },
                            }}
                            // USO CORRETTO per classi Tailwind avanzate o per stati come :hover:
                            // react-day-picker ha un prop 'classNames' che ti permette di applicare classi Tailwind
                            // a vari elementi interni del componente. Questo è il modo migliore per gli stati.
                            classNames={{
                                // Esempi di classNames:
                                // applichi 'bg-gray-200 hover:bg-gray-300' a tutti i giorni
                                day: "rounded-lg text-gray-800 hover:bg-gray-200",
                                // Personalizzi il colore delle frecce di navigazione e il loro hover
                                nav_button_previous: "text-gray-500 hover:bg-gray-200",
                                nav_button_next: "text-gray-500 hover:bg-gray-200",
                                // Stili per il giorno selezionato (sovrascrive 'day' per questo stato)
                                day_selected: "bg-green-500 text-white hover:bg-green-600 focus:bg-green-600",
                                // Stili per il giorno odierno
                                day_today: "font-bold text-blue-600 border border-blue-600 rounded-lg",
                                // Stili per i giorni del mese precedente/successivo (fuori range)
                                day_outside: "text-gray-400 opacity-70",
                                // Stili per l'header del mese/anno
                                caption_label: "font-bold text-lg text-gray-700",
                                // Stili per le intestazioni dei giorni della settimana
                                head_cell: "text-gray-500 text-sm font-medium",
                            }}
                            modifiers={{
                                hasEvents: eventDates
                            }}
                            modifiersClassNames={{
                                hasEvents: 'relative after:content-[""] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-green-600 after:rounded-full'
                            }}
                        />
                        <div className="md:w-1/2 bg-white p-4 rounded shadow space-y-4">
                            <h3 className="font-semibold text-gray-700">Prossimi slot con prenotazioni</h3>

                            {paginatedSlots.length === 0 && (
                                <p className="text-sm text-gray-500">Nessuno slot disponibile.</p>
                            )}

                            <ul className="divide-y divide-gray-200 text-sm">
                                {paginatedSlots.map(slot => {
                                    const slotDate = parseISO(slot.event_slots.datetime)
                                    return (
                                        <li
                                            key={slot.id}
                                            className="py-2 cursor-pointer hover:bg-gray-100 rounded transition"
                                            onClick={() => {
                                                setSelectedDate(slotDate)
                                                // opzionale: scroll al DayPicker
                                                document.getElementById('daypicker')?.scrollIntoView({ behavior: 'smooth' })
                                            }}
                                        >
                                            <p className="text-gray-500 text-sm italic">
                                                {slot.event_slots?.events?.title || 'Evento senza nome'}
                                            </p>
                                            <p className="font-medium text-gray-800">
                                                {format(slotDate, 'dd MMM yyyy – HH:mm', { locale: it })}
                                            </p>
                                            <p className="text-gray-600">{slot.name} – {slot.people} partecipant{slot.people > 1 ? 'i' : 'e'}</p>
                                        </li>
                                    )
                                })}
                            </ul>


                            {/* Paginazione */}
                            {totalPages > 1 && (
                                <div className="flex justify-between text-sm">
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
                        </div>
                    </div>
                </section>

                {/* Sezione Feedback */}
                {feedback && (
                    <div className={`p-4 rounded-lg text-sm text-center ${feedback.variant === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                        <p className="font-medium">{feedback.text}</p>
                    </div>
                )}

                {/* Sezione Lista Slot */}
                <section className="bg-gray-50 p-6 rounded-lg shadow-inner">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Slot per {selectedDate ? format(selectedDate, 'dd MMMM yyyy', { locale: it }) : 'la data selezionata'}
                    </h2>
                    {slots.length === 0 && !feedback && selectedDate && (
                        <p className="text-gray-500 text-center p-4">
                            Nessuna prenotazione trovata per il giorno selezionato.
                        </p>
                    )}
                    {slots.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <CheckinSlotList slots={slots} onSelectSlot={handleOpenSlot} />
                        </div>
                    )}
                </section>
            </div>

            {selectedSlot && (
                <CheckinModal
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    slot={selectedSlot}
                    password={password}
                />
            )}
        </main>
    )
}