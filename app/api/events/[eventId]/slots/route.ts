import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/libs/supabase'

export interface SlotModel {
    id: string
    datetime: string
    bookings?: PeopleModel[]
}
export interface PeopleModel {
    people: number
}

export async function GET(
    request: NextRequest,
    context: { params: { eventId: string } }
) {
    const eventId = context.params.eventId

    const { data, error } = await supabase
        .from('event_slots')
        .select(`
      id,
      datetime,
      bookings:bookings(people)
    `)
        .eq('event_id', eventId)
        .order('datetime', { ascending: true })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const enriched = data.map((slot: SlotModel) => ({
        id: slot.id,
        datetime: slot.datetime,
        booked: slot.bookings?.reduce((sum: number, b: PeopleModel) => sum + (b.people || 1), 0) || 0,
    }))

    return NextResponse.json(enriched)
}
