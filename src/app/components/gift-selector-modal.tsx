import { useState } from 'react';
import {Gift} from '../interface/Gift'
import {Player} from "@lottiefiles/react-lottie-player";
// @ts-ignore
import translates from '../../../translates';

interface GiftSelectorModalProps {
    availableGifts: Gift[],
    isOpen: boolean;
    onClose: () => void;
    onAddGift: (gift: Gift) => void;
    lang: any;
}


export function GiftSelectorModal({ availableGifts, isOpen, onClose, onAddGift, lang }: GiftSelectorModalProps) {
    const [selectedGifts, setSelectedGifts] = useState<string[]>([]);

    if (!isOpen) return null;

    const toggleItem = (giftId: string) => {
        if (selectedGifts.indexOf(giftId) !== -1) {
            setSelectedGifts(selectedGifts.filter(id => id != giftId));
        } else {
            setSelectedGifts([...selectedGifts, giftId]);
        }
    }

    const handleApply = () => {
        selectedGifts.forEach(giftId => {
            // @ts-ignore
            const gift = availableGifts.find(g => g.id == giftId);
            if (gift) {
                onAddGift(gift);
            }
        });
        setSelectedGifts([]);
        onClose();
    }

    const handleCancel = () => {
        setSelectedGifts([]);
        onClose();
    }

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40" onClick={handleCancel} />

            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] rounded-t-[30px] p-6 z-50 animate-slide-up max-w-[390px] mx-auto" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', maxHeight: '80vh' }}>
                <div className="text-center mb-6">
                    <p className="text-white text-[16px] leading-relaxed mb-4">
                        {lang.gift_selector.title}
                    </p>
                </div>

                {/* Gifts List - goes to bottom of screen */}
                <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(80vh - 180px)' }}>
                    <div className="space-y-3" style={{ paddingBottom: '100px' }}>
                        {availableGifts.map((gift, index) => (
                            <div
                                key={index}
                                onClick={() => toggleItem(gift.id.toString())}
                                className="flex items-center gap-4 cursor-pointer bg-[#303030] rounded-[15px] p-3"
                            >
                                {/* Checkbox */}
                                <img
                                    src={selectedGifts.includes(gift.id.toString()) ? '/images/1checkbox.png' : '/images/checkbox.png'}
                                    alt="checkbox"
                                    className="w-6 h-6 flex-shrink-0 ml-1"
                                    style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(98%) saturate(2618%) hue-rotate(200deg) brightness(102%) contrast(101%)' }}
                                />

                                {/* Gift Image */}
                                <Player
                                    autoplay={true}
                                    loop={true}
                                    src={gift.img}
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        objectFit: 'cover',
                                        pointerEvents: 'none'
                                    }}
                                />

                                {/* Gift Info */}
                                <div className="flex-1">
                                    <h3 className="text-white text-[16px] font-medium">{gift.title} #{gift.num}</h3>
                                    <p className="text-[#999] text-[12px]">{gift.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons - Overlay on top */}
                <div className="absolute bottom-0 left-0 right-0 flex gap-3 p-6 z-10 pointer-events-none" style={{ background: 'linear-gradient(to top, #1C1C1E 70%, transparent)' }}>
                    <button
                        onClick={handleCancel}
                        className="flex-1 rounded-[25px] h-[55px] text-white text-[18px] font-semibold pointer-events-auto"
                        style={{ backgroundColor: 'rgb(47, 47, 47)' }}
                    >
                        {lang.gift_selector.cancel_button}
                    </button>
                    <button
                        onClick={handleApply}
                        disabled={selectedGifts.length === 0}
                        className={`flex-1 rounded-[25px] h-[55px] text-white text-[18px] font-semibold pointer-events-auto ${
                            selectedGifts.length === 0
                                ? 'bg-[#515151] cursor-not-allowed'
                                : 'bg-[#007AFF]'
                        }`}
                    >
                        {lang.gift_selector.accept_button} ({selectedGifts.length})
                    </button>
                </div>
            </div>
        </>
    );
}
