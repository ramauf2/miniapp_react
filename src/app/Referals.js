import { BASE_PATH } from '../../config';
export default class Referals {

    /**
     * Получить историю реферальных сделок
     *
     * @param bearerToken
     * @param page
     * @returns {Promise<{success}|any|{success: boolean}>}
     */
    static async getHistory(bearerToken, page = 1) {
        const result = await fetch(BASE_PATH + "/api/referals?page=" + page, {
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

}