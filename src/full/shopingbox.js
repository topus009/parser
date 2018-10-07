const _ = require('lodash');

const selector = '.post.catalog';

const model = {
    title: 'childNodes[1].childNodes[1].childNodes[0].childNodes[0].data',
    value: 'childNodes',
};

const prepareData = (item, index, path) => {
    let result = null;
    switch (index) {
        case 'title':
            result = _.map(item, el => _.get(el, path));
            break;
        case 'value':
            result = _.map(item, el => {
                const preResult = _.get(el, path);
                const target = _.filter(preResult, node => {
                    return node.attribs && node.attribs.class === 'cashback'
                });
                return target[0].children[1].children[0].data;
            });
            break;
        default:
            console.log('SHOPINGBOX = НИЧЕГО НЕ НАЙДЕНО')
            break;
    }
    return result;
}

module.exports = {
    selector,
    model,
    prepareData
}
