import {NextRequest, NextResponse} from 'next/server'
import { supabase } from '@/libs/supabase'

export async function GET() {
    const { data, error } = await supabase
        .from('events')
        .select(`
      id,
      title,
      description,
      created_at,
      max_people_per_slot,
      event_slots (
        id,
        bookings (people)
      )
    `)
        .order('created_at', { ascending: true })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const enriched = data.map((event: any) => {
        const slots = event.event_slots || []
        const slotCount = slots.length
        const totalMax = slotCount * (event.max_people_per_slot || 0)

        const totalBooked = slots.flatMap((s: any) => s.bookings || []).reduce(
            (sum: number, b: any) => sum + (b.people || 1),
            0
        )

        return {
            id: event.id,
            title: event.title,
            description: event.description,
            created_at: event.created_at,
            booked: totalBooked,
            max: totalMax,
            remaining: totalMax - totalBooked
        }
    })

    return NextResponse.json(enriched)
}
export async function POST(req: NextRequest) {
    const auth = req.headers.get('authorization')
    const { title, description, location, image_url, max_people_per_slot } = await req.json()

    if (auth !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
        .from('events')
        .insert([{ title, description, location, image_url, max_people_per_slot }])

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
