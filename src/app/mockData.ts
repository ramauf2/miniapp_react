import { TradeData } from './interface/TradeData';

// Флаг для включения/выключения мок данных
// Установите в false, чтобы отключить моки
export const USE_MOCK_DATA = false;

// Мок данные для активного трейда
export const mockActiveTrade: TradeData = {
    isCreator: true,
    code: 'mock1234567890ab',
    user_items: {
        gifts: [1, 2, 3],
        tons: '0.5',
    },
    partner_items: {
        gifts: [4, 5],
        tons: '1.0',
    },
    connected_at: new Date().toISOString(),
    user_accepted_at: '',
    partner_accepted_at: '',
    user: 'mock_user',
    user_avatar: '/images/profile.png',
    partner: 'mock_partner',
    partner_avatar: '/images/profile.png',
    is_completed: false,
};

/**
 * Функция для получения мок данных только если нет реальных данных
 * @param realData - реальные данные с сервера
 * @returns реальные данные или мок данные
 */
export function getMockTradeIfNeeded(realData: TradeData | null): TradeData | null {
    // Если USE_MOCK_DATA выключен, всегда возвращаем реальные данные
    if (!USE_MOCK_DATA) {
        return realData;
    }
    
    // Если есть реальные данные, используем их
    if (realData && realData.partner) {
        return realData;
    }
    
    // Если реальных данных нет, возвращаем мок
    return mockActiveTrade;
}
