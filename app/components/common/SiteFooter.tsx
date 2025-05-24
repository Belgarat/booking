// app/components/common/SiteFooter.tsx
export default function SiteFooter() {
    return (
        <footer className="mt-12 border-t pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <div className="max-w-3xl mx-auto px-4 space-y-2">
                <p>
                    Questo sito non utilizza cookie né strumenti di tracciamento. I dati raccolti (nome, email,
                    numero di telefono) sono usati esclusivamente per finalità organizzative legate al torneo e
                    saranno eliminati al termine dell&apos;evento.
                </p>
                <p className="text-xs text-gray-400">
                    © {new Date().getFullYear()} Torneo organizzato dall&#39;associazione DolomitiNerd. Tutti i diritti riservati.
                </p>
            </div>
        </footer>
    )
}
