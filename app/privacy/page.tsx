'use client'

export default function PrivacyPage() {
    return (
        <main className="max-w-2xl mx-auto px-6 py-10 text-gray-800 dark:text-white space-y-6">
            <h1 className="text-3xl font-bold">Informativa sulla Privacy</h1>

            <p>
                Ai sensi del Regolamento UE 2016/679 (GDPR), desideriamo informarti che i dati personali da te forniti
                tramite il modulo di prenotazione verranno trattati nel rispetto dei principi di liceità, correttezza e
                trasparenza.
            </p>

            <h2 className="text-xl font-semibold mt-6">Titolare del trattamento</h2>
            <p>
                Il titolare del trattamento DolomitiNerd (info@dolomitinerd.it) è l&#39;organizzatore dell’evento, contattabile tramite l’email indicata nella
                pagina di prenotazione.
            </p>

            <h2 className="text-xl font-semibold mt-6">Dati raccolti</h2>
            <p>
                I dati raccolti comprendono: nome, cognome, email, e numero di telefono (facoltativo).
            </p>

            <h2 className="text-xl font-semibold mt-6">Finalità del trattamento</h2>
            <p>
                I dati saranno utilizzati esclusivamente per gestire la prenotazione e comunicazioni organizzative
                relative al torneo. Non saranno inviati messaggi pubblicitari né utilizzati per fini diversi da quelli
                dichiarati.
            </p>

            <h2 className="text-xl font-semibold mt-6">Durata della conservazione</h2>
            <p>
                I dati verranno conservati esclusivamente per il periodo necessario alla gestione dell’evento e saranno
                cancellati al termine dello stesso.
            </p>

            <h2 className="text-xl font-semibold mt-6">Trattamento dei dati</h2>
            <p>
                I dati non saranno ceduti a terzi e saranno trattati con misure di sicurezza adeguate per garantirne
                l’integrità e la riservatezza.
            </p>

            <h2 className="text-xl font-semibold mt-6">Cookie e tracciamento</h2>
            <p>
                Questo sito non utilizza cookie né strumenti di tracciamento (come Google Analytics).
            </p>

            <h2 className="text-xl font-semibold mt-6">Diritti dell’interessato</h2>
            <p>
                Puoi esercitare i tuoi diritti di accesso, rettifica, cancellazione o opposizione al trattamento dei dati
                scrivendo all’indirizzo email fornito al momento della prenotazione.
            </p>
        </main>
    )
}
