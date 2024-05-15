import { ref, onMounted, onUnmounted, watch, computed, reactive, provide } from 'vue';

function windowExists() {
    return typeof window !== 'undefined';
}
function windowHasFeature(feature) {
    return windowExists() && feature in window;
}

function useMediaQuery(query, callback) {
    let mediaQuery;
    const matches = ref(false);
    function listener(ev) {
        if (callback)
            callback(ev);
        matches.value = ev.matches;
    }
    function cleanup() {
        if (mediaQuery) {
            mediaQuery.removeEventListener('change', listener);
            mediaQuery = undefined;
        }
    }
    function setup(newQuery = query) {
        cleanup();
        if (windowHasFeature('matchMedia') && newQuery) {
            mediaQuery = window.matchMedia(newQuery);
            mediaQuery.addEventListener('change', listener);
            matches.value = mediaQuery.matches;
        }
    }
    onMounted(() => setup());
    onUnmounted(() => cleanup());
    return { matches, setup, cleanup };
}

function useResizeObserver(target, callback, options = {}) {
    let observer;
    const rect = ref();
    const listener = (...args) => {
        if (callback)
            callback(...args);
        const entry = args[0][0];
        rect.value = entry.contentRect;
    };
    const stopObserver = () => {
        if (observer) {
            observer.disconnect();
            observer = undefined;
        }
    };
    const stopWatch = watch(() => target.value, (elOrComp) => {
        stopObserver();
        if (windowHasFeature('ResizeObserver') && elOrComp) {
            observer = new ResizeObserver(listener);
            observer.observe(elOrComp.$el ?? elOrComp, options);
        }
    }, { immediate: true, flush: 'post' });
    const cleanup = () => {
        stopObserver();
        stopWatch();
    };
    onUnmounted(() => cleanup());
    return { rect, cleanup };
}

function useDarkMode(config) {
    const isDark = ref(false);
    const displayMode = computed(() => (isDark.value ? 'dark' : 'light'));
    let mediaQuery;
    let mutationObserver;
    function mqListener(ev) {
        isDark.value = ev.matches;
    }
    function setupSystem() {
        if (windowHasFeature('matchMedia')) {
            mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', mqListener);
            isDark.value = mediaQuery.matches;
        }
    }
    function moListener() {
        const { selector = ':root', darkClass = 'dark' } = config.value;
        const el = document.querySelector(selector);
        isDark.value = el.classList.contains(darkClass);
    }
    function setupClass(config) {
        const { selector = ':root', darkClass = 'dark' } = config;
        if (windowExists() && selector && darkClass) {
            const el = document.querySelector(selector);
            if (el) {
                mutationObserver = new MutationObserver(moListener);
                mutationObserver.observe(el, {
                    attributes: true,
                    attributeFilter: ['class'],
                });
                isDark.value = el.classList.contains(darkClass);
            }
        }
    }
    function setup() {
        stopObservers();
        const type = typeof config.value;
        if (type === 'string' && config.value.toLowerCase() === 'system') {
            setupSystem();
        }
        else if (type === 'object') {
            setupClass(config.value);
        }
        else {
            isDark.value = !!config.value;
        }
    }
    const stopWatch = watch(() => config.value, () => setup(), {
        immediate: true,
    });
    function stopObservers() {
        if (mediaQuery) {
            mediaQuery.removeEventListener('change', mqListener);
            mediaQuery = undefined;
        }
        if (mutationObserver) {
            mutationObserver.disconnect();
            mutationObserver = undefined;
        }
    }
    function cleanup() {
        stopObservers();
        stopWatch();
    }
    onUnmounted(() => cleanup());
    return {
        isDark,
        displayMode,
        cleanup,
    };
}

function resolveValue({ 'min-width': _minWidth, min = _minWidth, max, raw } = {}) {
    return { min, max, raw };
}
/**
 * A function that normalizes the various forms that the screens object can be
 * provided in.
 *
 * Input(s):
 *   - ['100px', '200px'] // Raw strings
 *   - { sm: '100px', md: '200px' } // Object with string values
 *   - { sm: { min: '100px' }, md: { max: '100px' } } // Object with object values
 *   - { sm: [{ min: '100px' }, { max: '200px' }] } // Object with object array (multiple values)
 *
 * Output(s):
 *   - [{ name: 'sm', values: [{ min: '100px', max: '200px' }] }] // List of objects, that contains multiple values
 */
function normalizeScreens(screens, root = true) {
    if (Array.isArray(screens)) {
        return screens.map((screen) => {
            if (root && Array.isArray(screen)) {
                throw new Error('The tuple syntax is not supported for `screens`.');
            }
            if (typeof screen === 'string') {
                return { name: screen.toString(), values: [{ min: screen, max: undefined }] };
            }
            let [name, options] = screen;
            name = name.toString();
            if (typeof options === 'string') {
                return { name, values: [{ min: options, max: undefined }] };
            }
            if (Array.isArray(options)) {
                return { name, values: options.map((option) => resolveValue(option)) };
            }
            return { name, values: [resolveValue(options)] };
        });
    }
    return normalizeScreens(Object.entries(screens ?? {}), false);
}

// This function gratuitously borrowed from TailwindCSS
// https://github.com/tailwindcss/tailwindcss/blob/master/src/util/buildMediaQuery.js
function buildMediaQuery(screenValues) {
    return screenValues
        .map((sv) => {
        if (sv.raw !== undefined)
            return sv.raw;
        return [sv.min && `(min-width: ${sv.min})`, sv.max && `(max-width: ${sv.max})`].filter(Boolean).join(' and ');
    })
        .join(', ');
}

var defaultScreens = {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
};

const defaultInjectKey = '$screens';
function initScreens(screens) {
    const state = reactive({
        screens: normalizeScreens(screens || defaultScreens),
        queries: {},
        matches: {},
        hasSetup: false,
    });
    function refreshMatches() {
        Object.entries(state.queries).forEach(([key, query]) => {
            state.matches[key] = query.matches;
        });
    }
    function mapList(config) {
        return computed(() => Object.keys(state.matches)
            .filter((key) => state.matches[key] === true && config.hasOwnProperty(key))
            .map((key) => config[key]));
    }
    const list = computed(() => Object.keys(state.matches).filter((k) => state.matches[k]));
    function mapCurrent(config, def) {
        return computed(() => {
            const curr = current.value;
            if (curr && config.hasOwnProperty(curr))
                return config[curr];
            return def;
        });
    }
    const current = computed(() => {
        const arr = list.value;
        if (arr.length)
            return arr[arr.length - 1];
        return '';
    });
    function cleanup() {
        Object.values(state.queries).forEach((query) => query.removeEventListener('change', refreshMatches));
        state.queries = {};
        state.matches = {};
    }
    if (!state.hasSetup && windowHasFeature('matchMedia')) {
        cleanup();
        state.queries = state.screens.reduce((result, { name, values }) => {
            const mediaQuery = window.matchMedia(buildMediaQuery(values));
            mediaQuery.addEventListener('change', refreshMatches);
            result[name] = mediaQuery;
            return result;
        }, {});
        refreshMatches();
        state.hasSetup = true;
    }
    return { matches: state.matches, list, mapList, current, mapCurrent, cleanup };
}

function useScreens(screens, opts) {
    const s = initScreens(screens);
    provide(opts?.injectKey || defaultInjectKey, s);
    onUnmounted(() => s.cleanup());
    return s;
}

const plugin = {
    install: (app, screens, opts) => {
        const s = initScreens(screens);
        const key = opts?.injectKey || defaultInjectKey;
        // Inject a globally available screens object method
        app.config.globalProperties[key] = s;
        // Provide screens object
        app.provide(key, s);
    },
};

export { buildMediaQuery, normalizeScreens, plugin as screens, useDarkMode, useMediaQuery, useResizeObserver, useScreens };
//# sourceMappingURL=index.mjs.map
