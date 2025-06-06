'use client'
import {EventFormValue} from "@/types";
import {format, parseISO} from "date-fns";
import {toISOStringWithOffset} from "@/utils/date";
type Props = {
    title: string
    description: string
    location: string
    image_url: string
    website_url: string
    max_people_per_slot: number
    start_event: string
    end_event: string
    editing: boolean
    saving: boolean
    onChange: (field: string, value: EventFormValue) => void
    onSave: () => void
    onCancel?: () => void
}

export default function AdminEventForm({
                                           title,
                                           description,
                                           location,
                                           image_url,
                                           website_url,
                                           max_people_per_slot,
                                           start_event,
                                           end_event,
                                           editing,
                                           saving,
                                           onChange,
                                           onSave,
                                           onCancel,
                                       }: Props) {

    return (
        <div className="space-y-2 pt-6">
            <h2 className="text-xl font-bold">
                {editing ? 'Modifica evento' : 'Crea nuovo evento'}
            </h2>

            <input
                value={title}
                onChange={(e) => onChange('title', e.target.value)}
                placeholder="Titolo evento"
                className="border p-2 w-full"
            />
            <textarea
                value={description}
                onChange={(e) => onChange('description', e.target.value)}
                placeholder="Descrizione"
                className="border p-2 w-full"
                rows={4}
            />
            <input
                value={location}
                onChange={(e) => onChange('location', e.target.value)}
                placeholder="Luogo"
                className="border p-2 w-full"
            />
            <input
                value={image_url}
                onChange={(e) => onChange('image_url', e.target.value)}
                placeholder="URL immagine header"
                className="border p-2 w-full"
            />
            <input
                type="url"
                value={website_url}
                onChange={(e) => onChange('website_url', e.target.value)}
                placeholder="URL sito web (opzionale)"
                className="border p-2 w-full"
            />
            <input
                type="number"
                min={1}
                value={max_people_per_slot}
                onChange={(e) => onChange('max_people_per_slot', Number(e.target.value))}
                placeholder="Posti massimi per slot"
                className="border p-2 w-full"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Inizio evento</label>
                    <input
                        type="datetime-local"
                        value={format(parseISO(start_event), "yyyy-MM-dd'T'HH:mm")}
                        onChange={(e) => onChange('start_event', toISOStringWithOffset(e.target.value))}
                        className="border p-2 w-full rounded"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fine evento</label>
                    <input
                        type="datetime-local"
                        value={format(parseISO(end_event), "yyyy-MM-dd'T'HH:mm")}
                        onChange={(e) => onChange('end_event', toISOStringWithOffset(e.target.value))}
                        className="border p-2 w-full rounded"
                    />
                </div>
            </div>
            <button
                onClick={onSave}
                className={`px-4 py-2 rounded w-full text-white ${
                    editing ? 'bg-yellow-600' : 'bg-green-600'
                } disabled:opacity-50`}
                disabled={!title || !description || !location || !image_url || !max_people_per_slot || saving}
            >
                {editing ? 'Salva Modifiche' : 'Crea Evento'}
            </button>

            {editing && (
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-sm text-gray-500 hover:underline mt-2"
                    >
                        Annulla modifica
                    </button>
                </div>
            )}

        </div>
    )
}
