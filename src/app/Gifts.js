import { BASE_PATH } from '../../config';
export default class Gifts {

    /**
     * Список подарков пользователя
     *
     * @returns {Promise<{success: boolean}|any>}
     */
    static async getUserGifts(bearerToken) {
        const result = await fetch(BASE_PATH + "/api/gifts", {
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
            error: 'error gifts',
        }
    }
}