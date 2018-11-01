const cashmeback = require('./cashmeback');
const pre_cashmeback = require('./pre_cashmeback');

module.exports = {
    prepare: cashmeback,
    pre_load: pre_cashmeback,
}
