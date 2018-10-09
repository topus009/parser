const cheerio = require('cheerio');
const _ = require('lodash');
const rp = require('request-promise');

const baseOptions = uri => ({
  proxy: 'http://nw-proxy.megafon.ru:3128',
  method: 'GET',
  strictSSL: false,
  uri: uri,
});

//--------------- full
const parseHTMLOptions = {
  ...baseOptions,
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

const load = async ({uri, script}) => {
  const {selector, model, prepareData} = script;
  const $ = await rp(parseHTMLOptions(uri));
  const preparedResult = {};
  const itemInBody = $(selector);
  _.forEach(model, (path, index) => {
    preparedResult[index] = prepareData(itemInBody, index, path);
  });
  return preparedResult;
};

const megafon_list_load = async ({uri, script}) => {
  const {selector, model, prepareData} = script;
  const $ = await rp(options(uri));
  const preparedResult = {};
  const itemInBody = $(selector);
  _.forEach(model, (path, index) => {
    preparedResult[index] = prepareData(itemInBody, index, path);
  });
  return preparedResult;
};

//--------------- full
module.exports = {
  load
}
