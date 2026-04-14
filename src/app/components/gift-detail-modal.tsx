import {Player} from "@lottiefiles/react-lottie-player";
// @ts-ignore
import translates from '../../../translates';
interface GiftDetailModalProps {
    gift: {
        id: string;
        title: string;
        num: string;
        img: string;
        attributes2: {
            model: { name: string; rarity: string };
            pattern: { name: string; rarity: string };
            backdrop: { name: string; rarity: string };
        };
    } | null;
    onClose: () => void;
}

export function GiftDetailModal({ gift, onClose }: GiftDetailModalProps) {
    if (!gift) return null;
    const lang = translates[localStorage.getItem('lang') ?? 'ru'];

    // @ts-ignore
    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40" onClick={onClose} />

            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] rounded-t-[30px] p-6 z-50 animate-slide-up max-w-[390px] mx-auto" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                {/* Gift Image and Title */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-[160px] h-[160px] rounded-[30px] overflow-hidden mb-4 relative">
                        <Player
                            autoplay={true}
                            loop={true}
                            src={gift.img}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                pointerEvents: 'none'
                            }}
                        />
                        {/* Overlay with title and ID */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                            <h2 className="text-white text-[18px] font-semibold text-center">{gift.title} #{gift.num}</h2>
                            <p className="text-white text-[14px] text-center">#{gift.id}</p>
                        </div>
                    </div>
                </div>

                {/* Gift Attributes */}
                <div style={{ backgroundColor: '#2F2F2F' }} className="rounded-[20px] p-4">
                    {/* Model */}
                    <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <span className="text-[#999] text-[16px]">{lang.gift_detail.model}</span>
                        <div className="text-right">
                            <p className="text-[#007AFF] text-[16px] font-medium">{gift.attributes2.model.name}</p>
                            <p className="text-[#999] text-[14px]">{gift.attributes2.model.rarity}</p>
                        </div>
                    </div>

                    {/* Pattern */}
                    <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <span className="text-[#999] text-[16px]">{lang.gift_detail.symbol}</span>
                        <div className="text-right">
                            <p className="text-[#007AFF] text-[16px] font-medium">{gift.attributes2.pattern.name}</p>
                            <p className="text-[#999] text-[14px]">{gift.attributes2.pattern.rarity}</p>
                        </div>
                    </div>

                    {/* Backdrop */}
                    <div className="flex items-center justify-between">
                        <span className="text-[#999] text-[16px]">{lang.gift_detail.backdrop}</span>
                        <div className="text-right">
                            <p className="text-[#007AFF] text-[16px] font-medium">{gift.attributes2.backdrop.name}</p>
                            <p className="text-[#999] text-[14px]">{gift.attributes2.backdrop.rarity}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
