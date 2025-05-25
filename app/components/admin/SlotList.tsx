import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useState, useMemo } from "react";
import { SlotWithBookings } from "@/types/enriched";
import { formatDateToItalianLocale } from "@/utils/date";

interface SlotListProps {
    slots: SlotWithBookings[];
    maxPeoplePerSlot: number;
    onDeleteSlot: (slotId: string) => void;
}

export default function SlotList({ slots, maxPeoplePerSlot, onDeleteSlot }: SlotListProps) {
    const [expandedSlotId, setExpandedSlotId] = useState<string | null>(null);
    const [showOnlyWithBookings, setShowOnlyWithBookings] = useState(false);

    const filteredSlots = useMemo(() => {
        return showOnlyWithBookings ? slots.filter(s => s.bookings && s.bookings.length > 0) : slots;
    }, [showOnlyWithBookings, slots]);

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Lista slot</h2>
                <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <input
                        type="checkbox"
                        checked={showOnlyWithBookings}
                        onChange={() => setShowOnlyWithBookings(!showOnlyWithBookings)}
                        className="form-checkbox rounded text-blue-600"
                    />
                    <span>Solo con prenotazioni</span>
                </label>
            </div>

            {filteredSlots.length === 0 && (
                <p className="text-gray-500 text-sm italic">Nessuno slot da mostrare.</p>
            )}

            {filteredSlots.map((s) => {
                const booked = s.booked || 0;
                const remaining = maxPeoplePerSlot - booked;
                const isOpen = expandedSlotId === s.id;
                const isFull = remaining <= 0;
                const slotLabel = formatDateToItalianLocale(s.datetime);

                return (
                    <div key={s.id} className="border rounded-lg overflow-hidden">
                        <div
                            className={`flex justify-between items-center px-4 py-3 cursor-pointer ${
                                isFull ? 'bg-red-50 dark:bg-red-900' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => setExpandedSlotId(isOpen ? null : s.id)}
                            role="button"
                            aria-expanded={isOpen}
                        >
                            <div>
                                <p className="font-medium text-gray-800 dark:text-white">{slotLabel}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {booked} iscritti / {maxPeoplePerSlot} posti ({remaining} rimasti)
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteSlot(s.id);
                                    }}
                                    title="Elimina slot"
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>

                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    {isOpen ? 'Nascondi' : 'Mostra'}{" "}
                                    {isOpen ? (
                                        <ArrowUpIcon className="w-4 h-4" />
                                    ) : (
                                        <ArrowDownIcon className="w-4 h-4" />
                                    )}
                                </span>
                            </div>
                        </div>

                        {isOpen && s.bookings && s.bookings.length > 0 && (
                            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm">
                                <p className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Prenotazioni:</p>
                                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {s.bookings.map((b) => (
                                        <li
                                            key={b.id}
                                            className="py-2 grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-gray-700 dark:text-gray-100"
                                        >
                                            <span className="font-semibold">{b.name}</span>
                                            <span>{b.email}</span>
                                            <span>
                                                👥 {b.people} partecipant{b.people > 1 ? 'i' : 'e'}
                                                {b.phone && <span className="ml-2">📞 {b.phone}</span>}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            })}
        </section>
    );
}
