'use client'

import Modal from '@/app/components/common/Modal'
import AdminEventForm from './AdminEventForm'
import { EventFormValue } from '@/types'
import { EventBase } from '@/types/event'

type Props = {
    isOpen: boolean
    onClose: () => void
    formData: EventBase
    saving: boolean
    onChange: (field: string, value: EventFormValue) => void
    onSave: () => void
}

export default function CreateEventModal({
                                             isOpen,
                                             onClose,
                                             formData,
                                             saving,
                                             onChange,
                                             onSave
                                         }: Props) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Crea nuovo evento">
            <AdminEventForm
                title={formData.title}
                description={formData.description || ''}
                location={formData.location || ''}
                image_url={formData.image_url || ''}
                website_url={formData.website_url || ''}
                max_people_per_slot={formData.max_people_per_slot}
                start_event={formData.start_event || new Date().toISOString()}
                end_event={formData.end_event || new Date().toISOString()}
                editing={false}
                saving={saving}
                onChange={onChange}
                onSave={onSave}
            />
        </Modal>
    )
}
