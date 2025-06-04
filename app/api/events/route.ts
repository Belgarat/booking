import {NextRequest, NextResponse} from 'next/server'
import { supabase } from '@/libs/supabase'
type FILTER_VALUE = "new" | "all";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const filterParam = searchParams.get('filter') || 'all';
    const filter: FILTER_VALUE = filterParam === 'new' ? 'new' : 'all';
    const today = new Date().toISOString().split('T')[0];
    let q = supabase
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
                start_event,
                end_event,
                event_slots (
                  id,
                  datetime,
                  bookings (
                    people
                  )
                )
              `)
        .order('created_at', { ascending: true })

    switch (filter) {
        case "new":
            q = q.gte('end_event', today)
            break;
    }

    const {data, error} = await q;

    console.log(data)

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
