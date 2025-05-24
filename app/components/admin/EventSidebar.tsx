'use client'

import AdminEventList from './AdminEventList'
import { EventWithStats } from '@/types/enriched'

type Props = {
    events: EventWithStats[]
    selectedEventId: string | null
    onSelect: (event: EventWithStats) => void
    onEdit: (event: EventWithStats) => void
    onDelete: (eventId: string) => void
    onCreateNew: () => void
}

export default function EventSidebar({
                                         events,
                                         selectedEventId,
                                         onSelect,
                                         onEdit,
                                         onDelete,
                                         onCreateNew
                                     }: Props) {
    return (
        <section className="w-1/3 space-y-6 border-r pr-6">
            <div className="flex justify-between items-center">
                <button
                    onClick={onCreateNew}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                    ➕ Crea Evento
                </button>
            </div>

            <AdminEventList
                events={events}
                selectedEventId={selectedEventId}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </section>
    )
}
