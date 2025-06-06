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
    onCancel: () => void
}

export default function EditEventModal({
                                           isOpen,
                                           onClose,
                                           formData,
                                           saving,
                                           onChange,
                                           onSave,
                                           onCancel
                                       }: Props) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                onCancel()
                onClose()
            }}
            title="Modifica evento"
        >
            <AdminEventForm
                title={formData.title}
                description={formData.description || ''}
                location={formData.location || ''}
                image_url={formData.image_url || ''}
                website_url={formData.website_url || ''}
                max_people_per_slot={formData.max_people_per_slot}
                start_event={formData.start_event || new Date().toISOString()}
                end_event={formData.end_event || new Date().toISOString()}
                editing
                saving={saving}
                onChange={onChange}
                onSave={onSave}
                onCancel={onCancel}
            />
        </Modal>
    )
}
