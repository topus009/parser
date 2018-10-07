const _ = require('lodash');
const helpers = require('./helpers');
const files = require('./files');
const prepareExcel = require('./prepareExcel');
const buildReport = require('./workbook');

const lists = [
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

const init = () => {
    const promises = [];
    const labels = [];
    const {load} = helpers;
    _.forEach(lists, item => {
        const {fileName, uri} = item;
        const script = files[fileName];
        promises.push(load({uri, fileName, script}));
        labels.push(fileName);
    });
    Promise.all(promises).then(res => {
        const preparedExcel = prepareExcel(res, labels);
        buildReport(preparedExcel, lists);
    });
}

init();
