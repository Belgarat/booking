'use client'

import {useState} from 'react'
import AdminLoginForm from "@/app/components/admin/AdminLoginForm"
import AdminEventList from "@/app/components/admin/AdminEventList"
import AdminEventForm from "@/app/components/admin/AdminEventForm"
import {EventWithStats, SlotWithBookings} from "@/types/enriched"
import SlotSelector from "@/app/components/admin/SlotSelector"
import SlotList from "@/app/components/admin/SlotList"
import FeedbackMessage from "@/app/components/common/FeedbackMessage"
import {useApi} from '@/hooks/useApi'
import {useFeedback} from '@/hooks/useFeedback'
import {useEventForm} from '@/hooks/useEventForm'
import {API_CONFIG} from '@/config/api'
import {FEEDBACK_CONFIG} from '@/config/feedback'
import {toUTCISOString} from "@/utils/date";

export default function AdminPage() {
    // Stati di autenticazione
    const [password, setPassword] = useState('')
    const [authenticated, setAuthenticated] = useState(false)

    // Stati degli eventi e slot
    const [events, setEvents] = useState<EventWithStats[]>([])
    const [slots, setSlots] = useState<SlotWithBookings[]>([])
    const [selectedEvent, setSelectedEvent] = useState<EventWithStats | null>(null)
    const [editingEventId, setEditingEventId] = useState<string | null>(null)
    const [savingEvent, setSavingEvent] = useState(false)
    const [newSlot, setNewSlot] = useState('')

    // Utilizzo dei custom hooks
    const {feedback, showFeedback} = useFeedback()
    const {formData, updateField, resetForm} = useEventForm()
    const api = useApi(password, showFeedback)

    // Funzioni di gestione API
    const login = async () => {
        const res = await api.makeRequest(API_CONFIG.ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify({password})
        })

        if (res.ok) {
            setAuthenticated(true)
            loadEvents()
        } else {
            showFeedback(FEEDBACK_CONFIG.MESSAGES.ERROR.LOGIN)
        }
    }

    const loadEvents = async () => {
        const res = await api.makeRequest(API_CONFIG.ENDPOINTS.EVENTS)
        const data = await res.json()
        setEvents(data)
    }

    const loadSlots = async (eventId: string) => {
        try {
            const res = await api.makeRequest(API_CONFIG.ENDPOINTS.EVENT_SLOTS(eventId))
            if (res.ok) {
                const data = await res.json()
                setSlots(data)
            } else {
                console.error('Errore nel caricamento degli slots:', res.status)
                setSlots([])
                showFeedback({
                    text: 'Errore nel caricamento degli slot',
                    variant: 'error'
                })
            }
        } catch (error) {
            console.error('Errore nel caricamento degli slots:', error)
            setSlots([])
            showFeedback({
                text: 'Errore nel caricamento degli slot',
                variant: 'error'
            })
        }
    }


    // Gestori degli eventi
    const handleSelectEvent = async (event: EventWithStats) => {
        setSelectedEvent(event)
        setEditingEventId(event.id)
        updateField('title', event.title)
        updateField('description', event.description || '')
        updateField('location', event.location || '')
        updateField('image_url', event.image_url || '')
        updateField('website_url', event.website_url || '')
        updateField('max_people_per_slot', event.max_people_per_slot || 1)
        await loadSlots(event.id)
    }

    const handleCancel = () => {
        setEditingEventId(null)
        resetForm()
    }

    // Operazioni CRUD
    const createEvent = async () => {
        setSavingEvent(true)
        try {
            const res = await api.makeRequest(API_CONFIG.ENDPOINTS.ADMIN.EVENTS, {
                method: 'POST',
                body: JSON.stringify(formData)
            })

            if (!res.ok) {
                throw new Error(res.statusText)
            }

            showFeedback(FEEDBACK_CONFIG.MESSAGES.SUCCESS.EVENT_CREATED)
            resetForm()
            await loadEvents()
        } catch (error) {
            showFeedback({
                text: `${FEEDBACK_CONFIG.MESSAGES.ERROR.CREATE_EVENT.text}${error instanceof Error ? error.message : 'Errore sconosciuto'}`,
                variant: 'error'
            })
        } finally {
            setSavingEvent(false)
        }
    }

    const updateEvent = async () => {
        if (!editingEventId) return
        setSavingEvent(true)

        try {
            await api.makeRequest(`${API_CONFIG.ENDPOINTS.ADMIN.EVENTS}/${editingEventId}`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            })
            showFeedback(FEEDBACK_CONFIG.MESSAGES.SUCCESS.EVENT_UPDATED)
            resetForm()
            setEditingEventId(null)
            await loadEvents()
        } finally {
            setSavingEvent(false)
        }
    }

    const addSlot = async () => {
        if (!selectedEvent) return

        // ⚠️ Converte da locale (datetime-local) a UTC string
        const datetimeUTC = toUTCISOString(newSlot)

        const res = await api.makeRequest(API_CONFIG.ENDPOINTS.SLOTS, {
            method: 'POST',
            body: JSON.stringify({eventId: selectedEvent.id, datetime: datetimeUTC})
        })

        if (res.ok) {
            showFeedback(FEEDBACK_CONFIG.MESSAGES.SUCCESS.SLOT_ADDED)
            // setNewSlot('')
            await loadSlots(selectedEvent.id)
        }
    }

    const deleteSlot = async (slotId: string) => {
        const res = await api.makeRequest(`${API_CONFIG.ENDPOINTS.SLOTS}/${slotId}`, {
            method: 'DELETE'
        })

        if (res.ok && selectedEvent) {
            showFeedback(FEEDBACK_CONFIG.MESSAGES.SUCCESS.SLOT_DELETED)
            await loadSlots(selectedEvent.id)
        }
    }

    const deleteEvent = async (eventId: string) => {
        const res = await api.makeRequest(`${API_CONFIG.ENDPOINTS.ADMIN.EVENTS}/${eventId}`, {
            method: 'DELETE'
        })

        if (res.ok) {
            showFeedback(FEEDBACK_CONFIG.MESSAGES.SUCCESS.EVENT_DELETED)
            setSelectedEvent(null)
            await loadEvents()
            setSlots([])
        }
    }

    if (!authenticated) {
        return (
            <AdminLoginForm
                password={password}
                setPassword={setPassword}
                login={login}
                message={feedback?.text}
            />
        )
    }

    return (
        <main className="flex p-6 space-x-6">
            <section className="w-1/3 space-y-4 border-r pr-4">
                <AdminEventList
                    events={events}
                    selectedEventId={selectedEvent?.id ?? null}
                    onSelect={handleSelectEvent}
                    onEdit={handleSelectEvent}
                    onDelete={deleteEvent}
                />
                <AdminEventForm
                    title={formData.title || ''}
                    description={formData.description || ''}
                    location={formData.location || ''}
                    image_url={formData.image_url || ''}
                    website_url={formData.website_url || ''}
                    max_people_per_slot={formData.max_people_per_slot}
                    editing={Boolean(editingEventId)}
                    saving={savingEvent}
                    onChange={(field, value) => updateField(field, value)}
                    onSave={editingEventId ? updateEvent : createEvent}
                    onCancel={handleCancel}
                />

            </section>

            <section className="w-2/3 space-y-4">
                {selectedEvent ? (
                    <>
                        <h2 className="text-xl font-bold">Slot per: {selectedEvent.title}</h2>
                        <SlotSelector
                            value={newSlot}
                            onChange={setNewSlot}
                            onAdd={addSlot}
                        />
                        <SlotList
                            slots={slots}
                            maxPeoplePerSlot={selectedEvent?.max_people_per_slot || 0}
                            onDeleteSlot={deleteSlot}
                        />
                    </>
                ) : (
                    <FeedbackMessage
                        message={FEEDBACK_CONFIG.MESSAGES.INFO.SELECT_EVENT.text}
                        variant={FEEDBACK_CONFIG.MESSAGES.INFO.SELECT_EVENT.variant}
                    />
                )}
                {feedback && (
                    <FeedbackMessage
                        message={feedback.text}
                        variant={feedback.variant}
                    />
                )}
            </section>
        </main>
    )
}