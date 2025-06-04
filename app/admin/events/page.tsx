'use client'

import { useEffect, useState } from 'react'
import Loader from '@/app/components/Loader'
import EventList from "@/app/components/event/EventList";
import PageFooterLink from "@/app/components/common/PageFooterLink";
import ErrorMessage from "@/app/components/common/ErrorMessage";

type Event = {
    id: string
    title: string
    description?: string
    location?: string
    image_url?: string
    website_url?: string
    max_people_per_slot: number
    created_at: string
    totalMax: number
    totalBooked: number
    remaining: number
}

export default function AdminEventListPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/events?filter=new')
                if (!res.ok) throw new Error('Errore nel recupero eventi')
                const data = await res.json()
                setEvents(data)
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto'
                setError(errorMessage)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [])

    if (loading) return <Loader />
    if (error) return <ErrorMessage message={error} />

    return (
        <main className="max-w-8xl mx-auto p-6 text-gray-900 dark:text-gray-100">
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <img src="/Logo-a-colori-1k.png" alt="DolomitiNerd Logo" className="h-8"/>
                Eventi DolomitiNerd
            </h1>
            <EventList events={events}/>
            <PageFooterLink href="/admin">↗ Vai alla pagina admin</PageFooterLink>
        </main>
    )
}
