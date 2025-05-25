import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/libs/supabase'
import { verifyPassword } from '@/utils/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const password = req.headers.get('authorization') || ''
    const isValid = await verifyPassword(password)
    if (!isValid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { checked_in } = await req.json()

    const { error } = await supabase
        .from('bookings')
        .update({ checked_in })
        .eq('id', id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
