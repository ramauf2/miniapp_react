import { useState, useEffect, useRef } from 'react';
import { TabBar } from './components/tab-bar';
import { TradesHome } from './components/trades-home';
import { TradeLink } from './components/trade-link';
import { TradeRoom } from './components/trade-room';
import { BalanceTon } from './components/balance-ton';
import { MyGifts } from './components/my-gifts';
import { Profile } from './components/profile';
import { Referrals } from './components/referrals';
import { ConfirmModal } from './components/confirm-modal';
import { CustomDialog } from './components/custom-dialog';
import { TonIcon } from './components/ton-icon';
import { TonConnectUI } from '@tonconnect/ui';
import io, { Socket } from 'socket.io-client';
import User from './User';
import Trades from './Trades';
import { BASE_PATH, VALIDATOR_PORT, BOT_NAME, OWNER_USERNAME } from '../../config';
// @ts-ignore
import translates from '../../translates';
import { getMockTradeIfNeeded } from './mockData';

//declare const TonConnectUI: any;
declare const TonWeb: any;
import {TradeData} from './interface/TradeData';
import {AuthData} from './interface/AuthData';
import {TradeHistory} from "./interface/TradeHistory";
import socketEvents from "./socketEvents";

export type Tab = 'trades' | 'gifts' | 'profile';
export type Screen = 'home' | 'trade-link' | 'trade-room' | 'referrals' | 'balance-ton';

export default function App() {
    const [lang, setLang] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<Tab>('trades');
    const [currentScreen, setCurrentScreen] = useState<Screen>('home');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showAddGiftModal, setShowAddGiftModal] = useState(false);
    const [showCreateTradeModal, setShowCreateTradeModal] = useState(false);
    const [isAuthAttempt, setIsAuthAttempt] = useState(false);
    const [authData, setAuthData] = useState<AuthData | null>(null);
    const [localBalance, setLocalBalance] = useState(0);
    const [tradeData, setTradeData] = useState<TradeData | null>(null);
    const [tradeLink, setTradeLink] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [ui, setUi] = useState<any>(null);
    const [tradeHistory, setTradeHistory] = useState<TradeHistory[]>([]);
    const [modalConfig] = useState<{
        title: string;
        message: string;
        onConfirm: () => void;
    } | null>(null);
    const [showTradeCompletedDialog, setShowTradeCompletedDialog] = useState(false);

    const socketRef = useRef<Socket | null>(null);
    const authRef = useRef<AuthData | null>(null);
    const tradeRef = useRef<TradeData | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        authRef.current = authData;
    }, [authData]);

    useEffect(() => {
        tradeRef.current = tradeData;
    }, [tradeData]);

    // Reset scroll when changing tabs
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    // Initialize Telegram WebApp fullscreen mode
    useEffect(() => {
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp as any;
            tg.ready();
            tg.expand();
            tg.enableClosingConfirmation();

            // Disable vertical swipes if available
            if (typeof tg.disableVerticalSwipes === 'function') {
                tg.disableVerticalSwipes();
            }
        }
        fetch('/translates.json')
            .then(response => response.json())
            .then(translates => {
                setLang(translates[localStorage.getItem('lang') ?? 'ru'])
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        if (!ui && lang) {
            setUi(
                new TonConnectUI({
                    manifestUrl: 'https://spingame2.com/tonconnect-manifest.json',
                    buttonRootId: 'ton-connect',
                })
            );
        }
    }, [ui, lang]);

    useEffect(() => {
        let telegramUserId = 0;
        if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id && window.Telegram.WebApp.initDataUnsafe.user.id > 0) {
            telegramUserId = window.Telegram.WebApp.initDataUnsafe.user.id;
        }

        const socket = io(BASE_PATH.startsWith('http://') || BASE_PATH.startsWith('https://') ? BASE_PATH : BASE_PATH + ':' + VALIDATOR_PORT, {
            transports: ['websocket'],
            auth: {
                tel_id: telegramUserId
            }
        });
        socketRef.current = socket;
        socket.on(socketEvents.SOCKET_EVENT_TRADE_UPDATED, handleSocketTradeUpdated);
        socket.on(socketEvents.SOCKET_EVENT_JOIN_TRADE, handleSocketJoinTrade);
        socket.on(socketEvents.SOCKET_EVENT_BALANCE_UPDATED, handleSocketBalanceUpdated);

        return () => {
            socket.off(socketEvents.SOCKET_EVENT_TRADE_UPDATED, handleSocketTradeUpdated);
            socket.off(socketEvents.SOCKET_EVENT_JOIN_TRADE, handleSocketJoinTrade);
            socket.off(socketEvents.SOCKET_EVENT_BALANCE_UPDATED, handleSocketBalanceUpdated);
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);

        if (!isAuthAttempt) {
            setIsAuthAttempt(true);

            let telegramUserId = 0;
            if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id && window.Telegram.WebApp.initDataUnsafe.user.id > 0) {
                telegramUserId = window.Telegram.WebApp.initDataUnsafe.user.id;
            }


            if (localStorage.getItem('telegramId')) {

                if (telegramUserId > 0 && telegramUserId != Number(localStorage.getItem('telegramId'))) {
                    localStorage.removeItem('telegramId');
                    window.location.reload();
                }
                setAuthData({
                    telegramId: localStorage.getItem('telegramId')!,
                    comment: localStorage.getItem('comment')!,
                    bearerToken: localStorage.getItem('bearerToken')!,
                    username: localStorage.getItem('username')!,
                    first_name: localStorage.getItem('first_name')!,
                    hash: localStorage.getItem('hash')!,
                    avatar: localStorage.getItem('avatar')!,
                });
            } else {
                //проверить наличие реферальной ссылки
                let ref = '';
                if (searchParams.get('ref')?.match(/^[a-z0-9]{10}$/)) {
                    ref = searchParams.get('ref') || '';
                }
                User.login(ref, window.Telegram?.WebApp?.initData, searchParams.get('user')).then((data: any) => {
                    if (data.success) {
                        localStorage.setItem('telegramId', data.id);
                        localStorage.setItem('comment', data.comment);
                        localStorage.setItem('bearerToken', data.bearerToken);
                        localStorage.setItem('username', data.username);
                        localStorage.setItem('first_name', data.first_name);
                        localStorage.setItem('hash', data.hash);
                        localStorage.setItem('avatar', data.avatar);
                        setAuthData({
                            telegramId: data.id,
                            comment: data.comment,
                            bearerToken: data.bearerToken,
                            username: data.username,
                            first_name: data.first_name,
                            hash: data.hash,
                            avatar: data.avatar,
                        });
                    } else {
                        localStorage.removeItem('telegramId');
                        localStorage.removeItem('comment');
                        localStorage.removeItem('bearerToken');
                        localStorage.removeItem('username');
                        localStorage.removeItem('first_name');
                        localStorage.removeItem('hash');
                        localStorage.removeItem('avatar');
                        setAuthData(null);
                    }
                });
            }
        }

        if (authData) {
            requestUserBalance();

            if (searchParams.get('trade')?.match(/^[a-z0-9]{16}$/)) {
                Trades.connectToTrade(authData.bearerToken, searchParams.get('trade')!).then((data: any) => {
                    if (data.success) {
                        socketRef.current?.emit(socketEvents.SOCKET_EVENT_JOIN_TRADE, {
                            code: data.data.code,
                            actor: authData.username,
                        });
                        setTradeData(data.data);
                    } else {
                        setMessage(data.data);
                    }
                });
            }

            requestTradeStatus().then((data2: any) => {
                if (data2.success && authRef.current) {
                    socketRef.current?.emit(socketEvents.SOCKET_EVENT_JOIN_TRADE, {
                        code: data2.data.code,
                        actor: authRef.current.username,
                    });
                }
            });

            Trades.getLastHistory(authData['bearerToken']).then((data: any) => {
                console.log('getLastHistory response:', data);
                if (data.success && data.data) {
                    let trades = [];
                    if (data.data.data && Array.isArray(data.data.data)) {
                        trades = data.data.data;
                    } else if (Array.isArray(data.data)) {
                        trades = data.data;
                    }
                    const limitedTrades = trades.slice(0, 25);
                    setTradeHistory(limitedTrades);
                } else {
                    setTradeHistory([]);
                }
            }).catch((error) => {
                console.error('Error loading last history:', error);
                setTradeHistory([]);
            })
        }
    }, [authData, isAuthAttempt]);

    /**
     * Пришло уведомление об обновлении трейда, надо обновить данные о трейде
     * @param data
     */
    const handleSocketTradeUpdated = (data: any) => {
        if (authRef.current && data.actor == authRef.current.username) return;//свои уведомления не обрабатываем
        requestTradeInfo(data.code);
    };
    const handleSocketJoinTrade = () => {
        const auth = authRef.current;
        const trade = tradeRef.current;

        if (!auth || !trade) return;
        requestTradeStatus();
    };

    /**
     * Выполнить действия, связанные с изменением баланса пользователя
     */
    const handleSocketBalanceUpdated = () => {
        requestUserBalance();
    }

    /**
     * Получить торговый статус
     */
    const requestTradeStatus = () => {
        if (!authRef.current) return Promise.resolve({ success: false });
        return Trades.status(authRef.current.bearerToken).then((data: any) => {
            if (data.success) {
                setTradeData(data.data);
                setTradeLink('https://t.me/' + BOT_NAME + '?start=trade_' + data.data.code);
            } else {
                setTradeLink(null);
            }
            return data;
        });
    }

    /**
     * Получить баланс пользователя
     */
    const requestUserBalance = () => {
        if (!authRef.current) return;
        User.getUserData(authRef.current.bearerToken).then((data: any) => {
            if (data.success) {
                // @ts-ignore
                setLocalBalance((TonWeb.utils.fromNano(data.data.balance) * 1).toFixed(2));
            } else {
                if (data.code == 401) {
                    localStorage.removeItem('telegramId');
                    window.location.reload();
                }
            }
        });
    }

    /**
     * Получить данные о трейде по коду
     * @param code
     */
    const requestTradeInfo = (code: string) => {
        return Trades.info(authRef.current!.bearerToken, code).then((data: any) => {
            if (data.success) {
                if (data.data.is_completed) {
                    setShowTradeCompletedDialog(true);
                }
                console.log('requestTradeInfo', data.data);
                setTradeData(data.data);
            } else {
                setTradeLink(null);
            }
            return data;
        });
    }
    const handleOpenTradeRoom = () => setCurrentScreen('trade-room');
    const handleOpenBalanceTon = () => setCurrentScreen('balance-ton');

    const handleCreateTrade = () => {
        if (!authRef.current) return;
        Trades.create(authRef.current.bearerToken).then((data: any) => {
            if (data.success && authRef.current) {
                const newCode = data.data;
                setTradeLink('https://t.me/' + BOT_NAME + '?start=trade_' + newCode);
                socketRef.current?.emit(socketEvents.SOCKET_EVENT_JOIN_TRADE, {
                    code: newCode,
                    actor: authRef.current.username,
                });
            } else {
                setTradeLink(null);
            }
        });
    };


    const handleBackToTrades = () => {
        setCurrentScreen('home');
        setActiveTab('trades');
    };

    const handleCancelDeposit = () => setCurrentScreen('home');
    const handleWriteToRelayer = () => window.open('https://t.me/' + OWNER_USERNAME, '_blank');

    const renderScreen = () => {
        if (currentScreen === 'balance-ton') {
            return (
                <BalanceTon
                    lang={lang}
                    ui={ui}
                    handleCancelDeposit={handleCancelDeposit}
                    blockhainBalance={0}
                    localBalance={localBalance}
                />
            );
        }

        if (activeTab === 'trades') {
            if (currentScreen === 'trade-link') {
                return (
                    <TradeLink
                        lang={lang}
                        handleCreateTrade={handleCreateTrade}
                        handleBack={handleBackToTrades}
                        tradeLink={tradeLink}
                    />
                );
            }

            if (currentScreen === 'trade-room' && authData) {
                // Используем мок данные только если нет реальных
                const displayTradeData = getMockTradeIfNeeded(tradeData);

                if (displayTradeData) {
                    return (
                        <TradeRoom
                            lang={lang}
                            socket={socketRef.current}
                            authData={authData}
                            tradeData={displayTradeData}
                            goBack={handleBackToTrades}
                        />
                    );
                }
            }

            return (
                <TradesHome
                    lang={lang}
                    tradeData={tradeData}
                    onOpenTrade={handleOpenTradeRoom}
                    tradeHistory={tradeHistory}
                    handleCreateTrade={handleCreateTrade}
                    tradeLink={tradeLink}
                    showCreateTradeModal={showCreateTradeModal}
                    setShowCreateTradeModal={setShowCreateTradeModal}
                    message={message}
                />
            );
        }

        if (activeTab === 'gifts' && authData) {
            return <MyGifts lang={lang} onAddGifts={() => setShowAddGiftModal(true)} authData={authData} />;
        }

        if (activeTab === 'profile' && authData) {
            if (currentScreen === 'referrals') {
                return <Referrals authData={authData} lang={lang} />;
            }
            return <Profile authData={authData} lang={lang} />;
        }

        return null;
    };
    if (!lang) {
        return <></>
    }

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <div className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#111111', paddingTop: '40px' }}>
            <div className="max-w-[390px] h-full mx-auto relative">
                <div className="h-[56px] flex items-center justify-between px-4 animate-fade-in" style={{ backgroundColor: '#111111', animationDelay: '0s', marginTop: '20px' }}>
                    <div id="ton-connect"></div>

                    <div className="flex items-center gap-4">
                        <div
                            className="rounded-[35px] h-[34px] px-3 flex items-center gap-2"
                            style={{
                                background: 'rgba(0, 80, 160, 0.4)',
                                boxShadow: `
                                    inset -1.5px -1.5px 2px rgba(200, 200, 200, 0.25),
                                    inset 1.5px 1.5px 2px rgba(200, 200, 200, 0.25)
                                `
                            }}
                        >
                            <TonIcon size={18} />
                            <span className="text-white text-[18px] font-semibold">{localBalance}</span>
                            <button
                                onClick={handleOpenBalanceTon}
                                className="w-[25px] h-[25px] rounded-full flex items-center justify-center hover:brightness-110 transition-all"
                                style={{
                                    filter: 'brightness(0) saturate(100%) invert(85%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)'
                                }}
                            >
                                <img src="/images/plus.png" alt="+" className="w-[14px] h-[14px]" />
                            </button>
                        </div>
                    </div>
                </div>

                <div 
                    ref={contentRef}
                    className={`${activeTab === 'profile' ? 'overflow-y-auto scrollbar-hide' : 'overflow-hidden'}`} 
                    style={{
                        height: 'calc(100vh - 116px)',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {renderScreen()}
                </div>

                <TabBar
                    lang={lang}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />

                {/* Floating Create Trade Button - only on trades home screen */}
                {activeTab === 'trades' && currentScreen === 'home' && (
                    <div className="absolute left-0 right-0 px-4 z-30 pointer-events-none" style={{ bottom: '106px' }}>
                        <button
                            onClick={() => setShowCreateTradeModal(true)}
                            className="w-[60px] h-[60px] rounded-full flex items-center justify-center pointer-events-auto"
                            style={{
                                marginLeft: 'auto',
                                background: 'rgba(40, 40, 40, 0.6)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                boxShadow: `
                                    -0.8px 0 0 0 rgba(200, 200, 200, 0.4),
                                    -0.8px -0.3px 0 0 rgba(200, 200, 200, 0.35),
                                    -1.2px -0.6px 0 0 rgba(200, 200, 200, 0.25),
                                    0.8px 0 0 0 rgba(200, 200, 200, 0.4),
                                    0.8px 0.3px 0 0 rgba(200, 200, 200, 0.35),
                                    1.2px 0.6px 0 0 rgba(200, 200, 200, 0.25)
                                `
                            }}
                        >
                            <img src="/images/plus.png" alt="+" className="w-[20px] h-[20px]" style={{ filter: 'brightness(0) saturate(100%) invert(90%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(95%)' }} />
                        </button>
                    </div>
                )}

                {showConfirmModal && modalConfig && (
                    <ConfirmModal
                        lang={lang}
                        title={modalConfig.title}
                        message={modalConfig.message}
                        onConfirm={modalConfig.onConfirm}
                        onCancel={() => setShowConfirmModal(false)}
                    />
                )}
            </div>

            {showAddGiftModal && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40" onClick={() => setShowAddGiftModal(false)} />

                    <div className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] rounded-t-[30px] p-6 z-50 animate-slide-up max-w-[390px] mx-auto" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <div className="text-center mb-6">
                            <p className="text-white text-[18px] leading-relaxed">
                                {lang.main.add_gift_1}
                                {' '}
                                <span className="text-[#007AFF] font-semibold">@{OWNER_USERNAME}</span>
                                {' '}
                                {lang.main.add_gift_2}
                            </p>
                        </div>

                        <button
                            onClick={handleWriteToRelayer}
                            className="w-full bg-[#007AFF] rounded-[25px] h-[55px] text-white text-[18px] font-semibold"
                        >
                            {lang.main.write_button}
                        </button>
                    </div>
                </>
            )}

            {/* Custom Dialog */}
            <CustomDialog
                lang={lang}
                isOpen={showTradeCompletedDialog}
                title={lang.main.exchange_success_1}
                message={lang.main.exchange_success_2}
                type="alert"
                onConfirm={() => window.location.reload()}
            />
        </div>
    );
}
