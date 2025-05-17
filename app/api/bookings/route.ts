import { NextResponse } from 'next/server'
import { supabase } from '@/libs/supabase'

export async function GET() {
    const { data, error } = await supabase
        .from('bookings')
        .select('slot_id')

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}
