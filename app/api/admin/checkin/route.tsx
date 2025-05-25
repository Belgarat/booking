import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/libs/supabase'
import { verifyPassword } from '@/utils/auth'
import { endOfDay } from 'date-fns'

export async function GET(req: NextRequest) {
    const password = req.headers.get('authorization') || ''
    const isValid = await verifyPassword(password)
    if (!isValid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    if (!date) return NextResponse.json({ error: 'Data mancante' }, { status: 400 })

    const start = new Date(date)
    const end = endOfDay(start)
    console.log(start, end)
    const { data, error } = await supabase
        .from('bookings')
        .select(`
            id,
            name,
            email,
            phone,
            people,
            checked_in,
            event_slots!inner (datetime) 
          `)
        .gte('event_slots.datetime', start.toISOString())
        .lt('event_slots.datetime', end.toISOString());


    console.log('Slot: ', data)
    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}
