import TelegramBot from 'node-telegram-bot-api';

export class Telegram {
    /** @type {TelegramBot} */
    #bot;
    /** @type {string[]} */
    #chats;

    /**
     * @param {ReturnType<typeof import('./config/config.js').createConfig>} config
     */
    constructor(config) {
        this.#bot = new TelegramBot(config.telegram.botToken, { polling: false });
        this.#chats = config.telegram.chatIds ?? [];
    }

    /**
     *
     * @param {string} message
     * @returns {Promise<void>}
     */
    async send(message) {
        for (const chat of this.#chats) {
            await this.#bot.sendMessage(chat, message, { parse_mode: 'HTML' });
        }
    }
}
