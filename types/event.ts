// Tipo base dell'evento (come da database)
export type EventBase = {
    id: string
    title: string
    description?: string
    location?: string
    image_url?: string
    website_url?: string
    max_people_per_slot: number
    created_at: string
}

// Dato base di uno slot
export type SlotBase = {
    id: string
    event_id: string
    datetime: string
}

// Prenotazione grezza
export type Booking = {
    id: string
    name: string
    email: string
    phone?: string
    people: number
    created_at?: string
    slot_id?: string
    event_slots?: {
        event_id?: string,
        datetime: string
    }
    checked_in?: boolean;
}
