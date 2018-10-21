const _ = require('lodash');
const helpers = require('./helpers');
const files = require('./files');
const prepareExcel = require('./prepareExcel');
const buildReport = require('./workbook');
const pre_megafon = require('./megafon/pre_megafon');
const prepare_megafon = require('./megafon/megafon');

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

const init = async () => {
    const promises = [];
    const megafon_promises = [];
    const {load, megafon_load} = helpers;
    // full
    _.forEach(full, item => {
        const {fileName, uri} = item;
        const script = files.full[fileName];
        promises.push(load({uri, script}));
    });
    // full-end
    // megafon
    const megafon_links = await pre_megafon.loadPreRequest();
    _.forEach(megafon_links, uri => {
        megafon_promises.push(megafon_load({uri}));
    });
    // megafon-end
    const fullRes = await Promise.all(promises);
    const megafonRes = await Promise.all(megafon_promises);
    const prepared_megafon = prepare_megafon(megafonRes);
    const preparedExcel = prepareExcel({fullRes, prepared_megafon});
    const lists = [
        {
            fileName: 'megafon'
        },
        ...full
    ];
    buildReport(preparedExcel, lists);
}

init();
