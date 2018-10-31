
const _ = require('lodash');
const helpers = require('../../helpers');

const selector = '.shops__items-list';
const model = {
    title: 'children[7].children[1].attribs.href',
    format: 'children[5].children[1].children[1].children[0].data',
    value: 'children[5].children[1].children[1].children[0].data',
};

const prepareData = (item, index, path, uri) => {
    let result = null;
    switch (index) {
        case 'format':
            result = _.map(item, el => helpers.parseFormat(_.get(el, path)));
            break;
        case 'title':
            result = _.map(item, el => {
                const href = _.get(el, path);
                return href
                    .replace('/ru/cashback/shops/', '')
                    .replace('/', '');
            });
            break;
        case 'value':
            result = _.map(item, el => helpers.parseNumber(_.get(el, path)));
            break;
        default:
            console.log('EPN.BZ = НИЧЕГО НЕ НАЙДЕНО')
            break;
    }
    return result;
}

module.exports = {
    selector,
    model,
    prepareData
}
