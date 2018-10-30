
const _ = require('lodash');
const helpers = require('../../helpers');

const selector = '.b-teaser__inner';
const model = {
    title: 'children[3].children[0].data',
    format: 'children[1].children[1].children[1].children',
    value: 'children[1].children[1].children[1].children',
};

const prepareData = (item, index, path, uri) => {
    let result = null;
    const titleFix = el => el.children.length === 7 ? 'children[3].' : 'children[1].';
    const valueFix = el => el.children.length === 7 ? 'children[5].' : 'children[3].';
    if(index === 'format') {
        const pathEl = el => valueFix(el) + path;
        const section1 = _.map(item, el => _.get(el, pathEl(el)));
        result = _.map(section1, sec => {
            const spans = _.filter(sec, {name: 'span'});
            const filteredLabels = _.filter(spans, sp => sp.attribs.class.trim() === 'b-shop-teaser__label');
            const last = _.last(filteredLabels);
            return last.children[0].data;
        });
    } else if(index === 'title') {
        const pathEl = el => titleFix(el) + path;
        const {normalizeTitle} = helpers;
        const data = _.map(item, el => _.get(el, pathEl(el)));
        const regex1 = /(^\\n)|(\\n$)/ig;
        result = _.map(data, t => normalizeTitle(t.replace(regex1, '').trim()));
    } else if(index === 'value') {
        const pathEl = el => valueFix(el) + path;
        const section2 = _.map(item, el => _.get(el, pathEl(el)));
        const values = _.map(section2, sec => {
            const spans = _.filter(sec, {name: 'span'});
            const xxx = _.filter(spans, sp => sp.attribs.class.trim() === 'b-shop-teaser__cash')[0];
            if(xxx === undefined) {
                console.log('+++++++++++++++');
                console.log({xxx});
                console.log({spans});
                console.log({values});
                console.log({section2});
                console.log({pathEl});
                console.log({item});
                console.log({uri});
                console.log({index});
                console.log('***************');
                // console.log('***************');
            }
            const labels = _.filter(spans, sp => sp.attribs.class.trim() === 'b-shop-teaser__cash')[0].children[0].data;
            return labels;
        });
        const prefixes = _.map(section2, sec => {
            const spans = _.filter(sec, {name: 'span'});
            const labels = _.filter(spans, sp => sp.attribs.class.trim() === 'b-shop-teaser__label');
            if(labels.length > 1) {
                return labels[0].children[0].data;
            }
            return false;
        });
        result = _.map(values, (val, ind) => {
            const targetPrefix = prefixes[ind];
            if(targetPrefix) {
                return `${targetPrefix} ${val}`;
            }
            return val;
        });
    } else {
        console.log('LETYSHOPS = НИЧЕГО НЕ НАЙДЕНО');
    }
    return result;
}

module.exports = {
    selector,
    model,
    prepareData
}
