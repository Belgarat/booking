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
}
