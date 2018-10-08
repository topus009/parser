const _ = require('lodash');

const sortIndexedData = data => {
    const shopsTitles = {};
    _.each(data, (item, itemIndex) => {
        _.each(item.title, (title, titleIndex) => {
            const regex = /([ .])([a-zа-я]{0,3})$/ig;
            const regex2 = /([ .'`’-]{1,2})/g;
            const normalizeTitle = title.toLowerCase().replace(regex, '').replace(regex2, '');
            if(!shopsTitles[normalizeTitle]) {
                shopsTitles[normalizeTitle] = [];
            }
            shopsTitles[normalizeTitle][itemIndex] = item.value[titleIndex];
        });
    });
    return shopsTitles;
}

const prepareExcel = data => {
    const splittedValuesData = {};
    _.each(data, (item, index) => {
        let result = item;
        if(item.format) {
            const {format, value} = item;
            const newFormat = _.map(format, f => {
                if(!f) return '';
                return f;
            });
            const newValue = _.map(value, v => {
                if(!v) return '';
                return v;
            });
            const composedValue = _.map(newFormat, (f, i) => {
                return `${newValue[i]} ${f}`
            });
            result = {
                title: item.title,
                value: composedValue
            };
        }
        splittedValuesData[index] = result;
    });
    return sortIndexedData(splittedValuesData);
}

module.exports = prepareExcel;
