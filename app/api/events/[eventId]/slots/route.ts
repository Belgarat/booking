import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
    request: NextRequest,
    context: { params: { eventId: string } }
) {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const {eventId: eventId} = await Promise.resolve(context.params);

    const { data, error } = await supabase
        .from('event_slots')
        .select('*')
        .eq('event_id', eventId)
        .order('datetime', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
}
