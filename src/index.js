const _ = require('lodash');
const helpers = require('./helpers');
const files = require('./files');
const prepareExcel = require('./prepareExcel');
const buildReport = require('./workbook');
const pre_megafon = require('./megafon/pre_megafon');
const megafon = require('./megafon/megafon');

const full = [
    {
        fileName: 'promokodi_net',
        uri: 'https://promokodi.net/store/cashback/'
    },
    {
        fileName: 'simplybestcoupons',
        uri: 'https://ru.simplybestcoupons.com/Stores/Cashback/'
    },
    {
        fileName: 'shopingbox',
        uri: 'http://shopingbox.ru/box/all/'
    },
    {
        fileName: 'cashback_ru',
        uri: 'https://cashback.ru/%D0%9A%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3_%D0%90-%D0%AF/all'
    },
];

const paging = [
    {
        fileName: 'letyshops',
        uri: 'https://letyshops.com/shops'
    },
];

const init = async () => {
    const {load, megafon_load} = helpers;
    // ================= full ==============================
    const full_promises = [];
    _.forEach(full, item => {
        const {fileName, uri} = item;
        const script = files.full[fileName];
        full_promises.push(load({uri, script}));
    });
    const fullRes = await Promise.all(full_promises);
    // ================= full-end ==========================
    // ================= megafon ===========================
    const megafon_promises = [];
    const megafon_links = await pre_megafon.loadPreRequest();
    _.forEach(megafon_links, uri => {
        megafon_promises.push(megafon_load({uri}));
    });
    const megafonRes = await Promise.all(megafon_promises);
    const prepared_megafon = megafon(megafonRes);
    // ================= megafon-end =======================
    // ================= paging ============================
    const paging_pre_promises = [];
    const paging_promises = {};
    _.forEach(paging, ({fileName, uri}) => {
        const {pre_load} = files.paging[fileName];
        paging_pre_promises.push(pre_load({uri, title: fileName}));
    });
    const paging_links = await Promise.all(paging_pre_promises);
    for(const item of paging) {
        const {fileName} = item;
        const {
            prepare: script,
            prefilter
        } = files.paging[fileName];
        for(const links of paging_links) {
            const shopLinks = links[fileName];
            if(shopLinks) {
                paging_promises[fileName] = [];
                for(const uri of shopLinks) {
                    paging_promises[fileName].push(load({uri, script, prefilter}));
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
    const preparedExcel = prepareExcel({
        prepared_megafon,
        fullRes,
        pagingRes,
    });
    const lists = [
        {
            fileName: 'megafon'
        },
        ...full,
        ...paging,
    ];
    buildReport(preparedExcel, lists);
}

init();
