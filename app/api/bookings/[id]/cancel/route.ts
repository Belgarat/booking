import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/libs/supabase'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const { error } = await supabase.from('bookings').delete().eq('id', id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
