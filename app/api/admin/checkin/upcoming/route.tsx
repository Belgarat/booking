// /api/admin/checkin/upcoming/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/libs/supabase'
import { verifyPassword } from '@/utils/auth'

export async function GET(req: Request) {
    const password = req.headers.get('authorization') || ''
    const isValid = await verifyPassword(password)
    if (!isValid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('bookings')
        .select(`
    id, name, email, phone, people, checked_in,
    event_slots (
        id,
        datetime,
        event_id,
        events (
            title
        )
    )
  `)
        .gte('event_slots.datetime', today)
        .order('datetime', { ascending: true, foreignTable: 'event_slots' }) // 👈 qui la differenza


    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}
