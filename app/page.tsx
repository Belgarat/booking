// app/page.tsx
export const metadata = {
    title: 'Eventi Dolomiti Nerd – Iscriviti ora',
    description:
        'Partecipa agli eventi ufficiali di Dolomiti Nerd: tornei, sessioni di gioco, fiere e attività nerd in Triveneto.',
    openGraph: {
        title: 'Eventi Dolomiti Nerd – Iscriviti ora',
        description:
            'Scopri il calendario eventi di Dolomiti Nerd e iscriviti facilmente online. Entra nella community e vivi la tua passione nerd!',
        url: 'https://eventi.dolomitinerd.it',
        siteName: 'Dolomiti Nerd',
        images: [
            {
                url: 'https://eventi.dolomitinerd.it/og-cover.jpg',
                width: 1200,
                height: 630,
                alt: 'Dolomiti Nerd Eventi - Iscriviti ora',
            },
        ],
        locale: 'it_IT',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        site: '@DolomitiNerd', // se hai un account Twitter/X ufficiale
        title: 'Eventi Dolomiti Nerd – Iscriviti ora',
        description:
            'Iscriviti subito agli eventi nerd più epici del Triveneto. Tornei, giochi da tavolo, cosplay e molto altro!',
        images: ['https://eventi.dolomitinerd.it/og-cover.jpg'],
    },
}


export default function HomePage() {
  return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Benvenuto nella prenotazione eventi</h1>
        <p>Visita <a className="text-blue-500 underline" href="/admin">/admin</a> per il pannello admin</p>
      </main>
  )
}
