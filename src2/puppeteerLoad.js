const _ = require('lodash');
const puppeteer = require('puppeteer');

function extractItems(selectors) {
    const {title, value} = selectors;
    const titleItems = document.querySelectorAll(title);
    const valueItems = document.querySelectorAll(value);
    const items = [];
    for (let key in titleItems) {
      items.push({
              title: titleItems[key].innerText,
              value: valueItems[key].innerText
          });
    }
    return items;
}

async function scrapeInfiniteScrollItems({
    page,
    extractItems,
    itemTargetCount,
    nextSelector,
    selectors
}) {
    let items = [];
    try {
        let previousHeight;
    while (items.length < itemTargetCount) {
        items = await page.evaluate(extractItems, selectors);
        previousHeight = await page.evaluate('document.body.scrollHeight');
        await page.click(`${nextSelector}`);
        await page.waitForSelector(`${nextSelector}`);
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
    }
    await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
    } catch(e) {
        console.warn('========== ERROR ===========');
        console.warn({e});
    }
    return items;
}

const puppeteerLoad = async ({uri, nextSelector, selectors}) => {
    const browser = await puppeteer.launch({
    headless: false,
        args: [
            '--disable-notifications',
        ],
        // devtools: true
    });
    const page = await browser.newPage();
    page.setViewport({width: 1400, height: 900});
    await page.goto(uri);
    const items = await scrapeInfiniteScrollItems({
        page,
        extractItems,
        itemTargetCount: 10000,
        nextSelector,
        selectors,
    });
    await browser.close();
    console.log({xxx: items});
    return _.filter(items, item => !_.isEmpty(item));
}

module.exports = puppeteerLoad;
