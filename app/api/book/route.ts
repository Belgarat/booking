import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/libs/supabase'

export async function POST(req: NextRequest) {
    const { name, email, phone, slotId, people } = await req.json()

    // carica slot e evento relativo
    const { data: slotData } = await supabase
        .from('event_slots')
        .select('event_id')
        .eq('id', slotId)
        .single()

    const { data: eventData } = await supabase
        .from('events')
        .select('max_people_per_slot')
        .eq('id', slotData?.event_id)
        .single()

    const { data: existingBookings } = await supabase
        .from('bookings')
        .select('people')
        .eq('slot_id', slotId)

    const totalBooked = existingBookings?.reduce((sum, b) => sum + (b.people || 1), 0) || 0

    if (totalBooked + people > eventData?.max_people_per_slot) {
        return NextResponse.json({ error: 'Slot pieno' }, { status: 409 })
    }

// inserisce
    const { error } = await supabase.from('bookings').insert([{
        name, email, phone, slot_id: slotId, people
    }])


    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
