import { useState } from 'react'
import { EventBase } from '@/types/event'

const initialEventState: EventBase = {
    title: '',
    description: '',
    location: '',
    image_url: '',
    website_url: '',
    max_people_per_slot: 1,
    id: '',
    created_at: ''
}

export function useEventForm() {
    const [formData, setFormData] = useState<EventBase>(initialEventState)

    const updateField = (field: string, value: string | number) => {
        setFormData((prev: EventBase) => ({
            ...prev,
            [field]: value
        }))
    }

    return {
        formData,
        updateField,
        resetForm: () => setFormData(initialEventState)
    }
}
