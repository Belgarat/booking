// utils/date.ts
import { format, toZonedTime } from 'date-fns-tz'
import { it } from 'date-fns/locale'
import {isValid, parseISO} from "date-fns";

const ITALY_TIMEZONE = 'Europe/Rome'

/**
 * Converte un'ora UTC in una stringa leggibile in italiano (es. 21 giugno 2025 alle 18:00)
 */
export function formatDateToItalianLocale(datetime: string | Date): string {
    const date = typeof datetime === 'string' ? parseISO(datetime) : datetime
    if (!isValid(date)) return 'Data non valida'

    const zoned = toZonedTime(date, ITALY_TIMEZONE)
    return format(zoned, "d MMMM yyyy 'alle' HH:mm", {
        timeZone: ITALY_TIMEZONE,
        locale: it,
    })
}


/**
 * Converte una stringa locale da input type="datetime-local" in UTC ISO string
 */
export function toUTCISOString(localDateTime: string): string {
    return new Date(localDateTime).toISOString()
}

export function formatDateSafe(datetime?: string | Date): string {
    if (!datetime) return '-'
    try {
        return formatDateToItalianLocale(datetime)
    } catch {
        return datetime?.toString() || '-'
    }
}
// Utility per formattare le date (puoi anche metterla in `utils/date.ts`)
export function formatDateLabel(dateString: string) {
    const date = new Date(dateString)
    return format(date, "EEEE dd/MM/yyyy", { locale: it })
}

/**
 * Converte un input datetime-local in ISO con offset +00:00 (no Zulu)
 * Es: 2025-06-15T08:00:00+00:00
 */
export function toISOStringWithOffset(dateString: string): string {
    const date = new Date(dateString)
    const zoned = toZonedTime(date, 'UTC') // Fissiamo l'offset a +00:00
    return format(zoned, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: 'UTC' })
}