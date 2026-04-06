const fs = require('fs');
const {Api} = require("telegram");
const https = require("https");
const TonWeb = require("tonweb");
const {keyPairFromSecretKey} = require("@ton/crypto");


/**
 * Логирует данные в файл в папке logs
 *
 * @param data
 * @param file
 */
function log(data, file = 'log.log') {
    fs.appendFileSync('logs/' + file, '[' + (new Date()) + '] ' + JSON.stringify(data) + "\n\n");
}

/**
 * Возвращает текущую дату в формате Laravel timestamp "YYYY-MM-DD HH:MM:SS"
 *
 * @returns {string}
 */
function dateNow() {
    return laravelTimestamp();
}

/**
 * Форматирует дату в формат Laravel timestamp "YYYY-MM-DD HH:MM:SS"
 *
 * @param date
 * @returns {string}
 */
function laravelTimestamp(date = new Date()) {
    // toISOString() → "2023-06-17T15:34:45.000Z"
    // берём только первую часть до секунд и заменяем “T” на пробел
    return date.toISOString().slice(0, 19).replace('T', ' ');
}

async function getAvatarFile(apiBot, apiToken, userId) {
    let result = {
        success: false,
        url: '',
    }
    try {
        const profilePhotos = await apiBot.getUserProfilePhotos(parseInt(userId));
        if (profilePhotos.total_count === 0) {
            result.error = 'У пользователя нет аватара';
            return result;
        }

        // Берем последнюю добавленную фотографию (самую маленькую доступную)
        const fileId = profilePhotos.photos[0][0].file_id;
        const file = await apiBot.getFile(fileId);
        const ext = file.file_path.split('.').pop();
        const newFilePath = `avatars/${userId}.${ext}`;
        await downloadFile(`https://api.telegram.org/file/bot${apiToken}/${file.file_path}`, newFilePath);
        result.success = true;
        result.url = newFilePath;
    } catch (error) {
        //console.error('[' + Date.now() + '] Error avatar:', error);
        result.error = 'Не удалось получить аватар';
    }
    return result;
}

/**
 * Bot - Скачивает файлы подарка (например, стикеры .tgs) и сохраняет их в указанную папку
 *
 * @param apiBot
 * @param apiToken
 * @param message
 * @param dir
 * @returns {Promise<{success: boolean, files: *[], attributes: *[], msgId, transferStars: number | {}, giftId: string, fromId, title: string}>}
 */
async function getGiftFileByBot(apiBot, apiToken, message, dir) {
    let result = {
        success: false,
        files: [],
        attributes: [],
        msgId: message.message_id,
        transferStars: message.unique_gift.transfer_star_count,
        giftId: message.unique_gift.gift.gift_id,
        fromId: message.from.id,
        title: message.unique_gift.gift.base_name,
    };
    const gift = message.unique_gift.gift;
    const modelSticker = gift.model.sticker;
    const symbolSticker = gift.symbol.sticker;

    dir = dir + '/' + gift.gift_id;
    fs.mkdirSync(dir, { recursive: true });

    try {
        const modelTgsFile = await apiBot.getFile(modelSticker.file_id);
        await downloadFile(`https://api.telegram.org/file/bot${apiToken}/${modelTgsFile.file_path}`, dir + '/' + modelSticker.custom_emoji_id + '.tgs');
        const modelPngFile = await apiBot.getFile(modelSticker.thumbnail.file_id);
        await downloadFile(`https://api.telegram.org/file/bot${apiToken}/${modelPngFile.file_path}`, dir + '/' + modelSticker.custom_emoji_id + '.png');

        result.files.push({
            png: modelSticker.custom_emoji_id + '.png',
            tgs: modelSticker.custom_emoji_id + '.tgs',
            class: 'StarGiftAttributeModel',
        })

        const symbolTgsFile = await apiBot.getFile(symbolSticker.file_id);
        await downloadFile(`https://api.telegram.org/file/bot${apiToken}/${symbolTgsFile.file_path}`, dir + '/' + symbolSticker.custom_emoji_id + '.tgs');
        const symbolPngFile = await apiBot.getFile(symbolSticker.thumbnail.file_id);
        await downloadFile(`https://api.telegram.org/file/bot${apiToken}/${symbolPngFile.file_path}`, dir + '/' + symbolSticker.custom_emoji_id + '.png');

        result.files.push({
            png: symbolSticker.custom_emoji_id + '.png',
            tgs: symbolSticker.custom_emoji_id + '.tgs',
            class: 'StarGiftAttributePattern',
        })

        result.attributes.push({
            name: gift.model.name,
            rarity: gift.model.rarity_per_mille,
            class: "StarGiftAttributeModel"
        })
        result.attributes.push({
            name: gift.symbol.name,
            rarity: gift.symbol.rarity_per_mille,
            class: "StarGiftAttributePattern"
        })
        result.attributes.push({
            name: gift.backdrop.name,
            rarity: gift.backdrop.rarity_per_mille,
            class: "StarGiftAttributeBackdrop"
        })

        result.success = true;
        return result;
    } catch (error) {
        console.error('[' + Date.now() + '] Ошибка при скачивании файлов bot api:', error);
        return result;
    }
}

/**
 * Загрузить файл
 *
 * @param url
 * @param destination
 * @returns {Promise<unknown>}
 */
function downloadFile(url, destination) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destination);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(destination);
            reject(err);
        });
    });
}

/**
 * Client - Скачивает файлы подарка (например, стикеры .tgs) и сохраняет их в указанную папку
 *
 * @param apiClient
 * @param message
 * @param dir
 * @returns {Promise<{success: boolean}|{success: boolean, msgId, transferStars: *, giftId, fromId, title, files: *[], attributes: *[]}>}
 */
async function getGiftFileByClient(apiClient, message, dir) {
    let result = {
        success: false,
        files: [],
        attributes: [],
    };
    let error = false;
    try {
        if (message.hasOwnProperty('action') && message.action.className === 'MessageActionStarGiftUnique') {//онлайн сообщение
            gift = message.action;
            result.msgId = message.id;
            result.transferStars = gift.transferStars;
            result.giftId = gift.gift.id;
            result.fromId = message.peerId.userId;
            result.title = gift.gift.title;
            let attributes = [];
            for (let attr of gift.gift.attributes) {
                if (['StarGiftAttributeModel', 'StarGiftAttributePattern', 'StarGiftAttributeBackdrop'].indexOf(attr.className) > -1) {
                    attributes.push({
                        name: attr.name,
                        rarity: attr.rarityPermille,
                        class: attr.className,
                    });
                }
            }
            result.attributes = attributes;
        } else {//сообщение из истории
            gift = message;
            result.msgId = gift.msgId;
            result.transferStars = gift.transferStars;
            result.giftId = gift.gift.id;
            result.fromId = gift.fromId.userId;
            result.title = gift.gift.title;
        }
        const tgsAttributes = gift.gift.attributes.filter(a => a.document && a.document.mimeType === 'application/x-tgsticker');
        if (tgsAttributes.length === 0) {
            return {
                success: false,
            }
        }
        dir = dir + '/' + gift.gift.id;
        fs.mkdirSync(dir, { recursive: true });
        for (const attr of tgsAttributes) {
            const doc = attr.document;
            const fileReference =
                Buffer.isBuffer(doc.fileReference)
                    ? doc.fileReference
                    : Buffer.from(doc.fileReference?.data || []);
            const loc_tgs = new Api.InputDocumentFileLocation({
                id: BigInt(doc.id),
                accessHash: BigInt(doc.accessHash),
                fileReference,
                thumbSize: ''
            });

            const loc_png = new Api.InputDocumentFileLocation({
                id: BigInt(doc.id),
                accessHash: BigInt(doc.accessHash),
                fileReference,
                thumbSize: 'm',
            });
            result.files.push({
                png: doc.id + '.png',
                tgs: doc.id + '.tgs',
                class: attr.className,
            })
            try {
                fs.writeFileSync(dir + '/' + doc.id + '.tgs', await apiClient.downloadFile(loc_tgs, { dcId: doc.dcId }));
                fs.writeFileSync(dir + '/' + doc.id + '.png', await apiClient.downloadFile(loc_png, { dcId: doc.dcId }));
            } catch (downloadError) {
                error = true;
                console.error('[' + Date.now() + '] Ошибка при скачивании файлов client api:', downloadError);
            }
        }
        result.success = !error;
        return result;
    } catch (error) {
        console.error('[' + Date.now() + '] Ошибка при формировании файлов client api:', error);
        return result;
    }

}

//---------------------------------------функции вывода--------------------------------
function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
}

async function sendTon(privateHex, toAddress, amount, message) {
    const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'));
    try {
        const keyPair = keyPairFromSecretKey(hexToBytes(privateHex));
        const WalletClass = tonweb.wallet.all['v4R2'];
        const wallet = new WalletClass(tonweb.provider, {
            publicKey: keyPair.publicKey,
            wc: 0
        });


        const to = new TonWeb.utils.Address(toAddress);
        const seqno = await wallet.methods.seqno().call();

        const transfer = wallet.methods.transfer({
            secretKey: keyPair.secretKey,
            toAddress: to,
            //amount: TonWeb.utils.toNano(amount.toString()),
            amount: amount.toString(),
            seqno: seqno || 0,
            payload: message,
            sendMode: 3
        });
        await transfer.send();
        const trData = await (await transfer.getQuery()).hash();
        const uint8Array = new Uint8Array(trData);
        return {
            success: true,
            data: Buffer.from(uint8Array.buffer).toString('hex')
        };
    } catch (error) {
        console.error('[' + Date.now() + '] Transaction error: ', error.message);
        return {
            success: false,
            data: error.message
        };
    }
}

async function sendGift(apiClient, msgId, userEntity) {
    try {
        const invoice = new Api.InputInvoiceStarGiftTransfer({
            stargift: (new Api.InputSavedStarGiftUser({msgId: parseInt(msgId)})),
            toId: await apiClient.getInputEntity(userEntity)
        })
        const paymentForm = await apiClient.invoke(
            new Api.payments.GetPaymentForm({
                invoice: invoice,
            })
        );

        const sendGift = await apiClient.invoke(
            new Api.payments.SendStarsForm({
                formId: paymentForm.formId,
                invoice: invoice,
            })
        );
        return {
            success: true,
            data: {
                request: {
                    msgId,
                    userEntity,
                },
                result: {
                    paymentForm,
                    sendGift,
                },
            }
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            data: {
                request: {
                    msgId,
                    userEntity,
                },
                result: error.message,
            }
        }
    }
}

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
    dateNow,
    log,
    getGiftFileByClient,
    getGiftFileByBot,
    getAvatarFile,
    sendTon,
    sendGift,
    sleep,
}