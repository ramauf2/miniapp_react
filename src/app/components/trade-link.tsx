import { Copy } from 'lucide-react';
// @ts-ignore
import translates from '../../../translates';

interface TradeLinkProps {
    handleCreateTrade: () => void;
    handleBack: () => void;
    tradeLink: string | null;
}

export function TradeLink({ handleCreateTrade, tradeLink, handleBack }: TradeLinkProps) {
    const lang = translates[localStorage.getItem('lang') ?? 'ru'];
    const handleCopy = () => {
        if (tradeLink) {
            navigator.clipboard.writeText(tradeLink);
        }
    };

    return (
        <div className="px-4 pt-12 flex flex-col items-center">
            {/* Emoji */}
            <div className="text-[120px] mb-8">🤝</div>

            {/* Title */}
            <h2 className="text-white text-[35px] font-medium mb-8">{lang.trade_link.title}</h2>

            {/* Link Box */}
            <div onClick={handleCopy} style={{cursor: 'pointer'}} className="w-full bg-[#303030] rounded-[20px] p-4 mb-4 flex items-center justify-between">
                <div className="flex-1 overflow-hidden">
                    <p className="text-white text-[14px] break-all">
                        {tradeLink}
                    </p>
                </div>
                <button className="ml-2">
                    <Copy className="w-5 h-5 text-[#999]" />
                </button>
            </div>

            {/* Generate New Link */}
            <button onClick={handleCreateTrade} className="text-[#007AFF] text-[16px] font-medium mb-12">
                {lang.trade_link.generate_button}
            </button>
            <button onClick={handleBack} className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-[25px] h-[55px] text-white text-[20px] font-semibold shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-all duration-300">
                {lang.trade_link.back_button}
            </button>
        </div>
    );
}