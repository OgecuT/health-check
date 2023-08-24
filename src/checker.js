export class Checker {
    /** @type {ReturnType<import('./config/config').createConfig>} */
    #config;
    /** @type {import('dockerode').Docker} */
    #docker;
    /** @type {Sender} */
    #sender;

    #isFirstRun = true;
    #containersState = [];
    #offlineStates = ['exited', 'dead', 'running (unhealthy)', 'paused'];
    #opts = {};

    /**
     * @param {ReturnType<typeof import('./config/config.js').createConfig>} config
     * @param {import('dockerode').Docker} docker
     * @param {Sender} sender
     */
    constructor(config, docker, sender) {
        this.#config = config;
        this.#docker = docker;
        this.#sender = sender;

        if (this.#config.labelEnable) {
            this.#opts.filters = `{"label": ["${this.#config.containerName}.enable=true"]}`;
        } else {
            this.#opts.all = true;
        }
    }

    async execute() {
        // Check for changes in status (first run is populating data only)
        const newContainersState = [];
        const firstRunMessages = [];

        /** @type {import('dockerode').ContainerInfo[]} */
        const containers = await this.#docker.listContainers(this.#opts);

        for (const c of containers) {
            const name = c.Names[0].replace('/', '');

            // If LABEL_ENABLE is false then exclude any specifically false labelled containers
            if (!this.#config.labelEnable && c.Labels[`${this.#config.containerName}.enable`] === 'false') {
                if (this.#isFirstRun === true) {
                    await this.#sender.send(`Excluding: ${name}`);
                }
            } else {
                // Determine if covered by healthcheck
                let hcStatus = '';
                if (c.Status.includes('(healthy)')) {
                    hcStatus = '(healthy)';
                }

                if (c.Status.includes('(unhealthy)')) {
                    hcStatus = '(unhealthy)';
                }

                const key = `${c.Id},${c.State},${c.Names[0]},${hcStatus}`;

                if (this.#containersState.length !== 0 && this.#containersState.includes(key) === false) {
                    // EXCLUDE_EXITED status if set
                    if (this.#config.excludeExited && c.State.toLocaleLowerCase() === 'exited') {
                        // ignore!
                    } else {
                        // if ONLY_OFFLINE_STATES is set, then only show state changes that are offline
                        if (this.#config.onlyOfflineStates) {
                            if (this.#offlineStates.includes(c.State) || this.#offlineStates.includes(`${c.State} ${hcStatus}`)) {
                                await this.#sender.send(`${name}: ${c.State} ${hcStatus}`);
                            }
                        } else {
                            await this.#sender.send(`${name}: ${c.State} ${hcStatus}`);
                        }
                    }
                }

                if (this.#isFirstRun === true) {
                    // If LABEL_ENABLE is true, list the specifically included containers
                    if (this.#config.labelEnable && c.Labels[`${this.#config.containerName}.enable`] === 'true') {
                        firstRunMessages.push(`Monitoring: ${name}, status: ${c.State} ${hcStatus}`);
                    }
                }

                // Create new container array
                newContainersState.push(key);
            }
        }

        // Check if any containers have been deleted between scans
        if (this.#containersState.length !== 0) {
            for (const c of this.#containersState) {
                const delArray = newContainersState.filter((nc) => nc.includes(c.split(',')[0]));

                // If no match in history array and latest scan, then is deleted
                if (delArray.length === 0 && !this.#config.excludeExited) {
                    await this.#sender.send(`${c.split(',')[2].replace('/', '')}: exited`);
                }
            }
        }

        // Sets the new state of the containers
        this.#containersState = newContainersState;

        if (this.#isFirstRun === true) {
            if (firstRunMessages.length > 0) {
                await this.#sender.send(firstRunMessages.join('\n'));
            }

            this.#isFirstRun = false;
        }
    }
}
