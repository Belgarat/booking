import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/libs/supabase'

export interface SlotModel {
    id: string
    datetime: string
    bookings?: PeopleModel[]
}

export interface PeopleModel {
    id: string
    name: string
    email: string
    phone?: string
    people: number
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ eventId: string }> }
) {
    const { eventId } = await params

    const { data, error } = await supabase
        .from('event_slots')
        .select(`
      id,
      datetime,
      bookings (
        id,
        name,
        email,
        phone,
        people
      )
    `)
        .eq('event_id', eventId)
        .order('datetime', { ascending: true })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const enriched = data.map((slot: SlotModel) => {
        const bookings = slot.bookings || []
        const booked = bookings.reduce((sum, b) => sum + (b.people || 1), 0)

        return {
            id: slot.id,
            datetime: slot.datetime,
            booked,
            bookings
        }
    })

    return NextResponse.json(enriched)
}
