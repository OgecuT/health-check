/**
 * Sleep for a given amount of time
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
export const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};
