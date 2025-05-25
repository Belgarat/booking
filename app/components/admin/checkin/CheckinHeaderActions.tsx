'use client'

type Props = {
    onClose: () => void
    onExport?: () => void
    onPrint?: () => void
}

export default function CheckinHeaderActions({ onClose, onExport, onPrint }: Props) {
    return (
        <div className="flex justify-end space-x-2">
            {onPrint && (
                <button
                    onClick={onPrint}
                    className="bg-white border px-3 py-1 text-sm rounded hover:bg-gray-50"
                >
                    🖨️ Stampa
                </button>
            )}
            {onExport && (
                <button
                    onClick={onExport}
                    className="bg-white border px-3 py-1 text-sm rounded hover:bg-gray-50"
                >
                    📁 Esporta
                </button>
            )}
            <button
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 text-sm rounded"
            >
                ✖ Chiudi
            </button>
        </div>
    )
}
