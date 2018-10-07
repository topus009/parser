const _ = require('lodash');

const selector = '.main-page .pure-u-1-5';

const model = {
    title: 'childNodes[0].childNodes[0].data',
    value: 'childNodes[1].childNodes[0].data',
};

const prepareData = (item, index, path) => {
    let result = null;
    switch (index) {
        case 'title':
        case 'value':
            result = _.map(item, el => _.get(el, path));
            break;
        default:
            console.log('CASHBACK_RU = НИЧЕГО НЕ НАЙДЕНО')
            break;
    }
    return result;
}

module.exports = {
    selector,
    model,
    prepareData
}
