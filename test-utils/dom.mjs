import { readFile } from 'node:fs/promises';
import { JSDOM, ResourceLoader, VirtualConsole } from 'jsdom';

const ORIGIN = 'http://localhost:3000';

// Serves the program folder as http://localhost:3000/ so absolute script paths and localStorage work.
class LocalLoader extends ResourceLoader {
    constructor(root) {
        super();
        this.root = root;
    }

    fetch(url) {
        const u = new URL(url);
        if (u.origin !== ORIGIN) {
            return Promise.resolve(Buffer.from(''));
        }
        return readFile(new URL('.' + decodeURIComponent(u.pathname), this.root));
    }
}

// Globals that ES modules read as free identifiers (classic scripts get them from window).
const GLOBALS = ['window', 'document', 'location', 'history', 'localStorage', 'sessionStorage', 'navigator',
    'alert', 'confirm', 'fetch', 'FormData', 'Event', 'CustomEvent', 'MouseEvent', 'KeyboardEvent', 'SubmitEvent',
    'HTMLElement', 'HTMLFormElement', 'HTMLAnchorElement', 'Element', 'Node', 'NodeFilter', 'DocumentFragment',
    'Text', 'Comment', 'MutationObserver', 'getComputedStyle', 'requestAnimationFrame', 'scrollTo'];

let importCounter = 0;

/**
 * Loads an HTML page from a program folder into jsdom and runs its classic and module scripts.
 * @param {URL} pageUrl file URL of the page, e.g. `new URL('./index.html', import.meta.url)`
 * Options: fetch stub, local/session storage seed, confirm() answer, setup(window) hook,
 * root folder served as the site root (defaults to the page's folder).
 */
export async function loadPage(pageUrl, {
    fetch = mockFetch({}), storage = {}, session = {}, confirm = true, setup, root = new URL('./', pageUrl)
} = {}) {
    const html = await readFile(pageUrl, 'utf8');
    const alerts = [];
    const errors = [];
    const virtualConsole = new VirtualConsole();
    virtualConsole.sendTo(console, { omitJSDOMErrors: true });
    virtualConsole.on('jsdomError', (err) => {
        // redirects after login etc. are expected; jsdom just can't follow them
        if (!err.message.startsWith('Not implemented: navigation')) {
            errors.push(err);
            console.error(err);
        }
    });
    const dom = new JSDOM(html, {
        virtualConsole,
        url: `${ORIGIN}/${pageUrl.href.slice(root.href.length)}`,
        runScripts: 'dangerously',
        resources: new LocalLoader(root),
        pretendToBeVisual: true,
        beforeParse(window) {
            window.fetch = fetch;
            window.alert = (msg) => alerts.push(msg);
            window.confirm = () => confirm;
            window.scrollTo = () => {};
            Object.entries(storage).forEach(([k, v]) => window.localStorage.setItem(k, v));
            Object.entries(session).forEach(([k, v]) => window.sessionStorage.setItem(k, v));
            setup?.(window);
        }
    });
    const { window } = dom;
    if (window.document.readyState !== 'complete') {
        await new Promise((resolve) => window.addEventListener('load', resolve));
    }

    for (const key of GLOBALS) {
        Object.defineProperty(globalThis, key, { value: window[key], configurable: true, writable: true });
    }

    // jsdom does not execute module scripts, so import them here; ?v= gives each load a fresh entry module.
    for (const script of window.document.querySelectorAll('script[type="module"][src]')) {
        const src = new URL(script.getAttribute('src'), window.location.href);
        const file = new URL('.' + decodeURIComponent(src.pathname), root);
        await import(`${file.href}?v=${importCounter++}`);
    }
    await settle();

    return { dom, window, document: window.document, alerts, errors, fetch };
}

/** Lets pending fetches, promise chains and timers flush. */
export function settle(ms = 20) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

class HttpReply {
    constructor(status, body) {
        this.status = status;
        this.body = body;
    }
}

/** Route result with a non-200 status. */
export const reply = (status, body) => new HttpReply(status, body);

/**
 * Builds a fetch stub. Route keys are `METHOD /path?query` (host is ignored).
 * Values are response data, or functions `(body, request) => data | reply(status, data)`;
 * throwing an Error simulates a network failure. Unknown routes answer 404.
 * Every request is recorded in `fetch.calls`.
 */
export function mockFetch(routes) {
    const fn = async (input, options = {}) => {
        const url = new URL(String(input), ORIGIN);
        const method = (options.method || 'GET').toUpperCase();
        const path = url.pathname + url.search;
        let body = options.body;
        try {
            body = body === undefined ? undefined : JSON.parse(body);
        } catch {
            // non-JSON body is kept as is
        }
        const headers = Object.fromEntries(
            Object.entries(options.headers || {}).map(([k, v]) => [k.toLowerCase(), v]));
        const request = { method, url: url.href, path, body, headers };
        fn.calls.push(request);

        const key = `${method} ${path}`;
        let result = key in routes ? routes[key] : reply(404, { message: 'Resource not found' });
        if (typeof result === 'function') {
            result = await result(body, request);
        }
        if (result instanceof Error) {
            throw result;
        }
        const status = result instanceof HttpReply ? result.status : 200;
        const data = result instanceof HttpReply ? result.body : result;
        if (status === 204) {
            return new Response(null, { status });
        }
        return new Response(JSON.stringify(data ?? null), { status, headers: { 'Content-Type': 'application/json' } });
    };
    fn.calls = [];
    return fn;
}

/** Sets a field value and fires input + change like a user would. */
export function type(element, value) {
    const { Event } = element.ownerDocument.defaultView;
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
}

/** Fills named form fields and submits the form. */
export function submit(form, values = {}) {
    for (const [name, value] of Object.entries(values)) {
        type(form.elements[name], value);
    }
    form.requestSubmit();
}

/** Clicks like a real left mouse button; page.js ignores jsdom's element.click() because it reports which=0. */
export function click(element) {
    const { MouseEvent } = element.ownerDocument.defaultView;
    element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, which: 1 }));
}
