exports.full = [
    {
        fileName: 'kopikot',
        uri: 'https://api.kopikot.ru/campaigns?limit=10000&offset=0',
        json: true,
        extendedRequestOptions: {
            headers: {'x-bonusway-locale': 'ru'}
        }
    },
    {
        fileName: 'promokodi_net',
        uri: 'https://promokodi.net/store/cashback/',
        json: false
    },
    {
        fileName: 'simplybestcoupons',
        uri: 'https://ru.simplybestcoupons.com/Stores/Cashback/',
        json: false
    },
    {
        fileName: 'shopingbox',
        uri: 'http://shopingbox.ru/box/all/',
        json: false
    },
    {
        fileName: 'cashback_ru',
        uri: 'https://cashback.ru/%D0%9A%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3_%D0%90-%D0%AF/all',
        json: false
    },
];

exports.paging = [
    {
        fileName: 'letyshops',
        uri: 'https://letyshops.com/shops',
        json: false
    },
    {
        fileName: 'epn',
        uri: 'https://epn.bz/ru/cashback/shops',
        json: false
    },
    {
        fileName: 'cashmeback',
        uri: 'https://cashmeback.ru/catalog',
        json: false
    },
];

exports.lazy = [
    // {
    //     fileName: 'smarty_sale',
    //     uri: 'https://smarty.sale/shops/sport',
    // },
];
