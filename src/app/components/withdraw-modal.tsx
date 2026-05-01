import { useEffect, useState } from "react";
import { Gift } from '../interface/Gift'
import User from '../User';
import Gifts from '../Gifts';
import { TON_WITHDRAW_ITEM_FEE } from '../../../config';
import {AuthData} from "../interface/AuthData.tsx";
import { CustomDialog } from './custom-dialog';
import { TonIcon } from './ton-icon';
import {Player} from "@lottiefiles/react-lottie-player";
// @ts-ignore
import translates from '../../../translates';

interface WithdrawModalProps {
    onClose: () => void;
    authData: AuthData;
    lang: any;
}


export function WithdrawModal({ onClose, authData, lang }: WithdrawModalProps) {
    const [selectedGifts, setSelectedGifts] = useState<Gift[]>([]);
    const [gifts, setGifts] = useState<Gift[]>([]);
    const withdrawAmount = (selectedGifts.length * TON_WITHDRAW_ITEM_FEE).toFixed(1);
    const [refreshCounter, setRefreshCounter] = useState(0);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        getData()
    }, [refreshCounter])


    const getData = () => {
        Gifts.getUserGifts(authData['bearerToken']).then(gifts => {
            if (!gifts.success) return;
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
                    animation: gift.animation,
                    attributes: gift.attributes,
                    attributes2: attributes,
                });

            }
            // @ts-ignore
            setGifts(giftsList)
        })
    }


    const toggleItem = (giftId: any) => {
        if (selectedGifts.indexOf(giftId) !== -1) {//есть в списке - надо исключить
            setSelectedGifts(selectedGifts.filter(id => id !== giftId));
        } else {//нету в списке - надо добавить
            setSelectedGifts([...selectedGifts, giftId]);
        }
    }

    const handleWithdrawGifts = () => {
        User.withdraw(localStorage.getItem('bearerToken'), selectedGifts).then(data => {
            if (data.success) {
                setShowSuccessDialog(true);
                getData()
            } else {
                setErrorMessage(data.data || lang.withdraw.error);
                setShowErrorDialog(true);
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
                        {lang.withdraw.select_title}
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
                                    // @ts-ignore
                                    src={selectedGifts.includes(gift.id) ? '/images/1checkbox.png' : '/images/checkbox.png'}
                                    alt="checkbox"
                                    className="w-6 h-6 flex-shrink-0 ml-1"
                                    style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(98%) saturate(2618%) hue-rotate(200deg) brightness(102%) contrast(101%)' }}
                                />
                                <div style={{ borderRadius: '15px', overflow: 'hidden', flexShrink: 0, clipPath: 'inset(0 round 15px)', WebkitClipPath: 'inset(0 round 15px)' }}>
                                    <Player
                                        autoplay={true}
                                        loop={true}
                                        src={gift.animation}
                                        className="lottie-rounded-15"
                                        style={{ width: `100px`, height: `100px` }}
                                    />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-white text-[16px] font-medium">{gift.title} #{gift.num}</h3>
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
                        className={`w-full rounded-[25px] h-[55px] text-white text-[18px] font-semibold flex items-center justify-center gap-1 ${
                            selectedGifts.length === 0
                                ? 'bg-[#515151] cursor-not-allowed'
                                : 'bg-[#007AFF]'
                        }`}
                    >
                        <span>{lang.withdraw.withdraw_title} ({selectedGifts.length}) -{withdrawAmount}</span>
                        <div style={{ marginTop: '-3px' }}>
                            <TonIcon size={20} />
                        </div>
                    </button>
                </div>

                {/* Custom Dialogs */}
                <CustomDialog
                    lang={lang}
                    isOpen={showSuccessDialog}
                    title={lang.withdraw.success_title}
                    message={lang.withdraw.success_message}
                    type="alert"
                    onConfirm={() => setShowSuccessDialog(false)}
                />

                <CustomDialog
                    lang={lang}
                    isOpen={showErrorDialog}
                    title={lang.withdraw.dialog_error}
                    message={errorMessage}
                    type="alert"
                    onConfirm={() => setShowErrorDialog(false)}
                />
            </div>
        </>
    );
}
