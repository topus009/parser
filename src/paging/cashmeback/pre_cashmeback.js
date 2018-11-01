const _ = require('lodash');
const helpers = require('../../helpers');

const getLastPage = content => {
    const contentList = _.get(content, '[0].children');
    const preFilteredLinks = _.filter(contentList, el => el.type === 'tag');
    return _.last(preFilteredLinks).children[0].children[0].data;
};

const loadPreRequest = async ({uri, title, contents}) => {
    const {pre_load_links} = helpers;
    const newUrl = page => `${uri}?page=${page}`;
    return {
        [title]: await pre_load_links({
            uri,
            selector: '.pagination',
            getLastPage,
            newUrl,
            contents
        })
    };
};

module.exports = loadPreRequest
