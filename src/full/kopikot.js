
const _ = require('lodash');

const selector = 'items';
const model = {
    title: 'title',
    format: 'commission.max.unit',
    value: 'commission.max.amount',
};

const prepareData = (item, selector, index, path, uri) => {
    let result = null;
    const target = item[selector];
    switch (index) {
        case 'format':
        case 'title':
        case 'value':
            result = _.map(target, el => _.get(el, path));
            break;
        default:
            console.log('KOPIKOT = НИЧЕГО НЕ НАЙДЕНО')
            break;
    }
    return result;
}

module.exports = {
    selector,
    model,
    prepareData
}
