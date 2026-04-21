import { BASE_PATH, VALIDATOR_PORT } from '../../config';

// Функция для формирования URL с учетом порта
const getApiUrl = (path = '') => {
    // Если BASE_PATH уже содержит протокол (http/https), не добавляем порт
    if (BASE_PATH.startsWith('http://') || BASE_PATH.startsWith('https://')) {
        return BASE_PATH + path;
    }
    // Иначе добавляем порт (для локальной разработки)
    return BASE_PATH + ':' + VALIDATOR_PORT + path;
};

export default class Gifts {

    /**
     * Список подарков пользователя
     *
     * @returns {Promise<{success: boolean}|any>}
     */
    static async getUserGifts(bearerToken) {
        const result = await fetch(getApiUrl("/api/gifts"), {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            },
        });
        return await result.json();
    }
}