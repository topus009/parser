
const _ = require('lodash');
const helpers = require('../../helpers');

const selector = '.item-b';
const model = {
    title: 'children[7].children[1].attribs.href',
    format: 'children[5].children[1].children[1].children[0].data',
    value: 'children[5].children[1].children[1].children[0].data',
};

const prepareData = (item, index, path, uri) => {
    let result = null;
    if(index === 'format') {
        result = _.map(item, el => helpers.parseFormat(_.get(el, path)));
    } else if(index === 'title') {
        result = _.map(item, el => {
            const href = _.get(el, path);
            return href
                .replace('/ru/cashback/shops/', '')
                .replace('/', '');
        });
    } else if(index === 'value') {
        const labels = _.map(item, el => helpers.parseNumber(_.get(el, path)));
        const prefixes = _.map(item, el => {
            const text = _.get(el, 'children[5].children[1].children[0].data');
            return text.replace('кэшбэк ', '').trim();
        });
        result = _.map(labels, (val, ind) => {
            const targetPrefix = prefixes[ind];
            if(targetPrefix) {
                return `${targetPrefix} ${val}`;
            }
            return val;
        });
    } else {
        console.log('BEBACK = НИЧЕГО НЕ НАЙДЕНО')
    }
    return result;
}

module.exports = {
    selector,
    model,
    prepareData
}
