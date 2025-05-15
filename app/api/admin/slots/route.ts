import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
    const supabase = createRouteHandlerClient({ cookies: () => cookies() })
    const auth = req.headers.get('authorization')
    const { eventId, datetime } = await req.json()

    if (auth !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
        .from('event_slots')
        .insert([{ event_id: eventId, datetime }])

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
}
