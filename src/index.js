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

const init = async (contents, second_title) => {
    const {load, JSON_load, finish} = helpers;
    const full_promises = [];
    const megafon_promises = [];
    const paging_pre_promises = [];
    const paging_promises = {};
    // ================= full ==============================
    _.forEach(full, item => {
        const {fileName, ...rest} = item;
        const script = files.full[fileName];
        full_promises.push(load({script, ...rest, contents}));
    });
    const fullRes = await Promise.all(full_promises);
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
    const pagingRes = {};
    for(const site in paging_promises) {
        const siteRes = await Promise.all(paging_promises[site]);
        pagingRes[site] = siteRes;
    }
    // ================= paging-end ========================
    try {
        const preparedExcel = prepareExcel({
            prepared_megafon,
            fullRes,
            pagingRes,
        });
        const list = [
            {
                fileName: 'megafon'
            },
            ...full,
            ...paging,
        ];
        buildReport(preparedExcel, list, second_title);
        finish(contents, `ОТЧЕТ ${second_title} --> ГОТОВ`);
        // buildReport(preparedExcel, list, '(обычный)');
        // finish(contents, 'ОТЧЕТ (обычный) --> ГОТОВ');
    } catch (error) {
        finish(contents, '11111-index', error);
    }

}

// init();

module.exports = init;
