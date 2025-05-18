'use client'

import { useState } from 'react'
import {ArrowDownIcon, ArrowUpIcon, TrashIcon} from "@heroicons/react/16/solid";

type Event = {
    id: string
    title: string
    description?: string
    location?: string
    image_url?: string
    website_url?: string
    max_people_per_slot: number
    created_at: string
    booked: number       // totale iscritti
    max: number          // capacità massima totale (slot * max_people_per_slot)
    remaining: number    // max - booked
}
type Booking = {
    id: string
    name: string
    email: string
    phone?: string
    people: number
}

type Slot = {
    id: string
    datetime: string
    booked?: number
    bookings?: Booking[]
}

interface EventPayload {
    title: string;
    description: string;
    location: string;
    image_url: string;
    max_people_per_slot: number;
    website_url: string;
}

const API_ENDPOINT = '/api/admin/events';
const CONTENT_TYPE_JSON = 'application/json';

interface EventData {
    title: string;
    description: string;
    location: string;
    image_url: string;
    max_people_per_slot: number;
    website_url: string;
}

export default function AdminPage() {
    const [password, setPassword] = useState('')
    const [authenticated, setAuthenticated] = useState(false)
    const [events, setEvents] = useState<Event[]>([])
    const [slots, setSlots] = useState<Slot[]>([])
    const [maxPeople, setMaxPeople] = useState<number>(1)
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [location, setLocation] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [websiteUrl, setWebsiteUrl] = useState('')
    const [newSlot, setNewSlot] = useState('')
    const [message, setMessage] = useState('')
    const [editingEventId, setEditingEventId] = useState<string | null>(null)
    const [expandedSlotId, setExpandedSlotId] = useState<string | null>(null)
    const [savingEvent, setSavingEvent] = useState(false)

    const login = async () => {
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        })
        if (res.ok) {
            setAuthenticated(true)
            loadEvents()
        } else {
            setMessage('Password errata')
        }
    }

    const loadEvents = async () => {
        const res = await fetch('/api/events')
        const data = await res.json()
        setEvents(data)
    }

    const loadSlots = async (eventId: string) => {
        const res = await fetch(`/api/events/${eventId}/slots`)
        const data = await res.json()
        setSlots(data)
    }

    function resetEvent() {
        setEditingEventId(null)
        setTitle('')
        setDescription('')
        setLocation('')
        setImageUrl('')
        setWebsiteUrl('')
        setMaxPeople(1)
    }

    const handleSelectEvent =  async (event: Event) => {
        setSelectedEvent(event)
        setEditingEventId(null)
        setTitle(event.title)
        setDescription(event.description || '')
        setLocation(event.location || '')
        setImageUrl(event.image_url || '')
        setWebsiteUrl(event.website_url || '')
        setMaxPeople(event.max_people_per_slot || 1)
        await loadSlots(event.id)
    }

    const updateEvent = async () => {
        if (!editingEventId) return;
        setSavingEvent(true);
        
        const API_ENDPOINT = `/api/admin/events/${editingEventId}`;
        
        const eventData: EventData = {
            title,
            description,
            location,
            image_url: imageUrl,
            max_people_per_slot: maxPeople,
            website_url: websiteUrl
        };
        
        const resetFormFields = () => {
            setTitle('');
            setDescription('');
            setLocation('');
            setImageUrl('');
            setWebsiteUrl('');
            setMaxPeople(1);
            setEditingEventId(null);
        };

        try {
            const res = await fetch(API_ENDPOINT, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: password
                },
                body: JSON.stringify(eventData)
            });

            if (res.ok) {
                setMessage('Evento aggiornato');
                resetFormFields();
                await loadEvents();
            }
        } finally {
            setSavingEvent(false);
        }
    };

    const createEvent = async () => {
        try {
            setSavingEvent(true);
            
            const eventData: EventPayload = {
                title,
                description,
                location,
                image_url: imageUrl,
                max_people_per_slot: maxPeople,
                website_url: websiteUrl,
            };
    
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': CONTENT_TYPE_JSON,
                    authorization: password,
                },
                body: JSON.stringify(eventData),
            });
    
            if (!response.ok) {
                throw new Error(`Errore nella creazione dell'evento: ${response.statusText}`);
            }
    
            resetForm();
            setMessage('Evento creato');
            await loadEvents();
        } catch (error) {
            setMessage(`Errore: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
        } finally {
            setSavingEvent(false);
        }
    };
    
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setLocation('');
        setImageUrl('');
        setWebsiteUrl('');
        setMaxPeople(1);
    };


    const addSlot = async () => {
        if (!selectedEvent) return
        const res = await fetch('/api/admin/slots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                authorization: password,
            },
            body: JSON.stringify({ eventId: selectedEvent.id, datetime: newSlot }),
        })

        if (res.ok) {
            setMessage('Slot aggiunto')
            setNewSlot('')
            await loadSlots(selectedEvent.id)
        }
    }

    const deleteSlot = async (slotId: string) => {
        const res = await fetch(`/api/admin/slots/${slotId}`, {
            method: 'DELETE',
            headers: { authorization: password },
        })

        if (res.ok && selectedEvent) {
            setMessage('Slot eliminato')
            await loadSlots(selectedEvent.id)
        }
    }

    const deleteEvent = async (eventId: string) => {
        const res = await fetch(`/api/admin/events/${eventId}`, {
            method: 'DELETE',
            headers: { authorization: password },
        })

        if (res.ok) {
            setMessage('Evento eliminato')
            setSelectedEvent(null)
            await loadEvents()
            setSlots([])
        }
    }

    if (!authenticated) {
        return (
            <main className="p-6 max-w-sm mx-auto space-y-4">
                <h1 className="text-2xl font-bold">Accesso Admin</h1>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full"
                    placeholder="Password"
                />
                <button onClick={login} className="bg-black text-white px-4 py-2 rounded w-full">
                    Entra
                </button>
                {message && <p className="text-red-600">{message}</p>}
            </main>
        )
    }

    return (
        <main className="flex p-6 space-x-6">
            {/* Colonna eventi */}
            <section className="w-1/3 space-y-4 border-r pr-4">
                <h2 className="text-xl font-bold">Eventi</h2>
                <ul className="space-y-2">
                    {events.length === 0 && <p className="text-gray-500">Nessun evento inserito</p>}
                    {events.length > 0 && events?.map((e) => (
                        <li
                            key={e.id}
                            className={`p-2 border rounded ${
                                selectedEvent?.id === e.id ? 'bg-blue-100' : ''
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{e.title}</span>
                                <div className="flex items-center space-x-2">
                                    {/* Dettagli */}
                                    <button
                                        title="Dettagli"
                                        onClick={() => {
                                            handleSelectEvent(e)
                                            setEditingEventId(e.id)
                                        }}
                                        className="text-blue-600 text-sm hover:underline"
                                    >
                                        Dettagli
                                    </button>

                                    {/* Modifica (future implementation) */}
                                    <button
                                        title="Modifica"
                                        onClick={() => {
                                            handleSelectEvent(e)
                                            setEditingEventId(e.id)
                                        }}
                                        className="text-gray-600 text-sm"
                                    >
                                        ✏️
                                    </button>

                                    {/* Link pubblico */}
                                    <a
                                        href={`/event/${e.id}`}
                                        target="_blank"
                                        title="Vai alla landing"
                                        className="text-green-600 text-sm"
                                    >
                                        🌐
                                    </a>

                                    {/* Elimina */}
                                    <button
                                        title="Elimina"
                                        onClick={() => deleteEvent(e.id)}
                                        className="text-red-500 text-sm"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                <div id='events-actions' className='flex justify-end items-center'>
                    <button
                        title="Reset"
                        onClick={() => resetEvent()}
                        className="text-gray-500 text-sm"
                    >Reset selection</button>
                </div>

                <div className="mt-6 space-y-2">
                    <h2 className="text-xl font-bold">Crea nuovo evento</h2>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Titolo evento"
                        className="border p-2 w-full"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descrizione"
                        className="border p-2 w-full"
                        rows={4} // Puoi specificare il numero di righe iniziali
                    />
                    <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Luogo"
                        className="border p-2 w-full"
                    />
                    <input
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="URL immagine header"
                        className="border p-2 w-full"
                    />
                    <input
                        type="url"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        placeholder="URL sito web (opzionale)"
                        className="border p-2 w-full"
                    />
                    <input
                        type="number"
                        min={1}
                        value={maxPeople}
                        onChange={(e) => setMaxPeople(Number(e.target.value))}
                        placeholder="Posti massimi per slot"
                        className="border p-2 w-full"
                    />
                    {editingEventId ? (
                        <button
                            onClick={updateEvent}
                            className="bg-yellow-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
                            disabled={!title || !description || !location || !imageUrl || !maxPeople || savingEvent}
                        >
                            Salva Modifiche
                        </button>
                    ) : (
                        <button
                            onClick={createEvent}
                            className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
                            disabled={!title || !description || !location || !imageUrl || !maxPeople || savingEvent}
                        >
                            Crea Evento
                        </button>
                    )}
                    {editingEventId && (
                        <div className='flex justify-end items-center'>
                            <button
                                onClick={() => {
                                    setEditingEventId(null)
                                    setTitle('')
                                    setDescription('')
                                    setLocation('')
                                    setImageUrl('')
                                    setWebsiteUrl('')
                                    setMaxPeople(1)
                                    resetEvent()
                                }}
                                className="text-gray-500 text-sm"
                            >
                                Annulla modifica
                            </button>
                        </div>
                    )}
                </div>

            </section>

            {/* Colonna dettaglio evento */}
            <section className="w-2/3 space-y-4">
                {selectedEvent ? (
                    <>
                        <h2 className="text-xl font-bold">Slot per: {selectedEvent.title}</h2>

                        <div className="flex items-center space-x-2">
                            <input
                                type="datetime-local"
                                value={newSlot}
                                onChange={(e) => setNewSlot(e.target.value)}
                                className="border p-2 flex-1"
                            />
                            <button onClick={addSlot} className="bg-blue-600 text-white px-4 py-2 rounded">
                                Aggiungi Slot
                            </button>
                        </div>

                        <ul className="space-y-2">
                            <h2 className="text-xl font-bold">Slot list:</h2>
                            {slots.map((s) => {
                                const booked = s.booked || 0
                                const max = selectedEvent?.max_people_per_slot || 0
                                const remaining = max - booked
                                const isOpen = expandedSlotId === s.id

                                return (
                                    <li key={s.id} className="border p-3 rounded space-y-2">
                                        <div
                                            className="flex justify-between items-center cursor-pointer"
                                            onClick={() => setExpandedSlotId(isOpen ? null : s.id)}
                                        >
                                            <div>
                                                <div className="font-medium">{new Date(s.datetime).toLocaleString()}</div>
                                                <div className="text-sm text-gray-600">
                                                    {booked} iscritti / {max} posti disponibili ({remaining} rimasti)
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        deleteSlot(s.id)
                                                    }}
                                                    className="text-red-500 text-sm"
                                                >
                                                    <TrashIcon className="w-4 h-4" aria-hidden="true" />
                                                </button>
                                                <span className="text-gray-500 flex flex-col items-center">Dettagli {isOpen ? <ArrowUpIcon className="w-4 h-4"/> : <ArrowDownIcon className="w-4 h-4"/>}</span>
                                            </div>
                                        </div>

                                        {/* Dettagli prenotazioni espansi solo se slot aperto */}
                                        {isOpen && s.bookings && s.bookings.length > 0 && (
                                            <div className="mt-2 bg-gray-50 dark:bg-gray-800 rounded p-3 space-y-1 text-sm">
                                                <p className="font-medium text-gray-700 dark:text-gray-200">Prenotazioni:</p>
                                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                                    {s.bookings.map((b) => (
                                                        <li key={b.id} className="py-1 flex flex-col md:flex-row md:items-center md:gap-4">
                                                            <span className="font-semibold">{b.name}</span>
                                                            <span className="text-gray-500">{b.email}</span>
                                                            {b.phone && <span className="text-gray-500">📞 {b.phone}</span>}
                                                            <span>👥 {b.people} partecipant{b.people > 1 ? 'i' : 'e'}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>

                    </>
                ) : (
                    <p className="text-gray-500">Seleziona un evento per gestire gli slot.</p>
                )}
                {message && <p className="text-green-700">{message}</p>}
            </section>
        </main>
    )
}