import { NextRequest, NextResponse } from 'next/server'
import { MailerSend, Recipient, EmailParams } from 'mailersend'
import {formatDateToItalianLocale} from "@/utils/date";

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
    const body = await req.json()

    const {
        slotId,
        email,
        name,
        eventName,
        datetime,
        location,
        supportEmail = 'info@dolomitinerd.it',
    } = body

    if (!slotId || !email || !name || !eventName || !datetime || !location) {
        return NextResponse.json({ error: 'Dati mancanti' }, { status: 400 })
    }

    const mailersend = new MailerSend({
        apiKey: process.env.MAILERSEND_API_KEY!,
    })

    const recipients = [
        new Recipient(email, name)
    ]

    const personalization = [
        {
            email,
            data: {
                link: process.env.NEXT_HOST + '/event/booking/' + slotId + '?email=' + email,
                name,
                account: { name: 'DolomitiNerd' },
                plEvento: eventName,
                plDataOra: formatDateToItalianLocale(datetime),
                plLocation: location,
                support_email: supportEmail,
            },
        }
    ]

    const emailParams = new EmailParams()
        .setFrom({ email: 'info@dolomitinerd.it', name: 'DolomitiNerd' })
        .setTo(recipients)
        .setSubject('Conferma Prenotazione evento: ' + eventName)
        .setTemplateId('k68zxl205v5gj905')
        .setPersonalization(personalization)

    try {
        const result = await mailersend.email.send(emailParams)
        return NextResponse.json({ message: 'Email inviata', result })
    } catch (error: Error | unknown) {
        console.error('Errore email:', error)
        return NextResponse.json({ error: 'Errore durante invio email' }, { status: 500 })
    }
}
