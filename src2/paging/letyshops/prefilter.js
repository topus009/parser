const _ = require('lodash');

const prefilter = data => {
    const prefilteredData = _.map(data, item => {
        const trash = _.get(item, 'children[1].children[3].children[0].data');
        if(trash === 'Кэшбэк 2x' || trash === 'Акция') {
            return item;
        }
    });
    return _.compact(prefilteredData);
}

module.exports = prefilter;
