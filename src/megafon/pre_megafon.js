const _ = require('lodash');
const helpers = require('../helpers');

const uri = 'https://special.megafon.ru/api/categories';

const newUrl = (categoty, page) =>
    `https://special.megafon.ru/api/partners?category=${categoty}&per_page=100&page=${page}`;

const countPages = allMegafonShops => {
    const maxShopsPerPage = 100;
    _.each(allMegafonShops.categories, (shop, shopIndex) => {
        const pagesCount = Math.ceil(shop.partners_count / maxShopsPerPage);
        if(pagesCount > 1) {
            allMegafonShops.categories[shopIndex].pages = pagesCount;
        } else {
            allMegafonShops.categories[shopIndex].pages = 1;
        }
    });
};

const generateRequestLinks = categories => {
    return _.map(categories, category => {
        const pages =  _.times(category.pages, num => num + 1);
        return _.map(pages, page => newUrl(category.id, page));
    });
};

const loadPreRequest = async () => {
    const {JSON_load} = helpers;
    const allMegafonShops = await JSON_load(uri);
    countPages(allMegafonShops);
    return _.flatten(generateRequestLinks(allMegafonShops.categories));
};

module.exports = {loadPreRequest}
