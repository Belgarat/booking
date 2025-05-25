import { CheckinParticipant } from '@/types/checkin'

type Props = {
    participant: CheckinParticipant
    onTogglePresent: () => void
    loading?: boolean
}

export default function ParticipantRow({ participant, onTogglePresent, loading = false }: Props) {
    return (
        <div
            className={`flex items-center justify-between p-3 border rounded ${
                participant.present ? 'bg-green-50 dark:bg-green-900' : ''
            }`}
        >
            <div className="flex flex-col">
                <span className="font-medium">{participant.name}</span>
                <span className="text-sm text-gray-500">{participant.email}</span>
                {participant.phone && <span className="text-sm text-gray-500">📞 {participant.phone}</span>}
                <span className="text-sm">👥 {participant.people} partecipant{participant.people > 1 ? 'i' : 'e'}</span>
            </div>

            <button
                onClick={onTogglePresent}
                disabled={loading}
                className={`px-3 py-1 text-sm rounded transition ${
                    participant.present
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-white'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? '...' : participant.present ? 'Check-out' : 'Check-in'}
            </button>
        </div>
    )
}
