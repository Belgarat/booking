export type Event = {
    id: string
    title: string
    description?: string
    location?: string
}

export type EventSlot = {
    id: string
    event_id: string
    datetime: string
}

export type Booking = {
    id: string
    name: string
    email: string
    slot_id: string
}
