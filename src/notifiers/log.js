export class Log {
    constructor(config) {
        this.config = config;
    }

    async send(message) {
        console.info(message);
    }
}
