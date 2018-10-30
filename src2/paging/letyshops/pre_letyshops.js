const _ = require('lodash');
const helpers = require('../../helpers');

const getLastPage = content => {
    const all_links = _.filter(content[0].children, {type: 'tag'});
    const all_links_length = all_links.length;
    return all_links[all_links_length - 2].children[1].children[0].data;
};

const loadPreRequest = async ({uri, title, contents}) => {
    const {pre_load_links} = helpers;
    const newUrl = page => `${uri}?page=${page}`;
    return {
        [title]: await pre_load_links({
            uri,
            selector: 'ul.b-pagination.js-pagination',
            getLastPage,
            newUrl,
            contents
        })
    };
};

module.exports = loadPreRequest
