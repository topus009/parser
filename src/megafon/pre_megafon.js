const rp = require('request-promise');

const options = uri => ({
    uri: uri,
    proxy: 'http://nw-proxy.megafon.ru:3128',
    method: 'GET',
    strictSSL: false,
});

const allShopsURL = 'https://special.megafon.ru/api/categories';

const loadPreRequest = async () => {
    const allShops = await rp(options(allShopsURL));
    countPages(allShops);
    console.log(allShops);
    return allShops;
};

const countPages = allShops => {
    const maxShopsPerPage = 100;
    _.each(allShops.categories, (shop, shopIndex) => {
        const pagesCount = Math.ceil(shop.partners_count / maxShopsPerPage);
        if(pagesCount > 1) {
            allShops.categories[shopIndex].pages = pagesCount;
        } else {
            allShops.categories[shopIndex].pages = 1;
        }
    });
};

module.exports = {loadPreRequest}
