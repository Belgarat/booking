import {EventWithStats} from "@/types/enriched";
type Props = {
    event: EventWithStats
}

export default function EventCard({ event }: Props) {
    return (
        <div className="rounded-lg shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition">
            <img
                src={event.image_url || `https://placehold.co/600x300?text=Evento`}
                alt={event.title}
                className="w-full h-84 object-cover"
            />
            <div className="p-4 space-y-2">
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Creato il: {new Date(event.created_at).toLocaleString()}
                </p>

                {event.description && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm">{event.description}</p>
                )}

                <div className="text-sm">
                    {event.totalMax <= 0 && (
                        <span className="text-orange-500 font-medium">Slot non ancora disponibili</span>
                    )}
                    {event.remaining <= 0 && event.totalMax > 0 && (
                        <span className="text-red-500 font-medium">
              Tutti i slot sono occupati ({event.totalMax} iscritti)
            </span>
                    )}
                    {event.remaining > 0 && (
                        <span className="text-green-600 dark:text-green-400 font-medium">
              Iscritti {event.totalBooked}, posti rimasti {event.remaining}
            </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                    <a
                        href={`/event/${event.id}`}
                        target="_blank"
                        className="text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
                    >
                        Vai alla pagina evento →
                    </a>
                    {event.website_url && (
                        <a
                            href={event.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 dark:text-purple-400 underline hover:text-purple-800 dark:hover:text-purple-300"
                        >
                            🌐 Sito ufficiale
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
