
const _ = require('lodash');

const selector = 'items';
const model = {
    title: 'campaign.title',
    format: 'campaign.commission.max.unit',
    value: 'campaign.commission.max.amount',
};

const prepareData = (item, selector, index, path) => {
    let result = null;
    switch (index) {
        case 'format':
        case 'title':
        case 'value':
            result = _.map(item, el => _.get(el, path));
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
