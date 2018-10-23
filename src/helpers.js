const cheerio = require('cheerio');
const _ = require('lodash');
const rp = require('request-promise');

const baseOptions = uri => ({
  proxy: 'http://nw-proxy.megafon.ru:3128',
  method: 'GET',
  strictSSL: false,
  uri: uri,
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
    return JSON.parse(body)
  },
};

const load = async ({uri, script, prefilter}) => {
  const {selector, model, prepareData} = script;
  const $ = await rp({...baseOptions(uri), ...parseHTMLOptions});
  const preparedResult = {};
  let itemInBody = null;
  if(prefilter) {
    itemInBody = prefilter($(selector));
  } else {
    itemInBody = $(selector);
  }
  _.forEach(model, (path, index) => {
    preparedResult[index] = prepareData(itemInBody, index, path, uri);
  });
  return preparedResult;
};

const pre_load_links = async ({uri, selector, getLastPage, newUrl}) => {
  const $ = await rp({...baseOptions(uri), ...parseHTMLOptions});
  const itemInBody = $(selector);
  const lastPage = getLastPage(itemInBody);
  const pages =  _.times(lastPage, num => num + 1);
  return _.map(pages, page => newUrl(page));
};

const megafon_load = async ({uri}) => {
  const res = await rp(baseOptions(uri));
  return JSON.parse(res);
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
  megafon_load,
  baseOptions,
  parseJSONOptions,
  normalizeTitle,
  pre_load_links,
}
