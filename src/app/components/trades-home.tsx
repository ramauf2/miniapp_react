import {TradeHistory} from '../interface/TradeHistory';
import {TradeData} from '../interface/TradeData';
import {CreateTradeModal} from './create-trade-modal';

const imgTrade = '/images/trade.png';

interface TradesHomeProps {
    tradeData: TradeData | null;
    tradeHistory: TradeHistory[];
    onOpenTrade: () => void;
    handleCreateTrade: () => void;
    tradeLink: string | null;
    showCreateTradeModal: boolean;
    setShowCreateTradeModal: (show: boolean) => void;
}


export function TradesHome({ tradeData, tradeHistory, onOpenTrade, handleCreateTrade, tradeLink, showCreateTradeModal, setShowCreateTradeModal }: TradesHomeProps) {

    return (
        <div className="h-full flex flex-col" style={{ height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
            {/* Fixed Header Section */}
            <div className="px-4 pt-4 flex-shrink-0" style={{ flexShrink: 0 }}>
                {tradeData && tradeData.partner ? (
                    <div className="bg-[#303030] rounded-[20px] p-4 flex items-center justify-between mb-6" style={{ borderTop: '1.5px solid rgba(255, 255, 255, 0.12)' }}>
                        <div className="flex items-center gap-2">
                            <img src="/images/trade.png" alt="trade" className="w-6 h-6" style={{ filter: 'brightness(0) saturate(100%) invert(80%)' }} />
                            <div className="w-[12px] h-[12px] rounded-full bg-[#00A61E]" />
                            <span className="text-white text-[18px]">Trade with @{tradeData.isCreator ? tradeData.partner : tradeData.user}</span>
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

                {/* Live Trades Header */}
                <div className="mb-4 flex justify-center">
                    <div style={{ borderTop: '1.5px solid rgba(255, 255, 255, 0.12)' }} className="bg-[#1A1A1A] rounded-full px-4 py-2 flex items-center gap-2 border border-[#404040] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
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
                        <h3 className="text-[#808080] text-[16px] font-normal">Live Trades</h3>
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
                <div className="space-y-4">
                    {tradeHistory.map((trade, index) => (
                        <div key={index} style={{ backgroundColor: '#1C1C1C', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} className="rounded-[25px] p-3 relative">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[#595959] text-[15px] font-semibold">{trade.user + ' => ' + trade.partner}</span>
                                <span className="text-[#595959] text-[15px]">{trade.created_at}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                {/* Your Gifts */}
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#303030] rounded-[10px] w-[70px] h-[70px] p-1 grid grid-cols-2 gap-[2px]">
                                        {trade.user_items.map((item, index2) => (
                                            <img src={item.img} alt={item.title} key={index2} className="w-full object-cover rounded-[5px]" />
                                        ))}
                                    </div>
                                    <span className="text-white text-[20px] font-semibold">{trade.user_items.length} Gifts</span>
                                </div>

                                {/* Arrow */}
                                <img src={imgTrade} alt="Trade" className="w-[39px] h-[39px] opacity-70" style={{ filter: 'brightness(0) invert(1)' }} />

                                {/* Their Gifts */}
                                <div className="flex items-center gap-3">
                                    <span className="text-white text-[20px] font-semibold">{trade.partner_items.length} Gifts</span>
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
            </div>

            {showCreateTradeModal && (
                <CreateTradeModal
                    onClose={() => setShowCreateTradeModal(false)}
                    handleCreateTrade={handleCreateTrade}
                    tradeLink={tradeLink}
                />
            )}
        </div>
    );
}