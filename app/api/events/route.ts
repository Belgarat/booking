import { NextResponse } from 'next/server'
import { supabase } from '@/libs/supabase'

export async function GET() {
    const { data, error } = await supabase
        .from('events')
        .select(`
                id,
                title,
                description,
                location,
                created_at,
                max_people_per_slot,
                image_url,
                website_url,
                event_slots (
                  id,
                  bookings (
                    people
                  )
                )
              `)
        .order('created_at', { ascending: true })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const enriched = data.map((event) => {
        const slots = event.event_slots || []
        const totalMax = slots.length * event.max_people_per_slot
        const totalBooked = slots.flatMap(s => s.bookings || []).reduce((sum, b) => sum + (b.people || 1), 0)
        const remaining = totalMax - totalBooked

        return {
            id: event.id,
            title: event.title,
            description: event.description,
            image_url: event.image_url,
            max_people_per_slot: event.max_people_per_slot,
            location: event.location,
            website_url: event.website_url,
            created_at: event.created_at,
            totalMax,
            totalBooked,
            remaining
        }
    })

    return NextResponse.json(enriched)
}
