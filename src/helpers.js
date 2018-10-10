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
  const $ = await rp({...baseOptions(uri), ...parseHTMLOptions});
  const preparedResult = {};
  const itemInBody = $(selector);
  _.forEach(model, (path, index) => {
    preparedResult[index] = prepareData(itemInBody, index, path);
  });
  return preparedResult;
};

const megafon_load = async ({uri}) => {
  const res = await rp(baseOptions(uri));
  return JSON.parse(res);
};

//--------------- full
module.exports = {
  load,
  megafon_load
}
