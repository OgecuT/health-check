import { Log } from './notifiers/log.js';
import { Telegram } from './notifiers/telegram.js';

export class Sender {
    /** @type {ReturnType<import('./config/config').createConfig>} */
    #config;
    #notifiers = [];

    constructor(config) {
        this.#config = config;

        this.#notifiers.push(new Log(config));

        if (config.telegram.botToken && Array.isArray(config.telegram.chatId) && config.telegram.chatId.length > 0) {
            this.#notifiers.push(new Telegram(config));
        }
    }

    async send(message) {
        const preparedMessage = `[${this.#config.serverLabel}]\n${message}`;

        for (const notifier of this.#notifiers) {
            if (notifier instanceof Telegram) {
                await notifier.send(`<b>${this.#config.serverLabel}</b>\n${message}`);
                continue;
            }

            await notifier.send(preparedMessage);
        }
    }
}
