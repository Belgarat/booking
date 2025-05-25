import { EventBase, SlotBase, Booking } from './event'

// Evento con metadati
export type EventWithStats = EventBase & {
    totalMax: number
    totalBooked: number
    remaining: number
}

// Slot con prenotazioni arricchite
export type SlotWithBookings = SlotBase & {
    booked: number
    bookings: Booking[]
    max_people_per_slot?: number
}

export type BookingWithSlot = {
    id: string
    name: string
    email: string
    phone?: string
    people: number
    checked_in: boolean
    event_slots: {
        datetime: string
    }
}
