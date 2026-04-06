import { Share2 } from 'lucide-react';
import { useState } from 'react';

interface CreateTradeModalProps {
    onClose: () => void;
    handleCreateTrade: () => void;
    tradeLink: string | null;
}

export function CreateTradeModal({ onClose, handleCreateTrade, tradeLink }: CreateTradeModalProps) {
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
            window.open(`https://t.me/share/url?url=${encodeURIComponent(tradeLink)}&text=Давай обменяемся подарками!`, '_blank');
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
                                    <p className="text-white text-[18px] font-semibold mb-1">Комиссия за обмен</p>
                                    <p className="text-[#999] text-[14px] leading-relaxed">
                                        Стоимость создания обмена составляет 1 TON
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Trade Link */}
                        <div style={{ backgroundColor: '#2F2F2F' }} className="rounded-[20px] p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="text-[30px] mt-1">🔗</div>
                                <div className="flex-1">
                                    <p className="text-white text-[18px] font-semibold mb-2">Ваша ссылка для обмена</p>
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
                                {copied ? 'Скопировано! ✓' : 'Копировать'}
                            </button>
                            <button
                                onClick={handleShare}
                                className="flex-1 bg-[#007AFF] rounded-[25px] h-[55px] text-white text-[16px] font-semibold hover:bg-[#0066CC] transition-colors flex items-center justify-center gap-2"
                            >
                                <Share2 className="w-5 h-5" />
                                Поделиться
                            </button>
                        </div>

                        {/* Generate New Link */}
                        <button
                            onClick={handleCreateTrade}
                            className="w-full text-[#007AFF] text-[16px] font-medium py-3"
                        >
                            Создать новую ссылку
                        </button>
                    </>
                ) : (
                    <>
                        {/* Fee Info */}
                        <div style={{ backgroundColor: '#2F2F2F' }} className="rounded-[20px] p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="text-[30px] mt-1">💰</div>
                                <div className="flex-1">
                                    <p className="text-white text-[18px] font-semibold mb-1">Комиссия за обмен</p>
                                    <p className="text-[#999] text-[14px] leading-relaxed">
                                        Стоимость создания обмена составляет 1 TON
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Info Cards */}
                        <div className="space-y-3 mb-6">
                            <div style={{ backgroundColor: '#2F2F2F' }} className="rounded-[20px] p-4">
                                <div className="flex items-start gap-3">
                                    <div className="text-[30px] mt-1">🎁</div>
                                    <div className="flex-1">
                                        <p className="text-white text-[18px] font-semibold mb-1">Обменивайтесь подарками</p>
                                        <p className="text-[#999] text-[14px]">Безопасно и быстро обменивайтесь подарками с другими пользователями</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#2F2F2F' }} className="rounded-[20px] p-4">
                                <div className="flex items-start gap-3">
                                    <div className="text-[30px] mt-1">🔒</div>
                                    <div className="flex-1">
                                        <p className="text-white text-[18px] font-semibold mb-1">Защищенная сделка</p>
                                        <p className="text-[#999] text-[14px]">Обмен происходит одновременно, никто не может обмануть</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#2F2F2F' }} className="rounded-[20px] p-4">
                                <div className="flex items-start gap-3">
                                    <div className="text-[30px] mt-1">⚡</div>
                                    <div className="flex-1">
                                        <p className="text-white text-[18px] font-semibold mb-1">Мгновенно</p>
                                        <p className="text-[#999] text-[14px]">Создайте ссылку за секунду и начните обмен прямо сейчас</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Create Button */}
                        <button
                            onClick={handleCreateTrade}
                            className="w-full bg-[#007AFF] rounded-[25px] h-[55px] text-white text-[18px] font-semibold hover:bg-[#0066CC] transition-colors"
                        >
                            Создать обмен (1 TON)
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
