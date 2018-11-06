// full
const kopikot = require('./full/kopikot');
const promokodi_net = require('./full/promokodi_net');
const simplybestcoupons = require('./full/simplybestcoupons');
const shopingbox = require('./full/shopingbox');
const cashback_ru = require('./full/cashback_ru');
// paging
const letyshops = require('./paging/letyshops');
const epn = require('./paging/epn');
const cashmeback = require('./paging/cashmeback');
// lazy
const smarty_sale = require('./lazy/smarty_sale');

module.exports = {
    full: {
        kopikot,
        promokodi_net,
        simplybestcoupons,
        shopingbox,
        cashback_ru,
    },
    paging: {
        letyshops,
        epn,
        cashmeback,
    },
    lazy: {
        smarty_sale,
    }
}
