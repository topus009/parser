const _ = require('lodash');
const helpers = require('./helpers');

const sortIndexedData = splittedData => {
    const shopsTitles = {};
    const {normalizeTitle} = helpers;
    _.forOwn(splittedData, (item, itemIndex) => {
        _.forOwn(item.title, title => {
            if(!shopsTitles[normalizeTitle(title)]) {
                shopsTitles[normalizeTitle(title)] = [];
            }
        });
        _.forOwn(item.title, (title, titleIndex) => {
            shopsTitles[normalizeTitle(title)][itemIndex] = item.value[titleIndex];
        });
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
                                value: helpers.parseNumber(val),
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

const splitData = prevData => {
    const newData = {};
    _.each(prevData, (item, index) => {
        let result = {};
        const {format, value, title} = item;
        const newValue = _.map(title, (t, i) => {
            const f = format && format[i] ? format[i] : '';
            return `${value[i]}${f}`;
        });
        result = {
            title,
            value: newValue
        };
        newData[index] = result;
    });
    return newData;
}

const combineRes = ({fullRes, pagingRes, prepared_megafon}) => {
    const preparedPagingRes = [];
    _.each(pagingRes, item => {
        const itemData = {
            title: [],
            format: [],
            value: []
        };
        _.each(itemData, (path, pathTitle) => {
            _.each(item, page => {
                _.each(page, (pageValues, pageField) => {
                    if(pathTitle === pageField) {
                        const path = itemData[pathTitle];
                        itemData[pathTitle] = _.concat(path, pageValues);
                    }
                });
            });
        });
        preparedPagingRes.push(itemData);
    });
    const megafonData = {
        title: [],
        format: [],
        value: []
    };
    _.forIn(prepared_megafon, (v, k) => {
        megafonData.title.push(k);
        megafonData.format.push(v.format);
        megafonData.value.push(v.value);
    });
    return [megafonData, ...fullRes, ...preparedPagingRes];
}

const prepareExcel = ({prepared_megafon, fullRes, pagingRes}) => {
    const combinedData = combineRes({fullRes, pagingRes, prepared_megafon});
    const splittedData = splitData(combinedData);
    const sortedIndexedData = sortIndexedData(splittedData);
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
