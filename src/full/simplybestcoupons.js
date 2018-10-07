const _ = require('lodash');

const selector = '.StoreList ul li';

const model = {
    title: 'childNodes[0]',
    value: 'childNodes[2].childNodes[1].data',
};

const prepareData = (item, index, path) => {
    let result = null;
    switch (index) {
        case 'title':
            result = _.map(item, el => {
                const tagA = _.get(el, path);
                if(tagA.childNodes.length === 1) {
                    return tagA.childNodes[0].data.trim();
                }
                return tagA.childNodes[1].data.trim();
            });
            break;
        case 'value':
            result = _.map(item, el => _.get(el, path));
            break;
        default:
            console.log('SIMPLYBESTCOUPONS = НИЧЕГО НЕ НАЙДЕНО')
            break;
    }
    return result;
}

module.exports = {
    selector,
    model,
    prepareData
}
