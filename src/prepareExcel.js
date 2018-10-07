const _ = require('lodash');

const sortIndexedData = (data, labels) => {
    const newData = {};
    const shopsTitles = {};
    _.each(data, (item, itemIndex) => {
        const indexedField = {};
        _.each(item.title, (title, titleIndex) => {
            const regex = /([.])([a-zA-Z]{0,3})$/ig;
            const normalizeTitle = title.toLowerCase().replace(regex, '');
            if(!shopsTitles[normalizeTitle]) {
                shopsTitles[normalizeTitle] = [];
            }
            indexedField[normalizeTitle] = item.value[titleIndex];
            shopsTitles[normalizeTitle][itemIndex] = item.value[titleIndex];
        });
        newData[labels[itemIndex]] = indexedField;
    });
    return shopsTitles;
}

const prepareExcel = (data, labels) => {
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
        console.warn(splittedValuesData);
    });
    return sortIndexedData(splittedValuesData, labels);
}

module.exports = prepareExcel;
