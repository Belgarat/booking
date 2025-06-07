export interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-between text-sm">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="text-blue-600 disabled:text-gray-400"
            >
                ← Indietro
            </button>
            <span>Pagina {currentPage} di {totalPages}</span>
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="text-blue-600 disabled:text-gray-400"
            >
                Avanti →
            </button>
        </div>
    )
}