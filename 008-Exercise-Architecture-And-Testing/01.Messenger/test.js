const assert = require('chai').assert;
const chromium = require('playwright-chromium').chromium;

const host = 'http://127.0.0.1:5500/01.Messenger/index.html';
const mockedMesseges = {
    "-LxHVtajG3N1sU714pVj": {
        "author": "Spami",
        "content": "Hello, are you there?"
    },
    "-LxIDxC-GotWtf4eHwV8": {
        "author": "Garry",
        "content": "Yep, whats up :?"
    },
    "-LxIDxPfhsNipDrOQ5g_": {
        "author": "Spami",
        "content": "How are you? Long time no see? :)"
    },
    "-LxIE-dM_msaz1O9MouM": {
        "author": "George",
        "content": "Hello, guys! :))"
    },
    "-LxLgX_nOIiuvbwmxt8w": {
        "author": "Spami",
        "content": "Hello, George nice to see you! :)))"
    },
};
const mockedSendMessage = { author: 'Pesho', content: 'Hi, I Pesho!' };

describe('Messenger app e2e tests', async function () {
    this.timeout(6000);
    let browser, page;

    before(async () => {
        browser = await chromium.launch();
        //browser = await chromium.launch({ headless: false, slowMo: 100 });
    });

    after(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        page = await browser.newPage();
        await page.goto(host);
    });

    afterEach(async () => {
        await page.close();
    });

    it('should load all messeges when refresh button is clicked', async () => {
        await page.route('**/jsonstore/messenger', (route, request) => {
            route.fulfill({
                status: 200,
                headers: {
                    'access-control-allow-origin': '*',
                    'content-type': 'application/json',
                },
                body: JSON.stringify(mockedMesseges),
            });
        });

        await page.waitForSelector('#messages');

        const [response] = await Promise.all([
            page.waitForResponse(r => r.request().url()
                .includes('/jsonstore/messenger') && r.request().method() === 'GET'),
            page.click('#refresh')
        ]);

        const actualMessages = await response.json();

        assert.deepEqual(actualMessages, mockedMesseges);
    });

    it('should send message when click button is clicked', async () => {
        await page.route('**/jsonstore/messenger', (route, request) => {
            route.fulfill({
                method: 'POST',
                status: 200,
                headers: {
                    'access-control-allow-origin': '*',
                    'content-type': 'application/json',
                },
                body: JSON.stringify(mockedSendMessage),
            });
        });

        await page.waitForSelector('#controls');

        const [response] = await Promise.all([
            page.waitForResponse(r => r.request().url()
                .includes('/jsonstore/messenger') && r.request().method() === 'POST'),
            page.click('#submit'),
        ]);

        const actualData = await response.json();

        assert.deepEqual(actualData, mockedSendMessage);
    });
});
