export const $storage = {
    get: (key) => {
        const result = localStorage.getItem(key);

        if (!result) {
            return result;
        }

        try {
            return JSON.parse(result);
        } catch (error) {
            return result;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            localStorage.setItem(key, value);
        }
    },
    remove(key) {
        localStorage.removeItem(key);
    },
    clear() {
        localStorage.clear();
    },
};
