export type Event = {
    id: string
    title: string
    description?: string
    location?: string
}

export type EventSlot = {
    id: string
    event_id: string
    datetime: string
}

export type EventFormField = 'title' | 'description' | 'location' | 'imageUrl' | 'websiteUrl' | 'maxPeople';
export type EventFormValue = string | number;
