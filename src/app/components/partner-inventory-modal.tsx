import {Gift} from '../interface/Gift'
import {Player} from "@lottiefiles/react-lottie-player";
// @ts-ignore
import translates from '../../../translates';

interface PartnerInventoryModalProps {
    partnerGifts: Gift[];
    selectedGifts: Gift[];
    isOpen: boolean;
    onClose: () => void;
    lang: any;
}

export function PartnerInventoryModal({ partnerGifts, selectedGifts, isOpen, onClose, lang }: PartnerInventoryModalProps) {
    if (!isOpen) return null;

    // Проверяем, добавлен ли подарок в трейд
    const isGiftSelected = (giftId: string | number) => {
        return selectedGifts.some(g => g.id === giftId);
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40" onClick={onClose} />

            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] rounded-t-[30px] p-6 z-50 animate-slide-up max-w-[390px] mx-auto" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', maxHeight: '80vh' }}>
                <div className="text-center mb-6">
                    <p className="text-white text-[16px] leading-relaxed mb-4">
                        {lang.partner_inventory.title}
                    </p>
                </div>

                {/* Gifts List - goes to bottom of screen */}
                <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(80vh - 180px)' }}>
                    <div className="space-y-3" style={{ paddingBottom: '100px' }}>
                        {partnerGifts.map((gift, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 bg-[#303030] rounded-[15px] p-3"
                            >
                                {/* Checkbox - показываем галочку если подарок в трейде */}
                                <img
                                    src={isGiftSelected(gift.id) ? '/images/1checkbox.png' : '/images/checkbox.png'}
                                    alt="checkbox"
                                    className="w-6 h-6 flex-shrink-0 ml-1"
                                    style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(98%) saturate(2618%) hue-rotate(200deg) brightness(102%) contrast(101%)' }}
                                />

                                {/* Gift Image */}
                                <Player
                                    autoplay={true}
                                    loop={true}
                                    src={gift.animation}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        pointerEvents: 'none'
                                    }}
                                />

                                {/* Gift Info */}
                                <div className="flex-1">
                                    <h3 className="text-white text-[16px] font-medium">{gift.title}</h3>
                                    <p className="text-[#999] text-[12px]">#{gift.num}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Close Button - Overlay on top */}
                <div className="absolute bottom-0 left-0 right-0 flex gap-3 p-6 z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, #1C1C1E 70%, transparent)' }}>
                    <button
                        onClick={onClose}
                        className="w-full rounded-[25px] h-[55px] text-white text-[18px] font-semibold pointer-events-auto"
                        style={{ backgroundColor: 'rgb(47, 47, 47)' }}
                    >
                        {lang.partner_inventory.close_button}
                    </button>
                </div>
            </div>
        </>
    );
}
