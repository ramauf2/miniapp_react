import { BASE_PATH, VALIDATOR_PORT } from '../../config';
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
        if (testUser === 'ramauf') {
            initData = 'user=%7B%22id%22%3A350647946%2C%22first_name%22%3A%22rock%22%2C%22last_name%22%3A%22zulla%22%2C%22username%22%3A%22ramauf%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2F3tWH1YG5fa4HMp1IbxIOEFVDryV4aybiIuU9nceMSrg.svg%22%7D&chat_instance=3079624169501860943&chat_type=sender&auth_date=1776627763&signature=sapYxBHk30MJUZmjd8hQwRCVkp0Al2P8WSZroryYO5e68xLdCWGxeD8hxA37GhmhVV2DYvnB-5b94_RBqS6vDw&hash=dab94d33ebc9f70546f83a19f574f3b631f51fc8c3978a8d579b4bb2ea03622d';
        }
        if (testUser === 'ramauf2') {
            initData = 'user=%7B%22id%22%3A6663933274%2C%22first_name%22%3A%22Karina%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22ramauf2%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Fa5CHtLObpSjs6qJukOHR3kGAb555hKAI71YjsBZFT0U21jBwp4f7fRuPAB4__Oug.svg%22%7D&chat_instance=-7678760425310471093&chat_type=sender&auth_date=1776627285&signature=WojQKjBT83t4aVZ8RDkMtrCMLRemnrVfIwJc24dgrS9AHX9Mdon9rvYFr5jI-EzBeh4IXEmZJ01g50iBVSb1Cw&hash=217a96f658cda84d9b0415be26e40103de88f44351ae7185a25d49353a2e240f';
        }

        const result = await fetch(BASE_PATH + ":" + VALIDATOR_PORT, {
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
        const result = await fetch(BASE_PATH + "/api/user?lang=" + localStorage.getItem('lang'), {
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
        const result = await fetch(BASE_PATH + "/api/withdraw", {
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
