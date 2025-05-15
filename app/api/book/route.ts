import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
    const supabase = createRouteHandlerClient({ cookies: () => cookies() })
    const { name, email, slotId } = await req.json()

    const { data: existing } = await supabase
        .from('bookings')
        .select('id')
        .eq('slot_id', slotId)

    if (existing && existing.length > 0) {
        return NextResponse.json({ error: 'Slot già prenotato' }, { status: 409 })
    }

    const { error } = await supabase.from('bookings').insert([{ name, email, slot_id: slotId }])

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
}
