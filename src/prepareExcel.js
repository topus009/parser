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

const findMaxValue = data => {
    const comparedValues = {};
    _.each(data, (item, index) => {
        comparedValues[index] = [];
        if (item.value.length > 0) {
            _.each(item.value, (val, ind) => {
                if(val && typeof val === 'string') {
                    if(val.match(/%/g)) {
                        comparedValues[index].push(
                            {
                                position: ind,
                                value: parseFloat(val.replace(/([A-ZА-Я ])/ig, '')),
                                title: item.title
                            }
                        );
                    }
                }
            });
        }
    });
    const maxValues = _.map(comparedValues, item => [_.maxBy(item, 'value')]);
    _.each(maxValues, (v, i) => {
        if(v && v[0] && v[0].value) {
            const sameValues = _.filter(comparedValues[i], sameItem => {
                return sameItem.value === v[0].value && sameItem.position !== v[0].position;
            });
            maxValues[i] = [...maxValues[i], ...sameValues];
        }
    });
    return _.map(maxValues, values => {
        if(values.length) return _.map(values, 'position');
        return values;
    });
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
        _.map(sortedIndexedData, (item, index) => {
            const value = _.map(item, val => {
                if(val) {
                    return val.replace(/([,])/g, '.');
                } return val;
            });
            return {
                title: index,
                value
            };
        }), 'title');
    const maxValueIndexes = findMaxValue(sortedTitleData);

    const preparedExcel = _.map(sortedTitleData, (data, dataInd) => {
        return {
            title: data.title,
            value: _.map(data.value, (val, ind) => {
                if(data.value.length === 1) {
                    return [val, true];
                }
                const targetColorPos = _.find(maxValueIndexes[dataInd], v => v === ind);
                if(targetColorPos >= 0) {
                    return [val, true];
                } return [val, false];
            })
        };
    });
    return preparedExcel;
}

module.exports = prepareExcel;
