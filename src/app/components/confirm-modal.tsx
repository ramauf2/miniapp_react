interface ConfirmModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export function ConfirmModal({ title, message, onConfirm, onCancel, confirmText, cancelText }: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#303030] rounded-[20px] p-6 mx-4 max-w-[340px] w-full">
                <h2 className="text-white text-[24px] font-semibold text-center mb-3">
                    {title}
                </h2>
                <p className="text-[#999] text-[16px] text-center mb-8">
                    {message}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 h-[55px] rounded-[25px] bg-[rgba(255,255,255,0.1)] text-white text-[18px] font-semibold"
                    >
                        {cancelText || 'No'}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 h-[55px] rounded-[25px] bg-[#007AFF] text-white text-[18px] font-semibold"
                    >
                        {confirmText || (title.includes('Accept') ? 'Yes, accept' : 'Yes, cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
}
