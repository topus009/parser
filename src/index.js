const _ = require('lodash');
const helpers = require('./helpers');
const files = require('./files');
const prepareExcel = require('./prepareExcel');
const buildReport = require('./workbook');
const pre_megafon = require('./megafon/pre_megafon');
const megafon = require('./megafon/megafon');

const full = [
    {
        fileName: 'kopikot',
        uri: 'https://api.kopikot.ru/campaigns?limit=10000&offset=0',
        json: true,
        extendedRequestOptions: {
            headers: {'x-bonusway-locale': 'ru'}
        }
    },
    {
        fileName: 'promokodi_net',
        uri: 'https://promokodi.net/store/cashback/',
        json: false
    },
    {
        fileName: 'simplybestcoupons',
        uri: 'https://ru.simplybestcoupons.com/Stores/Cashback/',
        json: false
    },
    {
        fileName: 'shopingbox',
        uri: 'http://shopingbox.ru/box/all/',
        json: false
    },
    {
        fileName: 'cashback_ru',
        uri: 'https://cashback.ru/%D0%9A%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3_%D0%90-%D0%AF/all',
        json: false
    },
];

const paging = [
    {
        fileName: 'letyshops',
        uri: 'https://letyshops.com/shops',
        json: false
    },
    {
        fileName: 'epn',
        uri: 'https://epn.bz/ru/cashback/shops',
        json: false
    },
    {
        fileName: 'cashmeback',
        uri: 'https://cashmeback.ru/catalog',
        json: false
    },
];

const lazy = [
    // {
    //     fileName: 'smarty_sale',
    //     uri: 'https://smarty.sale/shops/sport',
    // },
];

const init = async (contents, second_title) => {
    const {
        load,
        JSON_load,
        send,
        findFailedUrlsIndexes,
        LAZY_load,
    } = helpers;
    const full_promises = [];
    const megafon_promises = [];
    const paging_pre_promises = [];
    const paging_promises = {};
    const lazy_promises = [];
    let lazyRes = [];
    let pagingRes = {};
    let fullRes = [];
    // ================= full ==============================
    if(!_.isEmpty(full)) {
        _.forEach(full, item => {
            const {fileName, ...rest} = item;
            const script = files.full[fileName];
            full_promises.push(load({script, ...rest, contents}));
        });
        fullRes = await Promise.all(full_promises);
    }
    // ================= full-end ==========================
    // ================= megafon ===========================
    const megafon_links = await pre_megafon(contents);
    _.forEach(megafon_links, uri => {
        megafon_promises.push(JSON_load({uri, contents}));
    });
    const megafonRes = await Promise.all(megafon_promises);
    const prepared_megafon = megafon(megafonRes);
    // ================= megafon-end =======================
    // ================= paging ============================
    if(!_.isEmpty(paging)) {
        _.forEach(paging, ({fileName, uri}) => {
            const {pre_load} = files.paging[fileName];
            paging_pre_promises.push(pre_load({uri, title: fileName, contents}));
        });
        const paging_links = await Promise.all(paging_pre_promises);
        for(const item of paging) {
            const {fileName, ...rest} = item;
            const {
                prepare: script,
                prefilter
            } = files.paging[fileName];
            for(const links of paging_links) {
                const shopLinks = links[fileName];
                if(shopLinks) {
                    paging_promises[fileName] = [];
                    for(const uri of shopLinks) {
                        paging_promises[fileName].push(load({script, prefilter, ...rest, uri, contents}));
                    }
                }
            }
        }
        for(const site in paging_promises) {
            const siteRes = await Promise.all(paging_promises[site]);
            pagingRes[site] = siteRes;
        }
    }
    // ================= paging-end ========================
    // ================= lazy ==============================
    if(!_.isEmpty(lazy)) {
        contents.send('lazy-load-start');
        _.forEach(lazy, item => {
            const {fileName, ...rest} = item;
            const {nextSelector, selectors} = files.lazy[fileName];
            lazy_promises.push(LAZY_load({nextSelector, selectors, ...rest, contents}));
        });
        lazyRes = await Promise.all(lazy_promises);
        contents.send('lazy-load-end');
    }
    // ================= lazy-end ==========================
    try {
        const {
            fullRes_filtered,
            pagingRes_filtered,
            fullRes_indexes,
        } = findFailedUrlsIndexes({fullRes, pagingRes});
        const filteredFinalPagingRes = _.filter(pagingRes_filtered, site => site.length);
        const preparedExcel = prepareExcel({
            prepared_megafon,
            fullRes: [...fullRes_filtered, ...lazyRes],
            pagingRes: filteredFinalPagingRes,
        });
        const list = [
            {
                fileName: 'megafon'
            },
            ..._.filter(full, (value, key) => !_.includes(fullRes_indexes, key)),
            ...lazy,
            ..._.filter(paging, (site, key) => filteredFinalPagingRes[key]),
        ];
        buildReport(preparedExcel, list, second_title);
        send(contents, `ОТЧЕТ ${second_title} --> ГОТОВ`);
        // buildReport(preparedExcel, list, '(обычный)');
        // send(contents, 'ОТЧЕТ (обычный) --> ГОТОВ');
    } catch (error) {
        send(contents, '11111-index', error);
    }

}

// init();

module.exports = init;
