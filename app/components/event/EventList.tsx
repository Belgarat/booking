import EventCard from './EventCard'
import {EventWithStats} from "@/types/enriched";

type Props = {
    events: EventWithStats[]
}

export default function EventList({ events }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map(event => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    )
}
