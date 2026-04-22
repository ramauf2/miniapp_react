import { Users } from 'lucide-react';
import {useEffect, useState} from "react";
import Trades from '../Trades';
import {TradeHistory} from '../interface/TradeHistory';
import { ReferralsModal } from './referrals-modal';
import {AuthData} from "../interface/AuthData.tsx";
import { TonIcon } from './ton-icon';
// @ts-ignore
import translates from '../../../translates';

interface Stats{
    itemsCount: number,
    tradeAmount: number,
}

interface ProfileProps {
    authData: AuthData;
    lang: any;
}

export function Profile({ authData, lang }: ProfileProps) {
    const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
    const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
    const [showReferralsModal, setShowReferralsModal] = useState(false);
    const [stats, setStats] = useState<Stats>({
        itemsCount: 0,
        tradeAmount: 0,
    });

    useEffect(() => {
        if (isHistoryLoaded) return;
        Trades.getUserHistory(authData['bearerToken']).then(data => {
            if (data.success && data.data.data && data.data.data.length > 0) {
                if (!data.data.data.isCreator) {
                    const userItems = data.data.data.user_items;
                    data.data.data.user_items = data.data.data.partner_items;
                    data.data.data.user_items = userItems;
                }
                setTradeHistory(data.data.data);
                setStats({
                    itemsCount: data.data.total,
                    tradeAmount: 0,
                })
            }
            setIsHistoryLoaded(true);
        }).catch(() => {
            setIsHistoryLoaded(true);
        })
    }, [isHistoryLoaded]);

    return (
        <div className="w-full px-4 pt-8" style={{ paddingBottom: '120px' }}>
            {/* User Info */}
            <div className="text-center mb-4 animate-fade-in" style={{ animationDelay: '0s' }}>
                <img
                    src={authData.avatar}
                    alt="Profile"
                    className="w-[70px] h-[70px] rounded-full object-cover mx-auto mb-2"
                />
                <p className="text-[#999] text-[14px]">@{authData.username}</p>
            </div>

            <div className="flex items-center justify-center gap-8 mb-4 animate-fade-in" style={{ animationDelay: '0.05s' }}>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                        <p className="text-white text-[20px] font-semibold">{stats.tradeAmount}</p>
                        <div style={{ marginTop: '2px' }}>
                            <TonIcon size={20} />
                        </div>
                    </div>
                    <p className="text-[#999] text-[13px]">{lang.profile.trade_volume}</p>
                </div>
                <div className="w-[1px] h-[35px] bg-[#595959]" />
                <div className="text-center">
                    <p className="text-white text-[20px] font-semibold">{stats.itemsCount}</p>
                    <p className="text-[#999] text-[13px]">{lang.profile.trades}</p>
                </div>
            </div>

            {/* Referrals Banner */}
            <button
                onClick={() => setShowReferralsModal(true)}
                style={{ backgroundColor: '#1E1E1E', animationDelay: '0.1s' }}
                className="w-full rounded-[20px] p-5 flex items-center justify-between mb-4 hover:brightness-110 transition-all animate-fade-in"
            >
                <div className="text-left">
                    <h3 className="text-white text-[24px] font-semibold mb-1">{lang.profile.referrals}</h3>
                    <p className="text-white text-[15px] opacity-80">{lang.profile.referrals_description}</p>
                </div>
                <Users className="w-[50px] h-[50px] text-white opacity-30" />
            </button>

            {/* Trade History */}
            <div className="mb-3 flex justify-center animate-fade-in" style={{ animationDelay: '0.15s' }}>
                <div style={{ borderTop: '1.5px solid rgba(255, 255, 255, 0.12)' }} className="bg-[#1A1A1A] rounded-full px-4 py-1.5 flex items-center gap-2 border border-[#404040] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                    <h2 className="text-[#808080] text-[16px] font-normal">{lang.profile.trade_history}</h2>
                </div>
            </div>

            {/* Trade History List */}
            <div className="space-y-4">
                {tradeHistory.map((trade, index) => (
                    <div
                        key={index}
                        className="rounded-[25px] p-3 relative animate-fade-in"
                        style={{
                            backgroundColor: '#1C1C1C',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                            animationDelay: `${(index * 0.04) + 0.2}s`
                        }}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[#595959] text-[15px] font-semibold">{trade.created_at}</span>
                            <span className="text-[#595959] text-[15px]">{trade.isCreator ? trade.partner : trade.user}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            {/* Sent */}
                            <div className="flex items-center gap-3">
                                <div className="bg-[#303030] rounded-[10px] w-[70px] h-[70px] p-1 grid grid-cols-2 gap-[2px]">
                                    {trade.user_items.map((item, index2) => (
                                        <img src={item.img} alt={item.title} key={index2} className="w-full object-cover rounded-[5px]" />
                                    ))}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <img
                                            src="/images/gift.png"
                                            alt="gift"
                                            className="w-[20px] h-[20px]"
                                            style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
                                        />
                                        <p className="text-white text-[20px] font-semibold">{trade.user_items.length}</p>
                                    </div>
                                    <p className="text-[#999] text-[14px]">{lang.profile.sent_button}</p>
                                </div>
                            </div>

                            {/* Arrow */}
                            <img src={'/images/trade.png'} alt="Trade" className="w-[30px] h-[30px] opacity-70" style={{ filter: 'brightness(0) invert(1)' }} />

                            {/* Received */}
                            <div className="flex items-center gap-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1 justify-end">
                                        <img
                                            src="/images/gift.png"
                                            alt="gift"
                                            className="w-[20px] h-[20px]"
                                            style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
                                        />
                                        <p className="text-white text-[20px] font-semibold">{trade.partner_items.length}</p>
                                    </div>
                                    <p className="text-[#00A61E] text-[14px] text-right">{lang.profile.get_button}</p>
                                </div>
                                <div className="bg-[#303030] rounded-[10px] w-[70px] h-[70px] p-1 grid grid-cols-2 gap-[2px]">
                                    {trade.partner_items.map((item, index2) => (
                                        <img src={item.img} alt={item.title} key={index2} className="w-full object-cover rounded-[5px]" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showReferralsModal && (
                <ReferralsModal
                    lang={lang}
                    onClose={() => setShowReferralsModal(false)}
                    authData={authData}
                />
            )}
        </div>
    );
}