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

export default class Trades {

    /**
     * Обновить свое торговое предложение
     *
     * @param bearerToken
     * @param postData
     * @returns {Promise<{success}|any|{success: boolean}>}
     */
    static async update(bearerToken, postData) {
        const result = await fetch(getApiUrl("/api/trade/update"), {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            },
            body: JSON.stringify(postData)
        });
        return await result.json();
    }

    /**
     * Создать новую ссылку на обмен
     *
     * @param bearerToken
     * @returns {Promise<{success}|any|{success: boolean}>}
     */
    static async create(bearerToken) {
        const result = await fetch(getApiUrl("/api/trade/create"), {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            },
        });
        return await result.json();
    }

    static async status(bearerToken) {
        const result = await fetch(getApiUrl("/api/trade/status"), {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            },
        });
        return await result.json();
    }

    static async info(bearerToken, code) {
        const result = await fetch(getApiUrl("/api/trade/info"), {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            },
            body: JSON.stringify({code})
        });
        return await result.json();
    }


    /**
     * Получить историю торгов
     *
     * @param bearerToken
     * @param page
     * @returns {Promise<{success}|any|{success: boolean}>}
     */
    static async getUserHistory(bearerToken, page = 1) {
        const result = await fetch(getApiUrl("/api/trade/history/user?page=" + page), {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            },
        });
        return await result.json();
    }


    /**
     * Получить историю торгов
     *
     * @param bearerToken
     * @param page
     * @returns {Promise<{success}|any|{success: boolean}>}
     */
    static async getLastHistory(bearerToken, page = 1) {
        const result = await fetch(getApiUrl("/api/trade/history/last?page=" + page), {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            },
        });
        return await result.json();
    }

    /**
     * Подключение к трейду, подключиться может только первый партнер
     *
     * @param bearerToken
     * @param code
     * @returns {Promise<{success}|any|{success: boolean}>}
     */
    static async connectToTrade(bearerToken, code) {
        const result = await fetch(getApiUrl("/api/trade/connect"), {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            },
            body: JSON.stringify({ code })
        });
        return await result.json();
    }
}