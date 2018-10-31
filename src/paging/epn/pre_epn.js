const _ = require('lodash');
const helpers = require('../../helpers');

const getLastPage = content => {
    return _.get(content, '[0]children[1].children[0].data');
};

const loadPreRequest = async ({uri, title, contents}) => {
    const {pre_load_links} = helpers;
    const newUrl = page => `${uri}/page/${page}/`;
    return {
        [title]: await pre_load_links({
            uri,
            selector: '.new-pagination__item_last',
            getLastPage,
            newUrl,
            contents
        })
    };
};

module.exports = loadPreRequest
