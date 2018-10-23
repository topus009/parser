// full
const promokodi_net = require('./full/promokodi_net');
const simplybestcoupons = require('./full/simplybestcoupons');
const shopingbox = require('./full/shopingbox');
const cashback_ru = require('./full/cashback_ru');
// paging
const letyshops = require('./paging/letyshops');

module.exports = {
    full: {
        promokodi_net,
        simplybestcoupons,
        shopingbox,
        cashback_ru,
    },
    paging: {
        letyshops,
    }
}
