const _ = require('lodash');

const prefilter = data => {
    return _.filter(data[0].children, item => {
        return item.type === 'tag';
    });
}

module.exports = prefilter;
