import { Link } from 'lucide-react';
import { BASE_PATH, BOT_NAME } from '../../../config';
import {useEffect, useState} from "react";
import Referals from '../Referals';
import {ReferalHistory} from '../interface/ReferalHistory';
import {AuthData} from "../interface/AuthData.tsx";
const imgPhoto = BASE_PATH + "/images/b40069be8827d28186f71205316130af8e40fdf6.png";

interface ReferralsProps {
    authData: AuthData;
}

export function Referrals({ authData }: ReferralsProps) {
    const [isReferalLoaded, setIsReferalLoaded] = useState(false);
    const [referalHistory, setReferalHistory] = useState<ReferalHistory[]>([]);
    const [referalCount, setReferalCount] = useState('0');
    const [tradesCount, setTradesCount] = useState('0');
    const [totalEarned, setTotalEarned] = useState('0');
    const [refLink, setRefLink] = useState('');
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
    };

    return (
        <div className="px-4 pt-8 pb-4">
            {/* User Info */}
            <div className="text-center mb-6">
                <h1 className="text-white text-[48px] font-medium mb-4">Referrals</h1>
                <img
                    src={authData.avatar != '' ? authData.avatar : imgPhoto}
                    alt="Profile"
                    className="w-[140px] h-[140px] rounded-full object-cover mx-auto mb-6"
                />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mb-8 px-4">
                <div className="text-center flex-1">
                    <p className="text-[#00A61E] text-[20px] font-semibold">+{totalEarned}</p>
                    <p className="text-[#999] text-[14px]">Total Earned</p>
                </div>
                <div className="w-[1px] h-[40px] bg-[#595959]" />
                <div className="text-center flex-1">
                    <p className="text-white text-[20px] font-semibold">{referalCount}</p>
                    <p className="text-[#999] text-[14px]">Referrals</p>
                </div>
                <div className="w-[1px] h-[40px] bg-[#595959]" />
                <div className="text-center flex-1">
                    <p className="text-white text-[20px] font-semibold">{tradesCount}</p>
                    <p className="text-[#999] text-[14px]">Trades</p>
                </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6" style={{ color: 'yellow', textAlign: 'center'}}>
                {refLink}
            </div>
            {/* Referrals Header with Copy Link */}
            <div className="flex items-center justify-center gap-4 mb-6">
                <button
                    onClick={handleCopyLink}
                    className="bg-[#007AFF] rounded-[25px] px-4 py-2 flex items-center gap-2 text-white text-[16px] font-semibold"
                >
                    Copy link <Link className="w-4 h-4" />
                </button>
            </div>

            {/* Referral Earnings List */}
            <div className="space-y-1">
                {referalHistory.map((earning, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-[#303030]">
                        <span className="text-[#999] text-[16px]">{earning.date}</span>
                        <span className="text-[#00A61E] text-[18px] font-semibold">+ {( parseInt(earning.reward) / 1000000000).toFixed(2)} TON</span>
                    </div>
                ))}
            </div>
        </div>
    );
}