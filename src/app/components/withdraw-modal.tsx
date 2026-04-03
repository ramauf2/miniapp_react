import { useEffect, useState } from "react";
import { Gift } from '../interface/Gift'
import User from '../User';
import Gifts from '../Gifts';
import { TON_WITHDRAW_ITEM_FEE } from '../../../config';
import { TonIcon } from './ton-icon';


export function WithdrawModal({ onClose, authData }) {
    const [selectedGifts, setSelectedGifts] = useState([]);
    const [gifts, setGifts] = useState([]);
    const withdrawAmount = (selectedGifts.length * TON_WITHDRAW_ITEM_FEE).toFixed(1);
    const [refreshCounter, setRefreshCounter] = useState(0);

    const giftCount = gifts.length;
    const maxVisibleGifts = 5;
    const visibleGifts = Math.min(giftCount, maxVisibleGifts);
    const giftCardHeight = 92;
    const headerHeight = 120;
    const buttonHeight = 100;
    const modalHeight = headerHeight + (visibleGifts * giftCardHeight) + buttonHeight;
    const maxModalHeight = window.innerHeight * 0.8;
    const finalModalHeight = Math.min(modalHeight, maxModalHeight);

    useEffect(() => {
        getData()
    }, [refreshCounter])


    const getData = () => {
        Gifts.getUserGifts(authData['bearerToken']).then(gifts => {
            if (!gifts.success) {
                return;
            }
            const giftsList = [];
            for (let gift of gifts.data.self.filter(i => (i.status == 'active'))) {
                const model = gift.attributes.find(i => i.class === 'StarGiftAttributeModel');
                const pattern = gift.attributes.find(i => i.class === 'StarGiftAttributePattern');
                const backdrop = gift.attributes.find(i => i.class === 'StarGiftAttributeBackdrop');
                let attributes = {
                    'model': {
                        name: model.name,
                        rarity: (model.rarity / 10).toFixed(1) + ' %',
                    },
                    'pattern': {
                        name: pattern.name,
                        rarity: (pattern.rarity / 10).toFixed(1) + ' %',
                    },
                    'backdrop': {
                        name: backdrop.name,
                        rarity: (backdrop.rarity / 10).toFixed(1) + ' %',
                    },
                };
                giftsList.push({
                    id: gift.id,
                    title: gift.title,
                    img: gift.img,
                    attributes: gift.attributes,
                    attributes2: attributes,
                });

            }
            setGifts(giftsList);
        })
    }


    const toggleItem = (giftId) => {
        if (selectedGifts.indexOf(giftId) !== -1) {
            setSelectedGifts(selectedGifts.filter(id => id !== giftId));
        } else {
            setSelectedGifts([...selectedGifts, giftId]);
        }
    }

    const handleWithdrawGifts = () => {
        User.withdraw(localStorage.getItem('bearerToken'), selectedGifts).then(data => {
            if (data.success) {
                alert('Withdraw request success!');
                getData()
            } else {
                alert(data.data);
            }
        });
        setRefreshCounter(refreshCounter + 1);
    }

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40" onClick={onClose} />

            <div 
                className="fixed bottom-0 left-0 right-0 rounded-t-[30px] p-6 z-50 animate-slide-up max-w-[390px] mx-auto" 
                style={{ 
                    backgroundColor: 'var(--tg-theme-bg-color, #1C1C1E)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
                    maxHeight: '80vh'
                }}
            >
                <div className="text-center mb-6">
                    <p className="text-white text-[16px] leading-relaxed mb-4">
                        Выберите подарки, которые хотите вывести
                    </p>
                </div>

                <div 
                    className="overflow-y-auto scrollbar-hide" 
                    style={{ maxHeight: 'calc(80vh - 180px)' }}
                >
                    <div className="space-y-3" style={{ paddingBottom: '100px' }}>
                        {gifts.map((gift, index) => (
                            <div
                                key={index}
                                onClick={() => toggleItem(gift.id)}
                                className="flex items-center gap-4 cursor-pointer bg-[#303030] rounded-[15px] p-3"
                            >
                                <img
                                    src={selectedGifts.includes(gift.id) ? '/images/1checkbox.png' : '/images/checkbox.png'}
                                    alt="checkbox"
                                    className="w-6 h-6 flex-shrink-0 ml-1"
                                    style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(98%) saturate(2618%) hue-rotate(200deg) brightness(102%) contrast(101%)' }}
                                />

                                <img
                                    src={gift.img}
                                    alt={gift.title}
                                    className="w-[60px] h-[60px] rounded-[10px] object-cover"
                                />

                                <div className="flex-1">
                                    <h3 className="text-white text-[16px] font-medium">{gift.title}</h3>
                                    <p className="text-[#999] text-[12px]">{gift.attributes2.model.name} {gift.attributes2.model.rarity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 z-10" style={{ background: 'linear-gradient(to top, var(--tg-theme-bg-color, #1C1C1E) 70%, transparent)' }}>
                    <button
                        onClick={handleWithdrawGifts}
                        disabled={selectedGifts.length === 0}
                        className={`w-full rounded-[25px] h-[55px] text-white text-[18px] font-semibold flex items-center justify-center gap-2 ${
                            selectedGifts.length === 0
                                ? 'bg-[#515151] cursor-not-allowed'
                                : 'bg-[#007AFF]'
                        }`}
                    >
                        Вывести ({selectedGifts.length}) +{withdrawAmount} <TonIcon size={20} />
                    </button>
                </div>
            </div>
        </>
    );
}
