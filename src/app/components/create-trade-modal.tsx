import { Share2 } from 'lucide-react';
import { useState } from 'react';
// @ts-ignore
import translates from '../../../translates';

interface CreateTradeModalProps {
    onClose: () => void;
    handleCreateTrade: () => void;
    tradeLink: string | null;
}

export function CreateTradeModal({ onClose, handleCreateTrade, tradeLink }: CreateTradeModalProps) {
    const lang = translates[localStorage.getItem('lang') ?? 'ru'];
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (tradeLink) {
            navigator.clipboard.writeText(tradeLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = () => {
        if (tradeLink) {
            window.open(`https://t.me/share/url?url=${encodeURIComponent(tradeLink)}&text=` + lang.create_trade.url_message, '_blank');
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40" onClick={onClose} />

            {/* Modal */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] rounded-t-[30px] p-6 z-50 animate-slide-up max-w-[390px] mx-auto" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                {tradeLink ? (
                    <>
                        {/* Fee Info */}
                        <div style={{ backgroundColor: '#2F2F2F' }} className="rounded-[20px] p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="text-[30px] mt-1">💰</div>
                                <div className="flex-1">
                                    <p className="text-white text-[18px] font-semibold mb-1">{lang.create_trade.trade_fee_title}</p>
                                    <p className="text-[#999] text-[14px] leading-relaxed">{lang.create_trade.trade_fee_text}</p>
                                </div>
                            </div>
                        </div>

                        {/* Trade Link */}
                        <div style={{ backgroundColor: '#2F2F2F' }} className="rounded-[20px] p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="text-[30px] mt-1">🔗</div>
                                <div className="flex-1">
                                    <p className="text-white text-[18px] font-semibold mb-2">{lang.create_trade.trade_link}</p>
                                    <p className="text-[#007AFF] text-[13px] break-all">{tradeLink}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-4">
                            <button
                                onClick={handleCopy}
                                style={{ backgroundColor: '#2F2F2F' }}
                                className="flex-1 rounded-[25px] h-[55px] text-white text-[16px] font-semibold hover:brightness-110 transition-all"
                            >
                                {copied ? lang.create_trade.copied_button: lang.create_trade.copy_button}
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex-1 bg-[#007AFF] rounded-[25px] h-[55px] text-white text-[16px] font-semibold hover:bg-[#0066CC] transition-colors flex items-center justify-center gap-2"
                            >
                                <Share2 className="w-5 h-5" />
                                {lang.create_trade.share_button}
                            </button>
                        </div>

                        {/* Generate New Link */}
                        <button
                            onClick={handleCreateTrade}
                            className="w-full text-[#007AFF] text-[16px] font-medium py-3"
                        >
                            {lang.create_trade.new_link_button}
                        </button>
                    </>
                ) : (
                    <>
                        {/* Fee Info */}
                        <div style={{ backgroundColor: '#2F2F2F' }} className="rounded-[20px] p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="text-[30px] mt-1">💰</div>
                                <div className="flex-1">
                                    <p className="text-white text-[18px] font-semibold mb-1">{lang.create_trade.trade_fee_title}</p>
                                    <p className="text-[#999] text-[14px] leading-relaxed">{lang.create_trade.trade_fee_text}</p>
                                </div>
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div className="space-y-3 mb-6">
                            <div style={{ backgroundColor: '#2F2F2F' }} className="rounded-[20px] p-4">
                                <div className="flex items-start gap-3">
                                    <div className="text-[30px] mt-1">🎁</div>
                                    <div className="flex-1">
                                        <p className="text-white text-[18px] font-semibold mb-1">{lang.create_trade.title_1}</p>
                                        <p className="text-[#999] text-[14px]">{lang.create_trade.text_1}</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#2F2F2F' }} className="rounded-[20px] p-4">
                                <div className="flex items-start gap-3">
                                    <div className="text-[30px] mt-1">🔒</div>
                                    <div className="flex-1">
                                        <p className="text-white text-[18px] font-semibold mb-1">{lang.create_trade.title_2}</p>
                                        <p className="text-[#999] text-[14px]">{lang.create_trade.text_2}</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#2F2F2F' }} className="rounded-[20px] p-4">
                                <div className="flex items-start gap-3">
                                    <div className="text-[30px] mt-1">⚡</div>
                                    <div className="flex-1">
                                        <p className="text-white text-[18px] font-semibold mb-1">{lang.create_trade.title_3}</p>
                                        <p className="text-[#999] text-[14px]">{lang.create_trade.text_3}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Create Button */}
                        <button
                            onClick={handleCreateTrade}
                            className="w-full bg-[#007AFF] rounded-[25px] h-[55px] text-white text-[18px] font-semibold hover:bg-[#0066CC] transition-colors"
                        >
                            {lang.create_trade.create_button}
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
