import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/libs/supabase'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const body = await req.json()
    const email = body.email

    if (!email) {
        return NextResponse.json({ error: 'Email mancante' }, { status: 400 })
    }

    const { data: booking, error } = await supabase
        .from('bookings')
        .select(`
          id,
          name,
          email,
          phone,
          people,
          slot_id,
          created_at,
          event_slots (
            event_id,
            datetime
          )
        `)
        .eq('email', email)
    console.log(error, booking, id, email)

    if (error || !booking) {
        return NextResponse.json({ error: 'Prenotazione non trovata' }, { status: 404 })
    }

    return NextResponse.json({ booking })
}
