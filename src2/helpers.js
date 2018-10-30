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
  const regex2 = /([ .'`’-]{1,2})/g;
  return title.toLowerCase()
    .replace(regex1, '')
    .replace(regex2, '');
};

module.exports = {
  load,
  JSON_load,
  HTML_load,
  baseOptions,
  parseJSONOptions,
  normalizeTitle,
  pre_load_links,
  finish
}