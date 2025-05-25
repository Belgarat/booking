'use client'

import AdminEventList from './AdminEventList'
import { EventWithStats, SlotWithBookings } from '@/types/enriched'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { useMemo } from 'react'
import { it } from 'date-fns/locale'
import {parseISO} from "date-fns";

type Props = {
    events: EventWithStats[]
    selectedEventId: string | null
    onSelect: (event: EventWithStats) => void
    onEdit: (event: EventWithStats) => void
    onDelete: (eventId: string) => void
    onCreateNew: () => void
    slots: SlotWithBookings[] // ➕ passa anche gli slot
}

export default function EventSidebar({
                                         events,
                                         selectedEventId,
                                         onSelect,
                                         onEdit,
                                         onDelete,
                                         onCreateNew,
                                         slots
                                     }: Props) {
    // 🔍 Raggruppa slot per giorno
    const slotsByDay = useMemo(() => {
        const map = new Map<string, { date: Date; total: number; full: number }>()
        for (const slot of slots) {
            const date = parseISO(slot.datetime)
            const dayStr = date.toDateString()

            const isFull = (slot.booked || 0) >= (slot.max_people_per_slot || 0)
            if (!map.has(dayStr)) {
                map.set(dayStr, { date, total: 1, full: isFull ? 1 : 0 })
            } else {
                const existing = map.get(dayStr)!
                map.set(dayStr, {
                    date,
                    total: existing.total + 1,
                    full: existing.full + (isFull ? 1 : 0)
                })
            }
        }

        return Array.from(map.values())
    }, [slots])


    const fullDays = slotsByDay
        .filter((d) => d.full === d.total)
        .map((d) => d.date)

    const partialDays = slotsByDay
        .filter((d) => d.full > 0 && d.full < d.total)
        .map((d) => d.date)

    const availableDays = slotsByDay
        .filter((d) => d.full === 0)
        .map((d) => d.date)

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

            <div className="text-sm">
                <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Calendario slot</h3>
                <DayPicker
                    mode="single"
                    locale={it}
                    selected={undefined}
                    modifiers={{
                        full: fullDays,
                        partial: partialDays,
                        available: availableDays,
                    }}
                    modifiersClassNames={{
                        full: 'bg-red-300 text-red-900 font-semibold',
                        partial: 'bg-yellow-200 text-yellow-900',
                        available: 'bg-green-200 text-green-800',
                    }}
                />
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 bg-green-200 rounded-sm"></span>
                        Solo disponibili
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 bg-yellow-200 rounded-sm"></span>
                        Prenotati
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="inline-block w-3 h-3 bg-red-300 rounded-sm"></span>
                        Completamente pieni
                    </div>
                </div>
            </div>
        </section>
    )
}
