import { BOT_NAME } from '../../../config';
import { useEffect, useState } from "react";
import Referals from '../Referals';
import { ReferalHistory } from '../interface/ReferalHistory';
import {AuthData} from "../interface/AuthData.tsx";
// @ts-ignore
import translates from '../../../translates';

interface ReferralsProps {
    onClose: () => void;
    authData: AuthData;
}

export function ReferralsModal({ onClose, authData }: ReferralsProps) {
    const lang = translates[localStorage.getItem('lang') ?? 'ru'];
    const [isReferalLoaded, setIsReferalLoaded] = useState(false);
    const [referalHistory, setReferalHistory] = useState<ReferalHistory[]>([]);
    const [referalCount, setReferalCount] = useState('0');
    const [tradesCount, setTradesCount] = useState('0');
    const [totalEarned, setTotalEarned] = useState('0');
    const [refLink, setRefLink] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setRefLink('https://t.me/' + BOT_NAME + '?start=ref_' + authData['hash']);
    }, []);

    useEffect(() => {
        if (isReferalLoaded) return;

        Referals.getHistory(authData['bearerToken']).then(data => {
            if (data.success) {
                setReferalHistory(data.data.trades);
                setIsReferalLoaded(true);
                setTradesCount(data.data.tradesCount);
                setReferalCount(data.data.referalsCount);
                setTotalEarned((parseInt(data.data.totalAmount) / 1000000000).toFixed(2));
            }
        })
    }, []);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(refLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40" onClick={onClose} />

            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] rounded-t-[30px] p-6 z-50 animate-slide-up max-w-[390px] mx-auto max-h-[80vh] overflow-y-auto" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div style={{ backgroundColor: '#1C1C1C' }} className="rounded-full aspect-square flex flex-col items-center justify-center p-3">
                        <p className="text-white text-[18px] font-semibold mb-1">{totalEarned}</p>
                        <p className="text-white text-[11px] text-center">{lang.referrals.modal.earned}</p>
                    </div>
                    <div style={{ backgroundColor: '#1C1C1C' }} className="rounded-full aspect-square flex flex-col items-center justify-center p-3">
                        <p className="text-white text-[18px] font-semibold mb-1">{referalCount}</p>
                        <p className="text-white text-[11px] text-center">{lang.referrals.modal.referrals}</p>
                    </div>
                    <div style={{ backgroundColor: '#1C1C1C' }} className="rounded-full aspect-square flex flex-col items-center justify-center p-3">
                        <p className="text-white text-[18px] font-semibold mb-1">{tradesCount}</p>
                        <p className="text-white text-[11px] text-center">{lang.referrals.modal.trades}</p>
                    </div>
                </div>

                {/* Referral Link */}
                <div className="bg-[#303030] rounded-[20px] p-4 mb-4 break-all">
                    <p className="text-[#999] text-[14px]">{refLink}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={handleCopyLink}
                        style={{ backgroundColor: '#2F2F2F' }}
                        className="flex-1 rounded-[25px] h-[55px] text-white text-[16px] font-semibold hover:brightness-110 transition-all"
                    >
                        {copied ? lang.referrals.modal.copied_button : lang.referrals.modal.copy_button}
                    </button>
                    <button
                        onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(refLink)}`, '_blank')}
                        className="flex-1 bg-[#007AFF] rounded-[25px] h-[55px] text-white text-[16px] font-semibold hover:bg-[#0066CC] transition-colors"
                    >
                        {lang.referrals.modal.share_button}
                    </button>
                </div>

                {/* Earnings History */}
                {referalHistory.length > 0 && (
                    <div>
                        <h3 className="text-[#999] text-[16px] font-medium mb-3 text-center">{lang.referrals.modal.history}</h3>
                        <div className="space-y-2">
                            {referalHistory.map((earning, index) => (
                                <div key={index} className="bg-[#303030] rounded-[12px] p-3 flex items-center justify-between">
                                    <span className="text-[#999] text-[14px]">{earning.date}</span>
                                    <span className="text-[#00A61E] text-[16px] font-semibold">
                                        +{(parseInt(earning.reward) / 1000000000).toFixed(2)} TON
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
