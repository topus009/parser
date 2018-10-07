const _ = require('lodash');
const excel = require('exceljs/dist/es5/exceljs.nodejs');

const workbook = new excel.Workbook();
const date = new Date().toLocaleString();
const title = `Отчет по кэшбекам (${date})`;

const buildReport = data => {
    const sheet = workbook.addWorksheet('Отчет');
}

module.exports = buildReport;
