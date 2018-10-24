const _ = require('lodash');
const helpers = require('../helpers');

const prepareData = data => {
    const {normalizeTitle} = helpers;
    const all_partners = [];
    _.each(data, res => {
        all_partners.push(...res.partners);
    });
    const uniq_partners = _.uniqBy(all_partners, 'id');
    const indexed_partners = _.keyBy(uniq_partners, 'id');
    const partners_with_values = {};
    _.each(indexed_partners, (partner, index) => {
        const {cashback_variants} = partner;
        const target_variant = _.last(cashback_variants);
        const {cashback_type, increased_client_amount} = target_variant;
        let format_symbol = '';
        if(cashback_type === 'percent') {
            format_symbol = '%';
        }
        partners_with_values[normalizeTitle(index)] = {
            format: format_symbol,
            value: increased_client_amount
        };
    });
    return partners_with_values;
}

module.exports = prepareData;
