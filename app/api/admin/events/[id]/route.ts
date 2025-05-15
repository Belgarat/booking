import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// 👇 disabilita edge runtime, abilita l'accesso corretto a params
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function DELETE(
    request: NextRequest,
    context: { params: Record<string, string> }
) {
    // ✅ Accedi ai parametri con await (anche se in questo contesto potrebbe non essere strettamente necessario)
    const { id: eventId } = await Promise.resolve(context.params);
    console.log(eventId);

    const auth = request.headers.get('authorization')
    if (auth !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase.from('events').delete().eq('id', eventId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

export async function PUT(
    request: NextRequest,
    context: { params: Record<string, string> }
) {
    const { id: eventId } = await Promise.resolve(context.params);
    const auth = request.headers.get('authorization')

    if (auth !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase
        .from('events')
        .update({
            title: body.title,
            description: body.description,
            location: body.location,
            image_url: body.image_url
        })
        .eq('id', eventId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}