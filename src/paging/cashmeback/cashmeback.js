
const _ = require('lodash');
const selector = '.item-b';
const model = {
    title: 'children[1].children[1].children[1].children[1].attribs.alt',
    value: 'children[1].children[3].children[1].children[0].data',
};

const prepareData = (item, index, path) => {
    let result = null;
    if(index === 'title') {
        result = _.map(item, el => _.get(el, path));
    } else if(index === 'value') {
        result =_.map(item, el => {
            const target = _.get(el, path);
            return target.replace(/\n/ig, '').trim();
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
