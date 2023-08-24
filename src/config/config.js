const parsePeriod = (period) => {
    const defaultPeriod = 10;

    if (!period) {
        return defaultPeriod;
    }

    const parsedPeriod = Number.parseInt(period, 10);

    if (isNaN(parsedPeriod)) {
        return defaultPeriod;
    }

    return parsedPeriod < defaultPeriod ? defaultPeriod : parsedPeriod;
};

const parseBoolean = (value) => {
    return value === 'true' || value === '1' || value === true;
};

export const createConfig = () => {
    return Object.freeze({
        env: process.env.NODE_ENV || 'production',

        containerName: process.env.CONTAINER_NAME,
        labelEnable: parseBoolean(process.env.LABEL_ENABLE),
        onlyOfflineStates: parseBoolean(process.env.ONLY_OFFLINE_STATES),
        excludeExited: parseBoolean(process.env.EXCLUDE_EXITED),
        period: parsePeriod(process.env.PERIOD),
        disableStartupMsg: parseBoolean(process.env.DISABLE_STARTUP_MSG),
        serverLabel: process.env.SERVER_LABEL,

        telegram: {
            botToken: process.env.TELEGRAM_BOT_TOKEN,
            chatIds: process.env.TELEGRAM_CHAT_IDS.split(','),
        },
    });
};

/**
 * @param {ReturnType<typeof import('./config/config.js').createConfig>} config
 */
export const validateConfig = (config) => {
    if (!config.containerName) {
        throw new Error('CONTAINER_NAME is not defined');
    }

    if (!config.serverLabel) {
        throw new Error('SERVER_LABEL is not defined');
    }
};
