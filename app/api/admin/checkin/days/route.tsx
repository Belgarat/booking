import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/libs/supabase'
import { verifyPassword } from '@/utils/auth'

export async function GET(req: NextRequest) {
    const password = req.headers.get('authorization') || ''
    const isValid = await verifyPassword(password)
    if (!isValid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
        .from('event_slots')
        .select('datetime')


    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}
