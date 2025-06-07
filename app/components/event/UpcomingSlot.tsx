import {ArrowDownOnSquareIcon} from "@heroicons/react/16/solid";
import Link from "next/link";
import {ArrowPathIcon} from "@heroicons/react/24/solid";
import {Pagination} from "@/app/components/common/Pagination";
import {format, parseISO} from "date-fns";
import {it} from "date-fns/locale";
import {BookingWithSlot} from "@/types/enriched";


const CONTAINER_STYLES = {
    base: "max-w-6xl mx-auto mt-4 bg-white rounded-lg shadow-xl p-6 sm:p-8 space-y-8 md:space-y-0 md:flex md:gap-8",
    content: "w-full mt-4 bg-white rounded shadow transition-all overflow-hidden duration-300 ease-in-out"
};

const SlotList: React.FC<{
    slots: BookingWithSlot[];
    onSlotClick: (date: Date) => void;
}> = ({ slots, onSlotClick }) => (
    <ul className="divide-y divide-gray-200 text-sm">
        {slots.map(slot => {
            const slotDate = parseISO(slot.event_slots.datetime);
            return (
                <li
                    key={slot.id}
                    className="py-2 cursor-pointer hover:bg-gray-100 rounded transition"
                    onClick={() => onSlotClick(slotDate)}
                >
                    <p className="text-gray-500 text-sm italic">
                        {slot.event_slots?.events?.title || 'Evento senza nome'}
                    </p>
                    <p className="font-medium text-gray-800">
                        {format(slotDate, 'dd MMM yyyy – HH:mm', { locale: it })}
                    </p>
                    <p className="text-gray-600">
                        {slot.name} – {slot.people} partecipant{slot.people > 1 ? 'i' : 'e'}
                    </p>
                </li>
            );
        })}
    </ul>
);

export const UpcomingSlot: React.FC<{
    showUpcoming: boolean;
    paginatedSlots: BookingWithSlot[];
    currentPage: number;
    totalPages: number;
    onToggle: () => void;
    onRefresh: () => void;
    onSlotSelect: (date: Date) => void;
    onPageChange: (page: number) => void;
}> = ({
          showUpcoming,
          paginatedSlots,
          currentPage,
          totalPages,
          onToggle,
          onRefresh,
          onSlotSelect,
          onPageChange
      }) => {
    const contentClassName = `${CONTAINER_STYLES.content} ${
        showUpcoming ? 'max-h-[500px] p-4 space-y-4' : 'max-h-12 p-4'
    } md:max-h-none md:p-4 md:space-y-4`;

    const handleSlotClick = (date: Date) => {
        onSlotSelect(date);
        document.getElementById('daypicker')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div id="upcomingSlot" className={CONTAINER_STYLES.base}>
            <div className={contentClassName}>
                <div className="sticky top-0 bg-white z-10 pb-2">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            className="underline flex items-center w-full text-left font-semibold text-gray-700"
                            onClick={onToggle}
                            aria-expanded={showUpcoming}
                            aria-controls="upcoming-slots"
                        >
                            <span>Prossimi slot</span>
                            <ArrowDownOnSquareIcon
                                className={`w-4 h-4 ml-2 transition-transform ${showUpcoming ? 'rotate-180' : ''}`}
                            />
                        </button>
                        <Link
                            href="#"
                            onClick={onRefresh}
                            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                            <ArrowPathIcon name="refresh" className="w-4 h-4 mr-2" />
                        </Link>
                    </div>
                </div>

                {paginatedSlots.length === 0 ? (
                    <p className="text-sm text-gray-500">Nessuno slot disponibile.</p>
                ) : (
                    showUpcoming && <SlotList slots={paginatedSlots} onSlotClick={handleSlotClick} />
                )}

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};