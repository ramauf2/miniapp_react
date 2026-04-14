import { Plus } from 'lucide-react';
import {useEffect, useState} from 'react';
import Gifts from '../Gifts';
import Trades from '../Trades';
import { GiftSelectorModal } from './gift-selector-modal';
import { PartnerInventoryModal } from './partner-inventory-modal';
import {Gift} from '../interface/Gift'
import {TradeData} from '../interface/TradeData';
import {AuthData} from '../interface/AuthData';
import { DeleteGiftModal } from './delete-gift-modal';
import { CustomDialog } from './custom-dialog';
import { TonIcon } from './ton-icon';
import socketEvents from "../socketEvents";
import {Player} from "@lottiefiles/react-lottie-player";
// @ts-ignore
import translates from '../../../translates';

// Removed hardcoded avatar images - now using real Telegram avatars from tradeData


interface TradeRoomProps {
    socket: any,
    authData: AuthData,
    tradeData: TradeData,
    goBack: () => void;
}

export function TradeRoom({ socket, authData, tradeData, goBack}: TradeRoomProps) {
    const lang = translates[localStorage.getItem('lang') ?? 'ru'];
    const [partnerView, setPartnerView] = useState<'trade' | 'inventory'>('trade');
    const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
    const [isPartnerInventoryModalOpen, setIsPartnerInventoryModalOpen] = useState(false);
    const [selfTotalGifts, setSelfTotalGifts] = useState<Gift[]>([]);//свои подарки в наличии
    const [selfAvailableGifts, setSelfAvailableGifts] = useState<Gift[]>([]);//свои подарки, доступные к обмену
    const [selfSelectedGifts, setSelfSelectedGifts] = useState<Gift[]>([]);//свои подарки, добавленные в обмен
    const [selfTons, setSelfTons] = useState('0');//сумма своих тонов
    const [isSelfAccepted, setIsSelfAccepted] = useState(false);

    const [partnerTotalGifts, setPartnerTotalGifts] = useState<Gift[]>([]);//партнерские подарки в наличии
    const [partnerSelectedGifts, setPartnerSelectedGifts] = useState<Gift[]>([]);//партнерские подарки, добавленные в обмен
    const [partnerTons, setPartnerTons] = useState('0');//сумма партнерских тонов
    const [isPartnerAccepted, setIsPartnerAccepted] = useState(false);

    //const [partnerGifts, setPartnerGifts] = useState<Gift[]>([]);
    const [isGiftsLoaded, setIsGiftsLoaded] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [giftToDelete, setGiftToDelete] = useState<Gift | null>(null);

    // Toast для ошибок
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Переключатель между своим профилем и партнером
    const [activeUser, setActiveUser] = useState<'self' | 'partner'>('self');

    // Диалоги
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showAlreadyAcceptedDialog, setShowAlreadyAcceptedDialog] = useState(false);
    const [showTradeCompletedDialog, setShowTradeCompletedDialog] = useState(false);


    useEffect(() => {
        Gifts.getUserGifts(authData['bearerToken']).then(data => {
            if (data.success) {
                setSelfTotalGifts(data.data.self.filter((i: any) => (i.status == 'active' || i.status == 'withdraw_cancel' || i.status == 'in_trade')));
                setPartnerTotalGifts(data.data.partner.filter((i: any) => (i.status == 'active' || i.status == 'withdraw_cancel' || i.status == 'in_trade')));
                setIsGiftsLoaded(true);
            }
        })
    }, []);

    useEffect(() => {
        if (!isGiftsLoaded) return;

        let selfItems = [];
        let partnerItems = [];
        if (tradeData.isCreator) {
            selfItems = tradeData.user_items.gifts;
            partnerItems = tradeData.partner_items.gifts;
            setIsSelfAccepted(tradeData.user_accepted_at !== '')
            setIsPartnerAccepted(tradeData.partner_accepted_at !== '')
            setSelfTons(tradeData.user_items.tons || '0')
            setPartnerTons(tradeData.partner_items.tons || '0')
        } else {
            selfItems = tradeData.partner_items.gifts;
            partnerItems = tradeData.user_items.gifts;
            setIsSelfAccepted(tradeData.partner_accepted_at !== '')
            setIsPartnerAccepted(tradeData.user_accepted_at !== '')
            setSelfTons(tradeData.partner_items.tons || '0')
            setPartnerTons(tradeData.user_items.tons || '0')
        }

        let newSelectedGifts = [];
        let newAvailableGifts = selfTotalGifts.slice(0);
        if (selfItems) {
            for (let giftId of selfItems) {
                const gift = selfTotalGifts.find(i => i.id == giftId);
                if (gift) {
                    newSelectedGifts.push(gift);
                    newAvailableGifts = newAvailableGifts.filter(i => i.id !== gift.id)
                }
            }
        }
        setSelfSelectedGifts(newSelectedGifts);
        setSelfAvailableGifts(newAvailableGifts);

        newSelectedGifts = [];
        if (partnerItems) {
            for (let giftId of partnerItems) {
                const gift = partnerTotalGifts.find(i => i.id == giftId);
                if (gift) {
                    newSelectedGifts.push(gift);
                }
            }
        }
        setPartnerSelectedGifts(newSelectedGifts);

    }, [isGiftsLoaded, tradeData]);

    /**
     * Обработчик клика на кнопку пользователя
     */
    const handleUserClick = (user: 'self' | 'partner') => {
        // Если кликнули на уже активного партнера - открываем профиль
        if (activeUser === user && user === 'partner') {
            const partnerUsername = tradeData.isCreator ? tradeData.partner : tradeData.user;
            window.open(`https://t.me/${partnerUsername}`, '_blank');
        } else {
            // Иначе просто переключаем вид
            setActiveUser(user);
        }
    };

    /**
     * Показать toast с ошибкой
     */
    const showErrorToast = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    /**
     * Обработчик потери фокуса - отправляем на бэк
     */
    const handleTonBlur = () => {
        // Отправляем запрос с текущим значением TON
        updateRequest(selfSelectedGifts, false, selfTons);
        socket.emit(socketEvents.SOCKET_EVENT_TRADE_UPDATED, {code: tradeData.code, actor: authData.username});
    };

    /**
     * Отмена трейда (убрать галку принятия)
     */
    const handleCancelTrade = () => {
        setShowCancelDialog(true);
    };

    const handleConfirmCancelTrade = () => {
        setShowCancelDialog(false);
        updateRequest([], false, '0', false, true);
        goBack();
        //window.location.reload();
    };

    /**
     * Запрос подтверждения трейда
     */
    const handleAcceptTrade = () => {
        setShowAcceptDialog(true);
    };

    const handleConfirmAcceptTrade = () => {
        setShowAcceptDialog(false);
        // Отправляем запрос с accept=true и текущим значением TON
        updateRequest(selfSelectedGifts, true, selfTons);
    };

    /**
     * Добавил подарок в список обмена
     *
     * @param gift
     */
    const onAddGift = (gift: Gift) => {
        const newSelectedGifts = [...selfSelectedGifts, gift];
        setSelfSelectedGifts(newSelectedGifts);
        setSelfAvailableGifts(selfAvailableGifts.filter(i => i.id !== gift.id));

        // Отправляем весь список подарков на сервер
        updateRequest(newSelectedGifts, false, selfTons);
        socket.emit(socketEvents.SOCKET_EVENT_TRADE_UPDATED, {code: tradeData.code, actor: authData.username});
    };

    /**
     * Подтверждение удаления подарка из модального окна
     */
    const handleConfirmDelete = () => {
        if (giftToDelete) {
            // TODO: Добавить API запрос на удаление подарка из трейда
            // Trades.removeGiftFromTrade(authData['bearerToken'], {
            //     code: tradeData.code,
            //     giftId: giftToDelete.id
            // }).then(data => {
            //     if (data.success) {
            //         onRemoveGift(giftToDelete);
            //         socket.emit(socketEvents.SOCKET_EVENT_TRADE_UPDATED, {code: tradeData.code, actor: authData.username});
            //     }
            // });

            // Пока просто удаляем локально
            onRemoveGift(giftToDelete);
        }
        setShowDeleteModal(false);
        setGiftToDelete(null);
    };

    /**
     * Убрал подарок из списка обмена
     *
     * @param gift
     */
    const onRemoveGift = (gift: Gift) => {
        setSelfAvailableGifts([...selfAvailableGifts, gift]);
        const newSelectedGifts = selfSelectedGifts.filter(i => i.id !== gift.id);
        setSelfSelectedGifts(newSelectedGifts);
        // Отправляем обновленный список подарков (может быть пустым)
        updateRequest(newSelectedGifts, false, selfTons);
        socket.emit(socketEvents.SOCKET_EVENT_TRADE_UPDATED, {code: tradeData.code, actor: authData.username});
    };


    /**
     * Запрос на обновление торгового предложения
     *
     * @param gifts - список ИД подарков
     * @param accept - 1 - принял / 0 - не принял
     * @param tons - опциональный параметр для передачи конкретного значения TON
     * @param silent - не показывать ошибки (для мок режима)
     * @param reloadPage - надо ли обновлять страницу после выполнения операций
     */
    const updateRequest = (gifts: Array<any>, accept: boolean = false, tons?: string, silent: boolean = false, reloadPage: boolean = false) => {
        const giftIds = [];
        for (let gift of gifts) {
            giftIds.push(gift.id);
        }
        const postData = {
            code: tradeData.code,
            gifts: giftIds,
            tons: tons !== undefined ? tons : selfTons,
            accept: accept ? 1 : 0,
        };
        Trades.update(authData['bearerToken'], postData).then(data => {
            if (!data.success) {
                if (silent) {
                    return;
                }
                // Обработка ошибки в формате {'success' => false, 'error' => 'Описание ошибки'}
                const errorMessage = data.error || data.data || lang.trade_room.error_trade;
                showErrorToast(errorMessage);
                return;
            }

            socket.emit(socketEvents.SOCKET_EVENT_TRADE_UPDATED, {code: tradeData.code, actor: authData.username});
            if (data.data && data.data.is_completed) {
                setShowTradeCompletedDialog(true);
            }
            if (reloadPage) {
                setTimeout(function() {
                    window.location.reload();
                }, 500);
            }
        }).catch(() => {
            if (!silent) {
                showErrorToast(lang.trade_room.error_network);
            }
        });
    }

    return (
        <>
            {/* Toast Error Notification */}
            {showToast && (
                <div
                    className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100]"
                    style={{
                        animation: 'slideDown 0.3s ease-out forwards',
                        maxWidth: '340px',
                        width: 'calc(100% - 64px)'
                    }}
                >
                    <div
                        className="rounded-[15px] px-5 py-3"
                        style={{
                            background: 'rgba(30, 30, 30, 0.85)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
                        }}
                    >
                        <p className="text-white text-[15px] font-medium text-center">{toastMessage}</p>
                    </div>
                </div>
            )}

            <div className="h-full flex flex-col" style={{ height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
                <div
                    className="px-4 pt-4 pb-4 scrollbar-hide"
                    style={{
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        flex: '1 1 auto',
                        WebkitOverflowScrolling: 'touch',
                        paddingBottom: '120px',
                        marginBottom: '0'
                    }}
                >

                    {/* Your Side */}
                    <div className="bg-[#303030] rounded-[20px] p-4 mb-6">
                        {/* User Switcher */}
                        <div
                            className="relative bg-[#505050] rounded-[25px] p-1 mb-4"
                            style={{
                                boxShadow: `
                            -0.8px 0 0 0 rgba(180, 180, 180, 0.35),
                            -0.8px -0.3px 0 0 rgba(180, 180, 180, 0.3),
                            -1.2px -0.6px 0 0 rgba(180, 180, 180, 0.2),
                            0.8px 0 0 0 rgba(180, 180, 180, 0.35),
                            0.8px 0.3px 0 0 rgba(180, 180, 180, 0.3),
                            1.2px 0.6px 0 0 rgba(180, 180, 180, 0.2)
                        `
                            }}
                        >
                            {/* Sliding Background */}
                            <div
                                className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#3A3A3A] rounded-[22px] transition-all duration-300 ease-in-out shadow-lg"
                                style={{
                                    left: activeUser === 'self' ? '4px' : 'calc(50% + 0px)',
                                    boxShadow: `
                                -0.8px 0 0 0 rgba(200, 200, 200, 0.4),
                                -0.8px -0.3px 0 0 rgba(200, 200, 200, 0.35),
                                -1.2px -0.6px 0 0 rgba(200, 200, 200, 0.25),
                                0.8px 0 0 0 rgba(200, 200, 200, 0.4),
                                0.8px 0.3px 0 0 rgba(200, 200, 200, 0.35),
                                1.2px 0.6px 0 0 rgba(200, 200, 200, 0.25)
                            `
                                }}
                            />

                            {/* Buttons */}
                            <div className="relative flex">
                                <button
                                    onClick={() => handleUserClick('self')}
                                    className={`flex-1 h-[44px] rounded-[22px] text-[16px] font-semibold transition-colors duration-300 z-10 flex items-center justify-center gap-2 ${
                                        activeUser === 'self' ? 'text-white' : 'text-[#B3B3B3]'
                                    }`}
                                >
                                    <img
                                        src={tradeData.isCreator ? tradeData.user_avatar : tradeData.partner_avatar}
                                        alt="user"
                                        className="w-[24px] h-[24px] rounded-full object-cover"
                                    />
                                    {tradeData.isCreator ? tradeData.user : tradeData.partner}
                                </button>
                                <button
                                    onClick={() => handleUserClick('partner')}
                                    className={`flex-1 h-[44px] rounded-[22px] text-[16px] font-semibold transition-colors duration-300 z-10 flex items-center justify-center gap-2 ${
                                        activeUser === 'partner' ? 'text-white' : 'text-[#B3B3B3]'
                                    }`}
                                >
                                    <img
                                        src={tradeData.isCreator ? tradeData.partner_avatar : tradeData.user_avatar}
                                        alt="partner"
                                        className="w-[24px] h-[24px] rounded-full object-cover"
                                    />
                                    {tradeData.isCreator ? tradeData.partner : tradeData.user}
                                </button>
                            </div>
                        </div>

                        {/* Partner View Toggle - показываем только когда активен партнер */}
                        {activeUser === 'partner' && (
                            <div className="mb-4">
                                <div
                                    className="relative bg-[#505050] rounded-[25px] p-1"
                                    style={{
                                        boxShadow: `
                                    -0.8px 0 0 0 rgba(180, 180, 180, 0.35),
                                    -0.8px -0.3px 0 0 rgba(180, 180, 180, 0.3),
                                    -1.2px -0.6px 0 0 rgba(180, 180, 180, 0.2),
                                    0.8px 0 0 0 rgba(180, 180, 180, 0.35),
                                    0.8px 0.3px 0 0 rgba(180, 180, 180, 0.3),
                                    1.2px 0.6px 0 0 rgba(180, 180, 180, 0.2)
                                `
                                    }}
                                >
                                    {/* Sliding Background */}
                                    <div
                                        className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#3A3A3A] rounded-[22px] transition-all duration-300 ease-in-out shadow-lg"
                                        style={{
                                            left: partnerView === 'trade' ? '4px' : 'calc(50% + 0px)',
                                            boxShadow: `
                                        -0.8px 0 0 0 rgba(200, 200, 200, 0.4),
                                        -0.8px -0.3px 0 0 rgba(200, 200, 200, 0.35),
                                        -1.2px -0.6px 0 0 rgba(200, 200, 200, 0.25),
                                        0.8px 0 0 0 rgba(200, 200, 200, 0.4),
                                        0.8px 0.3px 0 0 rgba(200, 200, 200, 0.35),
                                        1.2px 0.6px 0 0 rgba(200, 200, 200, 0.25)
                                    `
                                        }}
                                    />

                                    {/* Buttons */}
                                    <div className="relative flex">
                                        <button
                                            onClick={() => setPartnerView('trade')}
                                            className={`flex-1 h-[44px] rounded-[22px] text-[16px] font-semibold transition-colors duration-300 z-10 ${
                                                partnerView === 'trade' ? 'text-white' : 'text-[#B3B3B3]'
                                            }`}
                                        >
                                            {lang.trade_room.in_trade}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setPartnerView('inventory');
                                                setIsPartnerInventoryModalOpen(true);
                                            }}
                                            className={`flex-1 h-[44px] rounded-[22px] text-[16px] font-semibold transition-colors duration-300 z-10 ${
                                                partnerView === 'inventory' ? 'text-white' : 'text-[#B3B3B3]'
                                            }`}
                                        >
                                            {lang.trade_room.inventory}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Gift Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {activeUser === 'self' ? (
                                <>
                                    {selfSelectedGifts.map((gift, index) => (
                                        <div
                                            key={gift.id || index}
                                            onClick={() => {
                                                if (isSelfAccepted) {
                                                    setShowAlreadyAcceptedDialog(true);
                                                    return;
                                                }
                                                setGiftToDelete(gift);
                                                setShowDeleteModal(true);
                                            }}
                                            className="aspect-square rounded-[15px] cursor-pointer overflow-hidden relative"
                                        >
                                            <Player
                                                autoplay={true}
                                                loop={true}
                                                src={gift.img}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    pointerEvents: 'none',
                                                }}
                                            />
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    pointerEvents: 'none',
                                                    color: '#ffe823',
                                                    fontSize: '10px',
                                                    textAlign: 'center',
                                                    padding: '2px'
                                                }}
                                            >
                                                {gift.title}
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => {
                                            setIsGiftModalOpen(true);
                                        }}
                                        className="aspect-square rounded-[15px] bg-[#515151] flex items-center justify-center"
                                    >
                                        <Plus className="w-[30px] h-[30px] text-white" />
                                    </button>
                                    {(() => {
                                        const totalItems = selfSelectedGifts.length + 1; // +1 for Plus button
                                        const minRows = 3;
                                        const currentRows = Math.ceil(totalItems / 3);
                                        const displayRows = Math.max(minRows, currentRows);
                                        const totalCells = displayRows * 3;
                                        const emptyCells = totalCells - totalItems;

                                        return [...Array(emptyCells)].map((_, i) => (
                                            <div key={`empty-${i}`} className="aspect-square rounded-[15px] bg-[#515151]" />
                                        ));
                                    })()}
                                </>
                            ) : (
                                <>
                                    {/* Показываем подарки партнера, добавленные в трейд */}
                                    {partnerSelectedGifts.map((gift, index) => (
                                        <div
                                            key={index}
                                            className="aspect-square rounded-[15px] overflow-hidden relative"
                                        >
                                            <Player
                                                autoplay={true}
                                                loop={true}
                                                src={gift.img}
                                                style={{
                                                    width: `100px`,
                                                    height: `100px`,
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    pointerEvents: 'none',
                                                    color: '#ffe823',
                                                    fontSize: '10px',
                                                    textAlign: 'center',
                                                    padding: '2px'
                                                }}
                                            >
                                                {gift.title}
                                            </div>
                                        </div>
                                    ))}
                                    {(() => {
                                        const totalItems = partnerSelectedGifts.length;
                                        const minRows = 3;
                                        const currentRows = Math.ceil(totalItems / 3);
                                        const displayRows = Math.max(minRows, currentRows);
                                        const totalCells = displayRows * 3;
                                        const emptyCells = totalCells - totalItems;

                                        return [...Array(emptyCells)].map((_, i) => (
                                            <div key={`empty-${i}`} className="aspect-square rounded-[15px] bg-[#515151]" />
                                        ));
                                    })()}
                                </>
                            )}
                        </div>

                        {/* TON Amount */}
                        <div>
                            <div className="text-[#999] text-[15px] mb-2 flex items-center gap-1">
                                {activeUser === 'self' ? (
                                    <>{lang.trade_room.add_tons}</>
                                ) : (
                                    <>{lang.trade_room.partner_tons}</>
                                )}
                            </div>
                            <div className="bg-[#1C1C1E] border-2 border-[#595959] rounded-[15px] h-[53px] px-4 flex items-center justify-between transition-colors mb-2">
                                {activeUser === 'self' ? (
                                    <input
                                        type="text"
                                        placeholder="0"
                                        className="bg-transparent text-white text-[20px] outline-none flex-1 placeholder-[#595959]"
                                        value={selfTons}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // Разрешаем только цифры и точку
                                            if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                                setSelfTons(value);
                                            }
                                        }}
                                        onBlur={handleTonBlur}
                                    />
                                ) : (
                                    <span className="text-white text-[20px]">{partnerTons}</span>
                                )}
                                <TonIcon size={16} className="ml-2" />
                            </div>
                        </div>
                    </div>

                    {/* Accept Trade Button */}
                    {!isGiftsLoaded ? (
                        <div className="w-full bg-[#303030] rounded-[25px] h-[55px] flex items-center justify-center mb-3">
                            <span className="text-[#999] text-[18px]">{lang.trade_room.loading}</span>
                        </div>
                    ) : (
                        <>
                            {/* Trade Status - Two blocks in one line */}
                            <div className="flex gap-3 mb-3">
                                {/* Your Status */}
                                {!isSelfAccepted ? (
                                    <button onClick={handleAcceptTrade} className="flex-1 bg-[#007AFF] rounded-[25px] h-[55px] text-white text-[18px] font-semibold">
                                        {lang.trade_room.accept_button}
                                    </button>
                                ) : (
                                    <div className="flex-1 bg-[rgba(108,108,108,0.7)] rounded-[25px] h-[55px] flex items-center justify-center">
                                        <span className="text-white text-[16px] font-semibold">{lang.trade_room.trade_accepted}</span>
                                    </div>
                                )}

                                {/* Partner Status */}
                                {isPartnerAccepted ? (
                                    <div className="flex-1 bg-[rgba(108,108,108,0.7)] rounded-[25px] h-[55px] flex items-center justify-center">
                                        <span className="text-white text-[16px] font-semibold">{lang.trade_room.partner_accepted}</span>
                                    </div>
                                ) : (
                                    <div className="flex-1 bg-[rgba(108,108,108,0.7)] rounded-[25px] h-[55px] flex items-center justify-center">
                                        <span className="text-white text-[16px] font-semibold">{lang.trade_room.partner_waiting}</span>
                                    </div>
                                )}
                            </div>

                            {/* Cancel Trade Button - всегда показываем */}
                            <button onClick={handleCancelTrade} className="w-full bg-[#303030] rounded-[25px] h-[55px] text-red-500 text-[18px] font-semibold">
                                {lang.trade_room.cancel_button}
                            </button>
                        </>
                    )}


                    {/* Gift Selector Modal */}
                    <GiftSelectorModal
                        availableGifts={selfAvailableGifts}
                        isOpen={isGiftModalOpen}
                        onClose={() => setIsGiftModalOpen(false)}
                        onAddGift={onAddGift}
                    />

                    {/* Partner Inventory Modal */}
                    <PartnerInventoryModal
                        partnerGifts={partnerTotalGifts}
                        selectedGifts={partnerSelectedGifts}
                        isOpen={isPartnerInventoryModalOpen}
                        onClose={() => {
                            setIsPartnerInventoryModalOpen(false);
                            setPartnerView('trade');
                        }}
                    />

                    {/* Delete Gift Modal */}
                    <DeleteGiftModal
                        isOpen={showDeleteModal}
                        onClose={() => {
                            setShowDeleteModal(false);
                            setGiftToDelete(null);
                        }}
                        onConfirm={handleConfirmDelete}
                    />

                    {/* Custom Dialogs */}
                    <CustomDialog
                        isOpen={showCancelDialog}
                        title={lang.trade_room.cancel_dialog_title}
                        message={lang.trade_room.cancel_dialog_message}
                        type="confirm"
                        confirmText={lang.trade_room.cancel_dialog_confirm}
                        cancelText={lang.trade_room.back_button}
                        onConfirm={handleConfirmCancelTrade}
                        onCancel={() => setShowCancelDialog(false)}
                    />

                    <CustomDialog
                        isOpen={showAcceptDialog}
                        title={lang.trade_room.accept_dialog_title}
                        message={lang.trade_room.accept_dialog_message}
                        type="confirm"
                        confirmText={lang.trade_room.accept_dialog_confirm}
                        cancelText={lang.trade_room.back_button}
                        onConfirm={handleConfirmAcceptTrade}
                        onCancel={() => setShowAcceptDialog(false)}
                    />

                    <CustomDialog
                        isOpen={showAlreadyAcceptedDialog}
                        title={lang.trade_room.already_accepted_title}
                        message={lang.trade_room.already_accepted_message}
                        type="alert"
                        onConfirm={() => setShowAlreadyAcceptedDialog(false)}
                    />

                    <CustomDialog
                        isOpen={showTradeCompletedDialog}
                        title={lang.trade_room.completed_title}
                        message={lang.trade_room.completed_message}
                        type="alert"
                        onConfirm={() => window.location.reload()}
                    />
                </div>
            </div>
        </>
    );
}