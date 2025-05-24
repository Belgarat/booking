// components/SlotList.tsx
import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import {SlotWithBookings} from "@/types/enriched";

interface SlotListProps {
    slots: SlotWithBookings[];
    maxPeoplePerSlot: number;
    onDeleteSlot: (slotId: string) => void;
}

export default function SlotList({ slots, maxPeoplePerSlot, onDeleteSlot }: SlotListProps) {
    const [expandedSlotId, setExpandedSlotId] = useState<string | null>(null);

    return (
        <ul className="space-y-2">
            <h2 className="text-xl font-bold">Lista slot:</h2>
            {slots.map((s) => {
                const booked = s.booked || 0;
                const max = maxPeoplePerSlot;
                const remaining = max - booked;
                const isOpen = expandedSlotId === s.id;

                return (
                    <li key={s.id} className="border p-3 rounded space-y-2">
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => setExpandedSlotId(isOpen ? null : s.id)}
                        >
                            <div>
                                <div className="font-medium">{new Date(s.datetime).toLocaleString()}</div>
                                <div className="text-sm text-gray-600">
                                    {booked} iscritti / {max} posti disponibili ({remaining} rimasti)
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteSlot(s.id);
                                    }}
                                    className="text-red-500 text-sm"
                                >
                                    <TrashIcon className="w-4 h-4" aria-hidden="true" />
                                </button>
                                <span className="text-gray-500 flex flex-col items-center">
                                    Dettagli {isOpen ? <ArrowUpIcon className="w-4 h-4"/> : <ArrowDownIcon className="w-4 h-4"/>}
                                </span>
                            </div>
                        </div>

                        {isOpen && s.bookings && s.bookings.length > 0 && (
                            <div className="mt-2 bg-gray-50 dark:bg-gray-800 rounded p-3 space-y-1 text-sm">
                                <p className="font-medium text-gray-700 dark:text-gray-200">Prenotazioni:</p>
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {s.bookings.map((b) => (
                                        <li key={b.id} className="py-1 flex flex-col md:flex-row md:items-center md:gap-4">
                                            <span className="font-semibold">{b.name}</span>
                                            <span className="text-gray-500">{b.email}</span>
                                            {b.phone && <span className="text-gray-500">📞 {b.phone}</span>}
                                            <span>👥 {b.people} partecipant{b.people > 1 ? 'i' : 'e'}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}