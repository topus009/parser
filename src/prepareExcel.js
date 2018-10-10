const _ = require('lodash');

const sortIndexedData = ({splittedValuesData, prepared_megafon}) => {
    const shopsTitles = {};
    _.each(splittedValuesData, (item, itemIndex) => {
        _.each(item.title, (title, titleIndex) => {
            const regex = /([ .])([a-zа-я]{0,3})$/ig;
            const regex2 = /([ .'`’-]{1,2})/g;
            const normalizeTitle = title.toLowerCase()
                .replace(regex, '')
                .replace(regex2, '');
            if(!shopsTitles[normalizeTitle]) {
                shopsTitles[normalizeTitle] = [];
            }
            shopsTitles[normalizeTitle][itemIndex] = item.value[titleIndex];
        });
    });
    _.each(prepared_megafon, (item, title) => {
        const {format, value} = item;
        const formatted_value = `${value}${format}`;
        if(!shopsTitles[title]) {
            shopsTitles[title] = [formatted_value];
        } else shopsTitles[title].unshift(formatted_value);
    });
    return shopsTitles;
}

const prepareExcel = ({fullRes, prepared_megafon}) => {
    const splittedValuesData = {};
    _.each(fullRes, (item, index) => {
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
    const sortedIndexedData = sortIndexedData({splittedValuesData, prepared_megafon});
    const sortedTitleData = _.sortBy(
        _.map(sortedIndexedData, (item, index) => ({
            title: index,
            value: item
        })), 'title');
    return sortedTitleData;
}

module.exports = prepareExcel;
