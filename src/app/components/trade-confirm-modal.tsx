interface TradeConfirmModalProps {
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function TradeConfirmModal({ title, message, confirmText, cancelText, onConfirm, onCancel }: TradeConfirmModalProps) {
    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-50" onClick={onCancel} />

            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] rounded-t-[30px] p-6 z-50 animate-slide-up max-w-[390px] mx-auto" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                {/* Title */}
                <h2 className="text-white text-[24px] font-semibold text-center mb-4">{title}</h2>
                
                {/* Message */}
                <p className="text-[#999] text-[16px] text-center mb-6 leading-relaxed">
                    {message}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-transparent border-2 border-[#999] rounded-[25px] h-[55px] text-[#999] text-[18px] font-semibold hover:border-white hover:text-white transition-colors"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-[#007AFF] rounded-[25px] h-[55px] text-white text-[18px] font-semibold hover:bg-[#0066CC] transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </>
    );
}
