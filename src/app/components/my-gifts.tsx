import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import {useEffect, useState, useMemo, useRef} from 'react';
import { AuthData } from '../interface/AuthData';
import { WithdrawModal } from './withdraw-modal';
import { GiftDetailModal } from './gift-detail-modal';
import { CollectionFilterModal } from './collection-filter-modal';
import { Gift } from '../interface/Gift';
import Gifts from '../Gifts';
import lottie from 'lottie-web';
import {Player} from "@lottiefiles/react-lottie-player";
// @ts-ignore
import translates from '../../../translates';

interface MyGiftsProps {
    onAddGifts: () => void;
    authData: AuthData;
    lang: any;
}
export function MyGifts({ onAddGifts, authData, lang }: MyGiftsProps) {
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [selectedGift, setSelectedGift] = useState<Gift|null>(null);
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [viewMode, setViewMode] = useState('card');
    const [sortOrder, setSortOrder] = useState('low-to-high');
    const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
    const lottieContainer = useRef(null);

    const filteredAndSortedGifts = useMemo(() => {
        let result = [...gifts];

        if (selectedCollections.length > 0) {
            result = result.filter(gift =>
                gift.collection && selectedCollections.includes(gift.collection)
            );
        }

        result.sort((a, b) => {
            const priceA = a.price || 0;
            const priceB = b.price || 0;

            if (sortOrder === 'low-to-high') {
                return priceA - priceB;
            } else {
                return priceB - priceA;
            }
        });

        return result;
    }, [gifts, sortOrder, selectedCollections]);

    useEffect(() => {
        Gifts.getUserGifts(authData['bearerToken']).then(gifts => {
            if (!gifts.success) {
                return;
            }
            const giftsList = [];
            for (let gift of gifts.data.self.filter((i: any) => (i.status == 'active' || i.status == 'withdraw_cancel'))) {
                const model = gift.attributes.find((i: any) => i.class === 'StarGiftAttributeModel');
                const pattern = gift.attributes.find((i: any) => i.class === 'StarGiftAttributePattern');
                const backdrop = gift.attributes.find((i: any) => i.class === 'StarGiftAttributeBackdrop');
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
                    num: gift.num,
                    img: gift.img,
                    status: gift.status,
                    collection: gift.collection,
                    price: gift.price,
                    attributes: gift.attributes,
                    attributes2: attributes,
                });

            }
            // @ts-ignore
            setGifts(giftsList)
        })
    }, [])

    useEffect(() => {
        if (filteredAndSortedGifts.length === 0 && lottieContainer.current) {
            const animation = lottie.loadAnimation({
                container: lottieContainer.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/images/UtyaDuck_e84d8331.json'
            });

            return () => animation.destroy();
        }
    }, [filteredAndSortedGifts]);

    return (
        <div className="h-full flex flex-col" style={{ height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
            <div className="px-4 pt-4 pb-4 flex-shrink-0 animate-fade-in" style={{ flexShrink: 0, animationDelay: '0s' }}>
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={onAddGifts}
                        className="flex-1 bg-[#007AFF] rounded-[25px] h-[55px] text-white text-[18px] font-semibold flex items-center justify-center gap-2"
                    >
                        {lang.my_gifts.add_button} <Plus className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setShowWithdrawModal(true)}
                        className="flex-1 bg-[#007AFF] rounded-[25px] h-[55px] text-white text-[18px] font-semibold flex items-center justify-center gap-2"
                    >
                        {lang.my_gifts.withdraw_button} <img src="/images/send.png" alt="send" className="w-5 h-5" style={{ filter: 'brightness(0) invert(1)' }} />
                    </button>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowCollectionModal(true)}
                            style={{ borderTop: '1.5px solid rgba(255, 255, 255, 0.12)' }}
                            className="flex items-center gap-2 px-4 py-2 rounded-[20px] bg-[#303030] text-white text-[14px]"
                        >
                            {lang.my_gifts.collection_button} {selectedCollections.length > 0 && `(${selectedCollections.length})`} <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                            key={sortOrder}
                            onClick={() => {
                                const newOrder = sortOrder === 'low-to-high' ? 'high-to-low' : 'low-to-high';
                                setSortOrder(newOrder);
                            }}
                            style={{ borderTop: '1.5px solid rgba(255, 255, 255, 0.12)' }}
                            className="flex items-center gap-2 px-4 py-2 rounded-[20px] bg-[#303030] text-white text-[14px]"
                        >
                            {sortOrder === 'low-to-high' ? (
                                <>
                                    {lang.my_gifts.low2high_button}
                                    <ChevronUp className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    {lang.my_gifts.high2low_button}
                                    <ChevronDown className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                    <button
                        onClick={() => setViewMode(viewMode === 'card' ? 'long' : 'card')}
                        style={{
                            borderTop: '1.5px solid rgba(255, 255, 255, 0.12)',
                            borderRight: '1.5px solid rgba(255, 255, 255, 0.12)'
                        }}
                        className="px-3 py-2 rounded-full bg-[#303030] flex items-center justify-center"
                    >
                        {viewMode === 'card' ? (
                            <img src="/images/long.png" alt="long view" style={{ width: '20px', height: '20px', filter: 'invert(0.7) brightness(1.2)' }} />
                        ) : (
                            <img src="/images/card.png" alt="card view" style={{ width: '20px', height: '20px', filter: 'invert(0.7) brightness(1.2)' }} />
                        )}
                    </button>
                </div>
            </div>

            <div
                className="px-4 scrollbar-hide"
                style={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    flex: '1 1 auto',
                    WebkitOverflowScrolling: 'touch',
                    paddingBottom: '120px',
                    marginBottom: '0'
                }}
            >
                {filteredAndSortedGifts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center" style={{ minHeight: '400px' }}>
                        <div ref={lottieContainer} style={{ width: '200px', height: '200px' }}></div>
                        <p className="text-[#999] text-[16px] text-center mt-4">
                            {lang.my_gifts.no_gifts_title}
                        </p>
                    </div>
                ) : viewMode === 'card' ? (
                    <div className="grid grid-cols-2 gap-3">
                        {filteredAndSortedGifts.map((gift, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedGift(gift)}
                                className="rounded-[20px] p-3 flex flex-col cursor-pointer animate-fade-in"
                                style={{
                                    backgroundColor: '#1C1C1C',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                    animationDelay: `${index * 0.025}s`
                                }}
                            >
                                <Player
                                    autoplay={true}
                                    loop={true}
                                    src={gift.img}
                                    style={{ width: `100px`, height: `100px` }}
                                />
                                <h3 className="text-white text-[16px] font-medium mb-1">{gift.title} #{gift.num}</h3>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[#999] text-[12px]">{gift.attributes2.model.name}</p>
                                        <p className="text-[#999] text-[12px]">{gift.attributes2.model.rarity}</p>
                                    </div>
                                    {false && (<p className="text-white text-[14px] font-semibold">{gift.price} TON</p>)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredAndSortedGifts.map((gift, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedGift(gift)}
                                className="flex items-center gap-4 rounded-[25px] p-3 cursor-pointer animate-fade-in"
                                style={{
                                    backgroundColor: '#1C1C1C',
                                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                                    animationDelay: `${index * 0.03}s`
                                }}
                            >
                                <Player
                                    autoplay={true}
                                    loop={true}
                                    src={gift.img}
                                    style={{ width: `100px`, height: `100px` }}
                                />
                                <div className="flex-1">
                                    <h3 className="text-white text-[12px] font-medium">{gift.title} #{gift.num}</h3>
                                </div>
                                <div className="text-right">
                                    {false && (<p className="text-white text-[18px] font-semibold">{gift.price} TON</p>)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showWithdrawModal && (
                <WithdrawModal
                    lang={lang}
                    onClose={() => setShowWithdrawModal(false)}
                    authData={authData}
                />
            )}

            {showCollectionModal && (
                <CollectionFilterModal
                    lang={lang}
                    onClose={() => setShowCollectionModal(false)}
                    onApply={(collections) => setSelectedCollections(collections)}
                />
            )}

            {selectedGift && (
                <GiftDetailModal
                    lang={lang}
                    // @ts-ignore
                    gift={selectedGift}
                    onClose={() => setSelectedGift(null)}
                />
            )}
        </div>
    );
}
