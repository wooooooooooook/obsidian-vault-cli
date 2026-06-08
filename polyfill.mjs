// localStorage polyfill for Node.js headless mode
if (typeof globalThis.localStorage === 'undefined') {
    const _store = {};
    globalThis.localStorage = {
        getItem: (k) => _store[k] ?? null,
        setItem: (k, v) => { _store[k] = String(v); },
        removeItem: (k) => { delete _store[k]; },
        clear: () => { Object.keys(_store).forEach(k => delete _store[k]); },
        key: (i) => Object.keys(_store)[i] ?? null,
        get length() { return Object.keys(_store).length; },
    };
}
