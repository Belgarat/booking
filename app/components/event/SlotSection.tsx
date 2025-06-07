import CheckinSlotList from "@/app/components/admin/checkin/CheckSlotList";
import FeedbackMessage from "@/app/components/common/FeedbackMessage";
import {format} from "date-fns";
import {it} from "date-fns/locale";
import {FeedbackVariant} from "@/hooks/useFeedback";
import {BookingWithSlot} from "@/types/enriched";

type SlotSectionProps = {
    selectedDate: Date | null;
    slots: Array<BookingWithSlot>;
    feedback: {
        text: string;
        variant: FeedbackVariant;
    } | null;
    handleOpenSlot: (slot: BookingWithSlot) => void;
};

export const SlotSection = ({ selectedDate, slots, feedback, handleOpenSlot }: SlotSectionProps) => {
    const getFormattedDate = (date: Date | null) => (
        date ? format(date, 'dd MMMM yyyy', { locale: it }) : 'la data selezionata'
    );

    const hasNoSlots = slots.length === 0;
    const shouldShowEmptyMessage = hasNoSlots && !feedback && selectedDate;

    return (
        <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Slot per {getFormattedDate(selectedDate)}
            </h2>

            {shouldShowEmptyMessage && (
                <p className="text-gray-500 text-center p-4">
                    Nessuna prenotazione trovata per il giorno selezionato.
                </p>
            )}

            {!hasNoSlots && (
                <CheckinSlotList
                    slots={slots}
                    onSelectSlot={handleOpenSlot}
                />
            )}

            {feedback && (
                <FeedbackMessage
                    message={feedback.text}
                    variant={feedback.variant}
                />
            )}
        </section>
    );
};