
const _ = require('lodash');

const selector = '';
const model = {
    title: '',
    format: '',
    value: '',
};

const prepareData = (item, index, path) => {
    let result = null;
    switch (index) {
        case 'format':
            result = _.map(item, el => _.get(el, path));
            break;
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
