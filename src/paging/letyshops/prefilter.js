const _ = require('lodash');

const prefilter = data => {
    // console.log({data});
    const prefilteredData = _.map(data, item => {
        const trash = _.get(item, 'children[1].children[3].children[0].data');
        // const trash2 = _.get(item, 'children[1].children[0].children[0].children[0].children[3].attribs.class');
        if(
            trash !== 'Кэшбэк 2x' && trash !== 'Акция'
            // && _.indexOf(trash2, '__new-cash') < 0
        ) {
            return item;
        }
    });
    return _.compact(prefilteredData);
}

module.exports = prefilter;
