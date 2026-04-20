// @ts-ignore
import translates from '../../../translates';
interface DeleteGiftModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    lang: any;
}

export function DeleteGiftModal({ isOpen, onClose, onConfirm, lang }: DeleteGiftModalProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    // @ts-ignore
    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40" onClick={onClose} />

            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] rounded-t-[30px] p-6 z-50 animate-slide-up max-w-[390px] mx-auto" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div className="text-center mb-6">
                    <p className="text-white text-[22px] font-semibold mb-2">
                        {lang.delete_gift.confirm_title}
                    </p>
                    <p className="text-[#999] text-[15px]">
                        {lang.delete_gift.confirm_text}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-[25px] h-[55px] text-white text-[18px] font-semibold"
                        style={{ backgroundColor: 'rgb(47, 47, 47)' }}
                    >
                        {lang.delete_gift.confirm_button}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 bg-[#FF3B30] rounded-[25px] h-[55px] text-white text-[18px] font-semibold"
                    >
                        {lang.delete_gift.delete_button}
                    </button>
                </div>
            </div>
        </>
    );
}
