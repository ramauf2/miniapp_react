import { Copy } from 'lucide-react';
import { useState } from 'react';

interface TradeLinkProps {
    onSendLink: () => void;
    handleCreateTrade: () => void;
    handleBack: () => void;
    tradeLink: string | null;
}

export function TradeLink({ onSendLink, handleCreateTrade, tradeLink, handleBack }: TradeLinkProps) {
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
            <h2 className="text-white text-[35px] font-medium mb-8">Trade link</h2>

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
                Generate new
            </button>

            {/* Send Link Button */}
            {false ? (<button
                onClick={onSendLink}
                className="w-full bg-[#007AFF] rounded-[25px] h-[55px] text-white text-[20px] font-semibold mb-4"
            >
                Send link to your partner
            </button>) : ''}

            {/* Get Random Partner Button */}
            {false ? (<button
                className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-[25px] h-[55px] text-white text-[20px] font-semibold shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-all duration-300"
            >
                ✨ Get Random Partner
            </button>) : ''}

            <button onClick={handleBack} className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 rounded-[25px] h-[55px] text-white text-[20px] font-semibold shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 transition-all duration-300">
                Back
            </button>
        </div>
    );
}