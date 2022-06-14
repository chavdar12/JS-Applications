const expect = require('chai').expect;
const chromium = require('playwright-chromium').chromium;

const host = 'http://127.0.0.1:5500/02.Book-Library/index.html';
const mockedBooks = {
    'd953e5fb-a585-4d6b-92d3-ee90697398a0': {
        author: 'J.K.Rowling',
        title: "Harry Potter and the Philosopher's Stone"
    },
    'd953e5fb-a585-4d6b-92d3-ee90697398a1': { author: 'Svetlin Nakov', title: 'C# Fundamentals' }
};

describe('Book-Library app e2e tests', async function () {
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

    it('should load all books when load button is clicked', async () => {
        await page.route('**/jsonstore/collections/books', (route, request) => {
            route.fulfill({
                status: 200,
                headers: {
                    'access-control-allow-origin': '*',
                    'content-type': 'application/json',
                },
                body: JSON.stringify(mockedBooks),
            });
        });

        await page.waitForSelector('table');

        const [response] = await Promise.all([
            page.waitForResponse(r => r.request().url()
                .includes('/jsonstore/collections/books') && r.request().method() === 'GET'),
            page.click('#loadBooks'),
        ]);

        const actualBooks = await response.json();

        expect(actualBooks).to.deep.equal(mockedBooks);
    });

    it('should add book when submit button is clicked and input data is valid', async () => {
        await page.waitForSelector('#createForm');

        await page.fill('#createForm > [name="title"]', 'My Title')
        await page.fill('#createForm > [name="author"]', 'Pesho')

        const [response] = await Promise.all([
            page.waitForResponse(r => r.request().url()
                .includes('/jsonstore/collections/books') && r.request().method() === 'POST'),
            page.click('text="Submit"'),
        ]);

        const actualData = await response.json();

        expect(actualData.title).to.equal('My Title');
        expect(actualData.author).to.equal('Pesho');
    });

    it('should not add book when submit button is clicked and input data is not valid', async () => {
        await page.waitForSelector('#createForm');

        await page.fill('#createForm > [name="title"]', '')
        await page.fill('#createForm > [name="author"]', 'Gosho')

        await Promise.all([
            page.click('text="Submit"'),
            page.click('#loadBooks'),
        ]);

        const content = await page.textContent('table tbody');

        expect(content).not.to.contain('Gosho');
    });

    it('should edit book when save button is clicked and input data is valid', async () => {
        await page.waitForSelector('table');

        await Promise.all([
            page.click('#loadBooks'),
            page.click('.editBtn')
        ]);

        await page.waitForSelector('#editForm');

        await page.fill('#editForm input[name="title"]', 'Updated Title');

        await page.click('text=Save');
        await page.click('#loadBooks');

        const content = await page.textContent('table tbody');

        expect(content).to.contain('Updated Title');
    });

    it('should not edit book when save button is clicked and input data is not valid', async () => {
        await page.waitForSelector('table');

        await Promise.all([
            page.click('#loadBooks'),
            page.click('.editBtn')
        ]);

        await page.waitForSelector('#editForm');

        await page.fill('#editForm input[name="title"]', '');
        await page.fill('#editForm input[name="author"]', 'Updated Author');

        await page.click('text=Save');
        await page.click('#loadBooks');

        const content = await page.textContent('table tbody');

        expect(content).not.to.contain('Updated Author');
    });

    it('should delete book when deleting is confirmed', async () => {
        await page.waitForSelector('table');

        await Promise.all([
            page.click('#loadBooks'),
            page.click('.deleteBtn'),
            page.on('dialog', dialog => dialog.accept())
        ]);

        await page.click('#loadBooks');
        const content = await page.textContent('table tbody');

        expect(content).not.to.contain('J.K.Rowling');
    });

    it('should not delete book when deleting is not confirmed', async () => {
        await page.waitForSelector('table');

        await Promise.all([
            page.click('#loadBooks'),
            page.click('.deleteBtn'),
            await page.on('dialog', dialog => dialog.dismiss())
        ]);

        await page.click('#loadBooks');
        const content = await page.textContent('table tbody');

        expect(content).to.contain('Nakov');
    });
});