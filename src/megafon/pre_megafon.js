const _ = require('lodash');
const rp = require('request-promise');

const options = uri => ({
    uri: uri,
    // proxy: 'http://nw-proxy.megafon.ru:3128',
    transform: body => {
        return JSON.parse(body)
    },
    method: 'GET',
    // strictSSL: false,
});

const allMegafonShopsURL = 'https://special.megafon.ru/api/categories';

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
    const allMegafonShops = await rp(options(allMegafonShopsURL));
    countPages(allMegafonShops);
    return _.flatten(generateRequestLinks(allMegafonShops.categories));
};



module.exports = {loadPreRequest}
