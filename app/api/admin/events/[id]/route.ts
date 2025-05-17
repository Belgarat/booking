import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/libs/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function DELETE(
    request: NextRequest,
    context: { params: { id: string } }
) {
    const eventId = context.params.id
    const auth = request.headers.get('authorization')

    if (auth !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase.from('events').delete().eq('id', eventId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

export async function PUT(
    request: NextRequest,
    context: { params: { id: string } }
) {
    const eventId = context.params.id
    const auth = request.headers.get('authorization')

    if (auth !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { error } = await supabase
        .from('events')
        .update({
            title: body.title,
            description: body.description,
            location: body.location,
            image_url: body.image_url,
            max_people_per_slot: body.max_people_per_slot
        })
        .eq('id', eventId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
