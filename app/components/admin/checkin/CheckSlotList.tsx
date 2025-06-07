'use client'
import { useMemo, useState } from 'react'
import { formatDateToItalianLocale } from '@/utils/date'
import { BookingWithSlot } from "@/types/enriched"
import { Pagination } from "@/app/components/common/Pagination"

const TEXTS = {
  TITLE: "Prenotazioni negli slot disponibili",
  EMPTY_TITLE: "Prenotazioni per gli slot",
  NO_BOOKINGS: "Nessuna prenotazione trovata.",
  SHOW_ALL: "Mostra tutti",
  UNNAMED_EVENT: "Evento senza nome",
  SLOT_TIME: "Orario Slot:",
  PERSON: "persona",
  PEOPLE: "persone",
  PRESENT: "Presente",
  NOT_PRESENT: "Non presente",
  MANAGE: "Gestisci"
} as const

const STYLES = {
  statusBadge: {
    base: "mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
    checked: "bg-green-100 text-green-800",
    unchecked: "bg-red-100 text-red-800",
    icon: {
      base: "-ml-0.5 mr-1.5 h-2 w-2",
      checked: "text-green-400",
      unchecked: "text-red-400"
    }
  },
  bookingItem: "border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-150 ease-in-out cursor-pointer",
  container: "space-y-6"
} as const

const PAGE_SIZE = 5

interface StatusBadgeProps {
  isCheckedIn: boolean
}

const StatusBadge = ({ isCheckedIn }: StatusBadgeProps) => (
  <span className={`${STYLES.statusBadge.base} ${isCheckedIn ? STYLES.statusBadge.checked : STYLES.statusBadge.unchecked}`}>
    <svg className={`${STYLES.statusBadge.icon.base} ${isCheckedIn ? STYLES.statusBadge.icon.checked : STYLES.statusBadge.icon.unchecked}`}
         fill="currentColor" viewBox="0 0 8 8">
      <circle cx="4" cy="4" r="3" />
    </svg>
    {isCheckedIn ? TEXTS.PRESENT : TEXTS.NOT_PRESENT}
  </span>
)

const useBookingsPagination = (slots: BookingWithSlot[], showOnlyNotCheckedIn: boolean) => {
  const sortedAndFilteredSlots = useMemo(() => {
    const filtered = showOnlyNotCheckedIn ? slots.filter(slot => !slot.checked_in) : slots
    return filtered.sort((a, b) => 
      new Date(a.event_slots.datetime).getTime() - new Date(b.event_slots.datetime).getTime()
    )
  }, [slots, showOnlyNotCheckedIn])

  const getPaginatedSlots = (currentPage: number) => {
    const start = (currentPage - 1) * PAGE_SIZE
    return sortedAndFilteredSlots.slice(start, start + PAGE_SIZE)
  }

  const getTotalPages = () => Math.ceil(sortedAndFilteredSlots.length / PAGE_SIZE)

  return { getPaginatedSlots, getTotalPages }
}

interface BookingItemProps {
  booking: BookingWithSlot
  onSelect: (booking: BookingWithSlot) => void
}

const BookingItem = ({ booking, onSelect }: BookingItemProps) => (
    <li
        className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        onClick={() => onSelect(booking)}
    >
      <div className="space-y-1 mb-2">
        <p className="text-sm text-gray-500 italic truncate">{booking.event_slots?.events?.title || TEXTS.UNNAMED_EVENT}</p>
        <p className="text-sm font-medium text-gray-900">{booking.name}</p>
        <p className="text-sm text-gray-600">{TEXTS.SLOT_TIME} {formatDateToItalianLocale(booking.event_slots.datetime)}</p>
        <p className="text-sm text-gray-500">{booking.people} {booking.people === 1 ? TEXTS.PERSON : TEXTS.PEOPLE}</p>
      </div>
      <div className="flex items-center justify-between">
        <StatusBadge isCheckedIn={booking.checked_in} />
        <button
            type="button"
            className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
        >
          {TEXTS.MANAGE}
        </button>
      </div>
    </li>

)

interface CheckinSlotListProps {
  slots: BookingWithSlot[]
  onSelectSlot: (booking: BookingWithSlot) => void
}

export default function CheckinSlotList({ slots, onSelectSlot }: CheckinSlotListProps) {
  const [showOnlyNotCheckedIn, setShowOnlyNotCheckedIn] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const { getPaginatedSlots, getTotalPages } = useBookingsPagination(slots, showOnlyNotCheckedIn)

  if (!slots?.length) {
    return (
      <section className={STYLES.container}>
        <h2 className="text-xl font-bold text-gray-800">{TEXTS.EMPTY_TITLE}</h2>
        <p className="text-gray-500">{TEXTS.NO_BOOKINGS}</p>
      </section>
    )
  }

  return (
    <section className={STYLES.container}>
      <div className="flex justify-between items-center">
        <label className="inline-flex items-center text-sm text-gray-700 space-x-2">
          <input type="checkbox"
                 checked={!showOnlyNotCheckedIn}
                 onChange={() => {
                   setShowOnlyNotCheckedIn(prev => !prev)
                   setCurrentPage(1)
                 }}
                 className="form-checkbox h-4 w-4 text-green-600"/>
          <span>{TEXTS.SHOW_ALL}</span>
        </label>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getPaginatedSlots(currentPage).map((booking) => (
          <BookingItem key={booking.id} booking={booking} onSelect={onSelectSlot}/>
        ))}
      </ul>
      <Pagination currentPage={currentPage} totalPages={getTotalPages()} onPageChange={setCurrentPage}/>
    </section>
  )
}