// types/checkin.ts

export type CheckinParticipant = {
    id: string
    name: string
    email: string
    phone?: string
    people: number
    present: boolean
}

export type CheckinSlot = {
    id: string
    datetime: string
    bookings: CheckinParticipant[]
}
