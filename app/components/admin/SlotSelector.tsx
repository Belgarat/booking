import React from 'react';

interface SlotSelectorProps {
    value: string;
    onChange: (value: string) => void;
    onAdd: () => void;
}

const SlotSelector: React.FC<SlotSelectorProps> = ({ value, onChange, onAdd }) => {
    return (
        <div className="flex items-center space-x-2">
            <input
                type="datetime-local"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border p-2 flex-1"
            />
            <button
                onClick={onAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Aggiungi Slot
            </button>
        </div>
    );
};

export default SlotSelector;
