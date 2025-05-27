'use client'

import { useEffect, useState } from 'react'
import Modal from '@/app/components/common/Modal'
import CheckinHeaderActions from './CheckinHeaderActions' // Assicurati che questo componente esista
import { BookingWithSlot } from '@/types/enriched' // Il tuo tipo di slot

type Props = {
    isOpen: boolean
    onClose: () => void // Funzione per chiudere la modale e triggerare un refresh
    slot: BookingWithSlot // Lo slot di prenotazione, con dati di check-in e persone
    password: string // Password per le chiamate API
}

export default function CheckinModal({ isOpen, onClose, slot, password }: Props) {
    const [isSlotCheckedIn, setIsSlotCheckedIn] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    // Sincronizza lo stato locale di check-in con la prop 'slot' quando cambia.
    // Questo useEffect si esegue solo se la referenza dell'oggetto 'slot' cambia.
    useEffect(() => {
        if (slot) {
            setIsSlotCheckedIn(!!slot.checked_in)
        }
    }, [slot]) // Dipende dalla prop 'slot'

    // Gestore per il toggle del check-in dell'intero slot/gruppo
    const handleToggleSlotCheckin = async () => {
        if (!slot || !slot.id) return // Valida che lo slot e il suo ID siano disponibili

        const nextState = !isSlotCheckedIn // Calcola il prossimo stato di check-in
        setIsLoading(true) // Attiva lo stato di caricamento

        try {
            // Chiamata API per aggiornare lo stato di check-in dello slot
            const res = await fetch(`/api/bookings/${slot.id}/checkin`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: password, // Invia la password per l'autenticazione
                },
                body: JSON.stringify({ checked_in: nextState }), // Invia il nuovo stato
            })

            if (res.ok) {
                setIsSlotCheckedIn(nextState) // Aggiorna lo stato locale se la richiesta ha successo
                // Nota: la logica di refresh della lista principale è gestita in AdminCheckinPage
                // tramite la funzione `onClose` che qui viene richiamata.
            } else {
                // Gestione degli errori API: logga e potresti mostrare un feedback all'utente
                const errorText = await res.text();
                console.error('Errore durante l\'aggiornamento dello stato di check-in:', errorText);
                // TODO: Implementa una notifica utente, es. con useFeedback
            }
        } catch (error) {
            // Gestione degli errori di rete o altri errori imprevisti
            console.error('Errore durante la chiamata API di check-in:', error);
            // TODO: Implementa una notifica utente, es. con useFeedback
        } finally {
            setIsLoading(false) // Disattiva lo stato di caricamento indipendentemente dal successo
        }
    }

    // Estrai e formatta i dati dello slot per la visualizzazione
    const peopleCount = slot?.people || 0;
    const slotDateTime = slot?.event_slots?.datetime ? new Date(slot.event_slots?.datetime) : null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Dettaglio Check-in`} // Titolo più generico e descrittivo per la modale
            wide={true} // Permette alla modale di essere più larga
        >
            {/* Componente per le azioni nell'header della modale (es. pulsante di chiusura) */}
            <CheckinHeaderActions onClose={onClose} />

            {/* Contenuto principale della modale con padding e sfondo */}
            <div className="mt-4 space-y-5 p-4 sm:p-6 bg-white rounded-lg">
                {slot ? (
                    // Card dello slot con stile responsivo
                    <div className="border border-gray-200 rounded-lg p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-50 shadow-md">
                        {/* Sezione Informazioni dello Slot */}
                        <div className="flex-1 text-center md:text-left">
                            <p className="text-xl font-bold text-gray-900 mb-2">
                                {/* Visualizza l'ora dello slot e la data tra parentesi */}
                                Slot: {slotDateTime ? slotDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                {slotDateTime && <span className="text-base font-normal text-gray-600 ml-2">({slotDateTime.toLocaleDateString('it-IT')})</span>}
                            </p>
                            <p className="text-gray-500 text-sm italic">
                                {slot.event_slots?.events?.title || 'Evento senza nome'}
                            </p>
                            <p className="text-base text-gray-700 mb-1">
                                Persone prenotate: <span className="font-semibold text-lg">{peopleCount}</span>
                            </p>
                            <p className="text-sm font-medium">
                                Stato: <span className={`font-bold ${isSlotCheckedIn ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {isSlotCheckedIn ? 'Checked In' : 'In Attesa'}
                                </span>
                            </p>
                        </div>

                        {/* Sezione Pulsante Check-in/Check-out */}
                        <div className="w-full md:w-auto"> {/* Il pulsante prende tutta la larghezza su mobile */}
                            <button
                                onClick={handleToggleSlotCheckin}
                                disabled={isLoading} // Disabilita il pulsante durante il caricamento
                                className={`w-full px-8 py-3 rounded-xl text-white font-bold text-lg shadow-lg
                                    transform transition-all duration-300 ease-in-out
                                    ${isSlotCheckedIn
                                    ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                                    : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                                }
                                    ${isLoading ? 'opacity-60 cursor-not-allowed animate-pulse' : 'hover:scale-105'}
                                `}
                            >
                                {isLoading ? 'Caricamento...' : (isSlotCheckedIn ? 'Fai Check-out' : 'Fai Check-in')}
                            </button>
                        </div>
                    </div>
                ) : (
                    // Messaggio se non c'è uno slot selezionato
                    <p className="text-sm text-gray-500 text-center p-4">Nessuno slot selezionato per il check-in.</p>
                )}
            </div>
        </Modal>
    )
}