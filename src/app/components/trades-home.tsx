import {TradeHistory} from '../interface/TradeHistory';
import {TradeData} from '../interface/TradeData';
import {CreateTradeModal} from './create-trade-modal';
import {TradeHistoryModal} from './trade-history-modal';
import {getMockTradeIfNeeded} from '../mockData';
import {useState} from 'react';
// @ts-ignore
import translates from '../../../translates';

const imgTrade = '/images/trade.png';

interface TradesHomeProps {
    tradeData: TradeData | null;
    tradeHistory: TradeHistory[];
    onOpenTrade: () => void;
    handleCreateTrade: () => void;
    tradeLink: string | null;
    showCreateTradeModal: boolean;
    setShowCreateTradeModal: (show: boolean) => void;
    message: string | null;
    lang: any;
}


export function TradesHome({ tradeData, tradeHistory, onOpenTrade, handleCreateTrade, tradeLink, showCreateTradeModal, setShowCreateTradeModal, message, lang }: TradesHomeProps) {
    // Используем мок данные только если нет реальных
    const displayTradeData = getMockTradeIfNeeded(tradeData);
    
    const [selectedTrade, setSelectedTrade] = useState<TradeHistory | null>(null);
    const [showTradeHistoryModal, setShowTradeHistoryModal] = useState(false);

    const handleTradeClick = (trade: TradeHistory) => {
        setSelectedTrade(trade);
        setShowTradeHistoryModal(true);
    };

    return (
        <div className="h-full flex flex-col" style={{ height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
            {/* Fixed Header Section */}
            <div className="px-4 pt-4 flex-shrink-0" style={{ flexShrink: 0 }}>
                {displayTradeData && displayTradeData.partner ? (
                    <div
                        className="bg-[#303030] rounded-[20px] p-4 flex items-center justify-between mb-6 animate-quick-fade"
                        style={{
                            borderTop: '1.5px solid rgba(255, 255, 255, 0.12)',
                            animationDelay: '0s'
                        }}
                    >
                        <div className="flex items-center gap-2">
                            <img src="/images/trade.png" alt="trade" className="w-6 h-6" style={{ filter: 'brightness(0) saturate(100%) invert(80%)' }} />
                            <div className="w-[12px] h-[12px] rounded-full bg-[#00A61E]" />
                            <span className="text-white text-[18px]">{lang.trades_home.trade_with} @{displayTradeData.isCreator ? displayTradeData.partner : displayTradeData.user}</span>
                        </div>
                        <button
                            onClick={onOpenTrade}
                            className="bg-[#007AFF] rounded-full px-6 py-2 text-white text-[16px] font-semibold hover:brightness-110 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_3px_rgba(0,0,0,0.3)]"
                            style={{ borderTop: '1.5px solid rgba(255, 255, 255, 0.15)', borderBottom: '1.5px solid rgba(0, 0, 0, 0.2)' }}
                        >
                            Open
                        </button>
                    </div>
                ) : ''}

                {/* Ad Banner */}
                {/*<div
                    className="bg-[#3A3A3A] rounded-[20px] h-[80px] mb-4 animate-quick-fade"
                    style={{
                        animationDelay: displayTradeData && displayTradeData.partner ? '0.05s' : '0s'
                    }}
                >
                </div>*/}

                {message && (<div
                    className="bg-[#3A3A3A] rounded-[20px] mb-4 animate-quick-fade"
                    style={{
                        animationDelay: displayTradeData && displayTradeData.partner ? '0.05s' : '0s',
                        padding: '20px',
                    }}
                >
                    {message}
                </div>)}


                {/* Live Trades Header */}
                <div className="mb-4 flex justify-center">
                    <div
                        style={{
                            borderTop: '1.5px solid rgba(255, 255, 255, 0.12)',
                            animationDelay: displayTradeData && displayTradeData.partner ? '0.05s' : '0s'
                        }}
                        className="bg-[#1A1A1A] rounded-full px-4 py-2 flex items-center gap-2 border border-[#404040] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] animate-quick-fade"
                    >
                        <img
                            src="/images/live.png"
                            alt="live"
                            style={{
                                width: '28px',
                                height: '28px',
                                minWidth: '28px',
                                minHeight: '28px',
                                objectFit: 'contain',
                                filter: 'brightness(0) saturate(100%) invert(58%) sepia(89%) saturate(1000%) hue-rotate(90deg) brightness(95%) contrast(101%)'
                            }}
                        />
                        <h3 className="text-[#808080] text-[16px] font-normal">{lang.trades_home.live_trades}</h3>
                    </div>
                </div>
            </div>

            {/* Scrollable Trades List */}
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
                {tradeHistory.length > 0 && (
                    <div
                        className="rounded-[25px] p-3"
                        style={{
                            backgroundColor: '#1C1C1C',
                            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <div className="space-y-4">
                            {tradeHistory.map((trade, index) => {
                                const baseDelay = displayTradeData && displayTradeData.partner ? 0.1 : 0.05;
                                const delay = baseDelay + (index * 0.05);

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            animationDelay: `${delay}s`
                                        }}
                                        className="animate-trade-card cursor-pointer"
                                        onClick={() => handleTradeClick(trade)}
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[#595959] text-[15px] font-semibold">{trade.created_at}</span>
                                            <span className="text-[#595959] text-[15px]">{trade.user + ' => ' + trade.partner}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {/* Your Gifts - показываем только первый подарок */}
                                            <div className="flex items-center gap-3">
                                                <div className="bg-[#303030] rounded-[10px] w-[70px] h-[70px] p-1 flex items-center justify-center">
                                                    {trade.user_items.length > 0 && (
                                                        <img 
                                                            src={trade.user_items[0].img} 
                                                            alt={trade.user_items[0].title} 
                                                            className="w-full h-full object-cover rounded-[8px]" 
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src="/images/gift.png"
                                                        alt="gift"
                                                        className="w-[24px] h-[24px]"
                                                        style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
                                                    />
                                                    <span className="text-white text-[20px] font-semibold">{trade.user_items.length}</span>
                                                </div>
                                            </div>

                                            {/* Arrow */}
                                            <img src={imgTrade} alt="Trade" className="w-[39px] h-[39px] opacity-70" style={{ filter: 'brightness(0) invert(1)' }} />

                                            {/* Their Gifts - показываем только первый подарок */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <img
                                                        src="/images/gift.png"
                                                        alt="gift"
                                                        className="w-[24px] h-[24px]"
                                                        style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
                                                    />
                                                    <span className="text-white text-[20px] font-semibold">{trade.partner_items.length}</span>
                                                </div>
                                                <div className="bg-[#303030] rounded-[10px] w-[70px] h-[70px] p-1 flex items-center justify-center">
                                                    {trade.partner_items.length > 0 && (
                                                        <img 
                                                            src={trade.partner_items[0].img} 
                                                            alt={trade.partner_items[0].title} 
                                                            className="w-full h-full object-cover rounded-[8px]" 
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {index < tradeHistory.length - 1 && (
                                            <div className="mt-4 mb-4 h-[1px] bg-[#2A2A2A]" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {showCreateTradeModal && (
                <CreateTradeModal
                    lang={lang}
                    onClose={() => setShowCreateTradeModal(false)}
                    handleCreateTrade={handleCreateTrade}
                    tradeLink={tradeLink}
                />
            )}

            {showTradeHistoryModal && (
                <TradeHistoryModal
                    trade={selectedTrade}
                    isOpen={showTradeHistoryModal}
                    onClose={() => setShowTradeHistoryModal(false)}
                    lang={lang}
                />
            )}
        </div>
    );
}