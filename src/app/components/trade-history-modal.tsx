import {TradeHistory} from '../interface/TradeHistory';
import {useState} from 'react';
import {Player} from "@lottiefiles/react-lottie-player";

interface TradeHistoryModalProps {
    trade: TradeHistory | null;
    isOpen: boolean;
    onClose: () => void;
    lang: any;
}

export function TradeHistoryModal({ trade, isOpen, onClose }: TradeHistoryModalProps) {
    const [activeUser, setActiveUser] = useState<'user' | 'partner'>('user');

    if (!isOpen || !trade) return null;

    const handleUserClick = (user: 'user' | 'partner') => {
        setActiveUser(user);
    };

    const displayGifts = activeUser === 'user' ? trade.user_items : trade.partner_items;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40" onClick={onClose} />

            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] rounded-t-[30px] p-6 z-50 animate-slide-up max-w-[390px] mx-auto" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', maxHeight: '80vh' }}>
                {/* Header */}
                <div className="text-center mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[#595959] text-[14px]">{trade.created_at}</span>
                        <span className="text-[#595959] text-[14px]">{trade.user} ⇄ {trade.partner}</span>
                    </div>
                </div>

                {/* User Switcher */}
                <div
                    className="relative bg-[#505050] rounded-[25px] p-1 mb-4"
                    style={{
                        boxShadow: `
                            -0.8px 0 0 0 rgba(180, 180, 180, 0.35),
                            -0.8px -0.3px 0 0 rgba(180, 180, 180, 0.3),
                            -1.2px -0.6px 0 0 rgba(180, 180, 180, 0.2),
                            0.8px 0 0 0 rgba(180, 180, 180, 0.35),
                            0.8px 0.3px 0 0 rgba(180, 180, 180, 0.3),
                            1.2px 0.6px 0 0 rgba(180, 180, 180, 0.2)
                        `
                    }}
                >
                    {/* Sliding Background */}
                    <div
                        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#3A3A3A] rounded-[22px] transition-all duration-300 ease-in-out shadow-lg"
                        style={{
                            left: activeUser === 'user' ? '4px' : 'calc(50% + 0px)',
                            boxShadow: `
                                -0.8px 0 0 0 rgba(200, 200, 200, 0.4),
                                -0.8px -0.3px 0 0 rgba(200, 200, 200, 0.35),
                                -1.2px -0.6px 0 0 rgba(200, 200, 200, 0.25),
                                0.8px 0 0 0 rgba(200, 200, 200, 0.4),
                                0.8px 0.3px 0 0 rgba(200, 200, 200, 0.35),
                                1.2px 0.6px 0 0 rgba(200, 200, 200, 0.25)
                            `
                        }}
                    />

                    {/* Buttons */}
                    <div className="relative flex">
                        <button
                            onClick={() => handleUserClick('user')}
                            className={`flex-1 h-[44px] rounded-[22px] text-[16px] font-semibold transition-colors duration-300 z-10 ${
                                activeUser === 'user' ? 'text-white' : 'text-[#B3B3B3]'
                            }`}
                        >
                            {trade.user}
                        </button>
                        <button
                            onClick={() => handleUserClick('partner')}
                            className={`flex-1 h-[44px] rounded-[22px] text-[16px] font-semibold transition-colors duration-300 z-10 ${
                                activeUser === 'partner' ? 'text-white' : 'text-[#B3B3B3]'
                            }`}
                        >
                            {trade.partner}
                        </button>
                    </div>
                </div>

                {/* Gifts List - scrollable */}
                <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(80vh - 240px)' }}>
                    <div style={{ paddingBottom: '20px' }}>
                        {/* Gift Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            {displayGifts.map((gift, index) => (
                                <div
                                    key={index}
                                    className="aspect-square rounded-[15px] overflow-hidden relative bg-[#303030]"
                                >
                                    <div style={{ 
                                        borderRadius: '15px', 
                                        overflow: 'hidden', 
                                        width: '100%', 
                                        height: '100%', 
                                        clipPath: 'inset(0 round 15px)', 
                                        WebkitClipPath: 'inset(0 round 15px)' 
                                    }}>
                                        <Player
                                            autoplay={true}
                                            loop={true}
                                            src={gift.img}
                                            className="lottie-rounded-15"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                pointerEvents: 'none'
                                            }}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            pointerEvents: 'none',
                                            color: '#ffe823',
                                            fontSize: '10px',
                                            textAlign: 'center',
                                            padding: '2px'
                                        }}
                                    >
                                        {gift.title}
                                    </div>
                                </div>
                            ))}
                            {(() => {
                                const totalItems = displayGifts.length;
                                const minRows = 3;
                                const currentRows = Math.ceil(totalItems / 3);
                                const displayRows = Math.max(minRows, currentRows);
                                const totalCells = displayRows * 3;
                                const emptyCells = totalCells - totalItems;

                                return [...Array(emptyCells)].map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square rounded-[15px] bg-[#515151]" />
                                ));
                            })()}
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <div className="mt-4">
                    <button
                        onClick={onClose}
                        className="w-full rounded-[25px] h-[55px] text-white text-[18px] font-semibold"
                        style={{ backgroundColor: 'rgb(47, 47, 47)' }}
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </>
    );
}
