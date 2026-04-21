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

export default class User {

    /**
     * Авторизация по данным telegram initData
     *
     * @param refUser
     * @param initData
     * @param testUser
     * @returns {Promise<{success: boolean}|any>}
     */
    static async login(refUser, initData, testUser = null) {
        console.log('testuser', testUser)

        const result = await fetch(getApiUrl(), {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: initData,
                refUser
            })
        });
        if (!result.ok) {
            return {
                success: false,
                error: `HTTP error! status: ${result.status}`
            };
        }
        return await result.json();
    }

    /**
     * Баланс пользователя внутри системы (не блокчейн)
     *
     * @returns {Promise<{success: boolean}|any>}
     */
    static async getUserData(bearerToken) {
        const result = await fetch(getApiUrl("/api/user?lang=" + localStorage.getItem('lang')), {
            method: 'GET',
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
            error: 'error balance',
            code: result.status,
        }
    }


    /**
     * Запросы на вывод монет или подарков
     *
     * @param bearerToken
     * @param amount
     * @param items
     * @param address
     * @returns {Promise<{success}|any|{success: boolean, error: string}>}
     */
    static async withdraw(bearerToken, items = [], amount = '', address = '') {
        const result = await fetch(getApiUrl("/api/withdraw"), {
            method: 'POST',
            credentials: 'omit',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + bearerToken,
            },
            body: JSON.stringify({
                amount: amount * Math.pow(10, 9),
                items,
                address,
            })
        });

        const data = await result.json();
        if (data.success) {
            return data;
        }
        return {
            success: false,
            data: data.data,
            code: result.status,
        }
    }
}
