const cheerio = require('cheerio');
const _ = require('lodash');
const rp = require('request-promise');

const baseOptions = uri => ({
  uri: uri,
  // proxy: 'http://nw-proxy.megafon.ru:3128',
  method: 'GET',
  // strictSSL: false,
});

const parseHTMLOptions = {
  transform: body => {
    return cheerio.load(body, {
      useHtmlParser2: true,
      withStartIndices: false,
      withEndIndices: false,
      withDomLvl1: false,
      decodeEntities: false
    });
  },
};

const parseJSONOptions = {
  transform: body => {
    return JSON.parse(body);
  },
};

const load = async ({uri, script, prefilter, json, extendedRequestOptions: opt, contents}) => {
  const {selector, model, prepareData, afterFilter} = script;
  const preparedResult = {};
  let $ = null;
  try {
    if(json) {
      $ = await JSON_load({uri, opt, contents});
      _.each(model, (path, index) => {
        preparedResult[index] = prepareData($, selector, index, path, uri);
      });
      return preparedResult;
    } else {
      $ = await HTML_load({uri, opt, contents});
      let itemInBody = null;
      if(prefilter) {
        itemInBody = prefilter($(selector));
      } else {
        itemInBody = $(selector);
      }
      _.each(model, (path, index) => {
        preparedResult[index] = prepareData(itemInBody, index, path, uri);
      });
      if(afterFilter) {
        return afterFilter(preparedResult);
      } else {
        return preparedResult;
      }
    }
  } catch (error) {
    finish(contents, '22222-helpers', error);
  }
};

const pre_load_links = async ({uri, selector, getLastPage, newUrl, contents}) => {
  const $ = await HTML_load({uri, contents});
  const itemInBody = $(selector);
  const lastPage = getLastPage(itemInBody);
  const pages =  _.times(lastPage, num => num + 1);
  return _.map(pages, page => newUrl(page));
};

const finish = (contents, target) => {
  contents.send('FINISH_DATA', target);
  // console.log('FINISH_DATA', target)
};

const JSON_load = async ({uri, opt, contents}) => {
  const res = await rp({...baseOptions(uri), ...parseJSONOptions, ...opt});
  finish(contents, uri);
  return res;
};

const HTML_load = async ({uri, opt, contents}) => {
  const res = await rp({...baseOptions(uri), ...parseHTMLOptions, ...opt});
  finish(contents, uri);
  return res;
};

const normalizeTitle = title => {
  const regex1 = /-ru|-com$|([ .])([a-zа-я]{0,3})$/ig;
  const regex2 = /([ .'_`’-]{1,2})/g;
  return title.toLowerCase()
    .replace(regex1, '')
    .replace(regex2, '');
};

const parseNumber = val => parseFloat(val.replace(/([A-ZА-Я ])/ig, ''));

const parseFormat = val => val.replace(/(\d{1,}[., ]{0,}\d{0,}[ ]{0,})/ig, '').trim();

const findFailedUrlsIndexes = ({
  fullRes,
  pagingRes,
}) => {
  const pagingRes_indexes = {};
  const pagingRes_filtered = {};
  try {
    const fullRes_indexes = _.compact(_.map(fullRes, (value, key) => !value && key));
    const fullRes_filtered = _.filter(fullRes, (value, key) => !_.includes(fullRes_indexes, key));
    _.each(pagingRes, (value, shop) => {
      pagingRes_indexes[shop] = [];
      _.each(value, (urlValue, key) => {
        if(!urlValue) {
          pagingRes_indexes[shop].push(key);
        }
      });
    });
    _.each(pagingRes, (value, shop) => {
      pagingRes_filtered[shop] = [];
      _.each(value, urlValue => {
        if(urlValue) {
          pagingRes_filtered[shop].push(urlValue);
        }
      });
    });
    return {
      fullRes_filtered,
      pagingRes_filtered,
      fullRes_indexes,
      pagingRes_indexes,
    };
  } catch (error) {
    console.log('________________');
    console.log({error});
  }
}

module.exports = {
  load,
  JSON_load,
  HTML_load,
  baseOptions,
  parseJSONOptions,
  normalizeTitle,
  pre_load_links,
  finish,
  parseNumber,
  parseFormat,
  findFailedUrlsIndexes,
}
