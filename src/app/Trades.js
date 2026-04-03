import { BASE_PATH } from '../../config';
export default class Trades {

    /**
     * Обновить свое торговое предложение
     *
     * @param bearerToken
     * @param postData
     * @returns {Promise<{success}|any|{success: boolean}>}
     */
    static async update(bearerToken, postData) {
        const result = await fetch(BASE_PATH + "/api/trade/update", {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            },
            body: JSON.stringify(postData)
        });
        const data = await result.json();
        if (data.success) {
            return data;
        }
        return {
            success: false,
        }
    }

    /**
     * Создать новую ссылку на обмен
     *
     * @param bearerToken
     * @returns {Promise<{success}|any|{success: boolean}>}
     */
    static async create(bearerToken) {
        const result = await fetch(BASE_PATH + "/api/trade/create", {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            },
        });
        const data = await result.json();
        if (data.success) {
            return data;
        }
        return {
            success: false,
        }
    }

    static async status(bearerToken) {
        const result = await fetch(BASE_PATH + "/api/trade/status", {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            },
        });
        const data = await result.json();
        if (data.success) {
            return data;
        }
        return {
            success: false,
        }
    }

    static async info(bearerToken, code) {
        const result = await fetch(BASE_PATH + "/api/trade/info", {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            },
            body: JSON.stringify({code})
        });
        const data = await result.json();
        if (data.success) {
            return data;
        }
        return {
            success: false,
        }
    }


    /**
     * Получить историю торгов
     *
     * @param bearerToken
     * @param page
     * @returns {Promise<{success}|any|{success: boolean}>}
     */
    static async getUserHistory(bearerToken, page = 1) {
        const result = await fetch(BASE_PATH + "/api/trade/history/user?page=" + page, {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            },
        });
        const data = await result.json();
        if (data.success) {
            return data;
        }
        return {
            success: false,
        }
    }


    /**
     * Получить историю торгов
     *
     * @param bearerToken
     * @param page
     * @returns {Promise<{success}|any|{success: boolean}>}
     */
    static async getLastHistory(bearerToken, page = 1) {
        const result = await fetch(BASE_PATH + "/api/trade/history/last?page=" + page, {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            },
        });
        const data = await result.json();
        if (data.success) {
            return data;
        }
        return {
            success: false,
        }
    }

    /**
     * Подключение к трейду, подключиться может только первый партнер
     *
     * @param bearerToken
     * @param code
     * @returns {Promise<{success}|any|{success: boolean}>}
     */
    static async connectToTrade(bearerToken, code) {
        const result = await fetch(BASE_PATH + "/api/trade/connect", {
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