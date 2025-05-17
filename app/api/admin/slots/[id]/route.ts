import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/libs/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function DELETE(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const eventId = context.params.id
    const auth = req.headers.get('authorization')

    if (auth !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
        .from('event_slots')
        .delete()
        .eq('id', eventId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
