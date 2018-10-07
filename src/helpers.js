const cheerio = require('cheerio');
const _ = require('lodash');
const rp = require('request-promise');

//--------------- full
const options = uri => ({
  uri: uri,
  // proxy: 'http://nw-proxy.megafon.ru:3128',
  transform: function(body) {
    return cheerio.load(body, {
      useHtmlParser2: true,
      withStartIndices: false,
      withEndIndices: false,
      withDomLvl1: false,
      decodeEntities: false
    });
  },
  method: 'GET',
  strictSSL: false,
});

const load = async ({uri, fileName, script}) => {
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
