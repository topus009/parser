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
                '--deterministic-fetch',
                '--disable-gl-drawing-for-tests',
                '--enable-low-res-tiling',
                '--disable-accelerated-jpeg-decoding',
                '--disable-gpu-rasterization',
                // '--disable-gpu',
                '--disable-composited-antialiasing',
                '--disable-default-apps',
                '--disable-extensions',
                '--disable-local-storage',
                '--disable-rtc-smoothness-algorithm',
                '--disable-smooth-scrolling',
                '--disable-background-networking',
            ],
            // devtools: true
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    // const block_ressources = [
    //     'image',
    //     'stylesheet',
    //     'media',
    //     'font',
    //     'texttrack',
    //     'object',
    //     'beacon',
    //     'csp_report',
    //     'imageset'
    // ];
    page.on('request', request => {
        if (request.resourceType === 'document') {
            request.continue();
        } else {
            request.abort();
        }
    });
    page.setViewport({width: 640, height: 480});
    await page.goto(uri);
    const items = await scrapeInfiniteScrollItems({
        page,
        extractItems,
        itemTargetCount: 10000,
        nextSelector,
        selectors,
    });
    await browser.close();
    // console.log({xxx: items});
    const filteredItems = _.filter(items, item => !_.isEmpty(item));
    const preparedItems = {
        title: [],
        value: [],
    };
    _.each(filteredItems, el => {
        preparedItems.title.push(el.title);
        preparedItems.value.push(el.value);
    });
    return preparedItems;
}

module.exports = puppeteerLoad;
