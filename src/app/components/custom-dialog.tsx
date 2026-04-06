interface CustomDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'alert';
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
}

export function CustomDialog({ 
    isOpen, 
    title, 
    message, 
    type, 
    onConfirm, 
    onCancel,
    confirmText = 'Принять',
    cancelText = 'Отмена'
}: CustomDialogProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm?.();
    };

    const handleCancel = () => {
        onCancel?.();
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40" 
                onClick={type === 'alert' ? handleConfirm : handleCancel} 
            />

            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] rounded-t-[30px] p-6 z-50 animate-slide-up max-w-[390px] mx-auto" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="text-center mb-6">
                    <p className="text-white text-[22px] font-semibold mb-2">
                        {title}
                    </p>
                    <p className="text-[#999] text-[15px]">
                        {message}
                    </p>
                </div>

                {/* Action Buttons */}
                {type === 'confirm' ? (
                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="flex-1 rounded-[25px] h-[55px] text-white text-[18px] font-semibold"
                            style={{ backgroundColor: 'rgb(47, 47, 47)' }}
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 bg-[#007AFF] rounded-[25px] h-[55px] text-white text-[18px] font-semibold"
                        >
                            {confirmText}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleConfirm}
                        className="w-full bg-[#007AFF] rounded-[25px] h-[55px] text-white text-[18px] font-semibold"
                    >
                        OK
                    </button>
                )}
            </div>
        </>
    );
}
