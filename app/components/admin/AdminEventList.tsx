'use client'

import {EventWithStats} from "@/types/enriched";

type Props = {
    events: EventWithStats[]
    selectedEventId: string | null
    onSelect: (event: EventWithStats) => void
    onEdit: (event: EventWithStats) => void
    onDelete: (eventId: string) => void
}

export default function AdminEventList({
                                           events,
                                           selectedEventId,
                                           onSelect,
                                           onEdit,
                                           onDelete,
                                       }: Props) {
    return (
        <section className="space-y-4">
            <h2 className="text-xl font-bold">Eventi</h2>
            <ul className="space-y-2">
                {events.length === 0 && <p className="text-gray-500">Nessun evento inserito</p>}
                {events.map((e) => (
                    <li
                        key={e.id}
                        className={`p-2 border rounded ${
                            selectedEventId === e.id ? 'bg-blue-100' : ''
                        }`}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-medium">{e.title}</span>
                            <div className="flex items-center space-x-2">
                                <button
                                    title="Dettagli"
                                    onClick={() => onSelect(e)}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    Dettagli
                                </button>

                                <button
                                    title="Modifica"
                                    onClick={() => onEdit(e)}
                                    className="text-gray-600 text-sm"
                                >
                                    ✏️
                                </button>

                                <a
                                    href={`/event/${e.id}`}
                                    target="_blank"
                                    title="Vai alla landing"
                                    className="text-green-600 text-sm"
                                >
                                    🌐
                                </a>

                                <button
                                    title="Elimina"
                                    onClick={() => onDelete(e.id)}
                                    className="text-red-500 text-sm"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}
