const letyshops = require('./letyshops');
const pre_letyshops = require('./pre_letyshops');
const prefilter = require('./prefilter');

module.exports = {
    prepare: letyshops,
    pre_load: pre_letyshops,
    prefilter,
}
