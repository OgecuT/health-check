import Docker from 'dockerode';
import { Checker } from './checker.js';
import { createConfig, validateConfig } from './config/config.js';
import { Sender } from './sender.js';
import { sleep } from './utils.js';

/**
 * @param {ReturnType<typeof import('./config/config.js').createConfig>} config
 * @param {Sender} sender
 */
const informer = async (config, sender) => {
    if (config.disableStartupMsg) {
        await sender.send(`Monitoring started
         - Messaging platforms: Telegram
         - Polling period: ${config.period} seconds
         - Only offline state monitoring: ${config.onlyOfflineStates}
         - Only include labelled containers: ${config.labelEnable}
         - Do not monitor 'Exited': ${config.excludeExited}
         - Disable Startup Messages: ${config.disableStartupMsg}
        `);
    }
};

export const run = async () => {
    const config = createConfig();
    validateConfig(config);

    const docker = new Docker({
        socketPath: '/var/run/docker.sock',
    });

    const sender = new Sender(config);
    const checker = new Checker(config, docker, sender);

    const check = async () => {
        await checker.execute();

        await sleep(config.period * 1000);
        await check();
    };

    await informer(config, sender);
    await check();
};
