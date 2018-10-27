
const _ = require('lodash');

const selector = '.cashback-stores-list-item';
const model = {
    title: 'childNodes[1].childNodes[1].children[0].data',
    format: 'childNodes[3].childNodes[1].childNodes[2].data',
    value: 'childNodes[3].childNodes[1].childNodes[1].childNodes[0].data',
};

const prepareData = (item, index, path) => {
    let result = null;
    switch (index) {
        case 'format':
            result = _.map(item, el => {
                const format = _.get(el, path);
                if(format) return format.trim();
                return null;
            });
            break;
        case 'title':
        case 'value':
            result = _.map(item, el => _.get(el, path));
            break;
        default:
            console.log('PROMOKODI-NET = НИЧЕГО НЕ НАЙДЕНО')
            break;
    }
    return result;
}

const afterFilter = prevData => {
    const newData = {};
    _.each(['title', 'value', 'format'], name => {
        newData[name] = [];
        _.each(prevData[name], (v, i) => {
            newData[name][i] = v;
            if(!v) {
                newData[name][i] = '';
            }
        });
    });
    return newData;
}

module.exports = {
    selector,
    model,
    prepareData,
    afterFilter,
}
