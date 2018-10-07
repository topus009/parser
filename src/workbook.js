const _ = require('lodash');
// const excel = require('exceljs/dist/es5/exceljs.nodejs');
const Excel = require('exceljs');

// const workbook = new excel.Workbook();
const workbook = new Excel.Workbook();
const date = new Date().toLocaleString().slice(0, 10);
const title = `Отчет по кэшбэкам (${date})`;

function addHeader(sheet, title) {
    mergeCells(sheet, [
        ['A1', 'E1'],
    ]);
    const A1 = sheet.getCell('A1');
    A1.value = title;
}

const buildReport = data => {
    const sheet = workbook.addWorksheet('Отчет');
    addHeader(sheet, title);
    workbook.xlsx.writeFile(`${title}.xlsx`);
}

function mergeCells(sheet, cellsRangeMap) {
    _.each(cellsRangeMap, range => {
        sheet.mergeCells(range[0], range[1]);
    });
}

module.exports = buildReport;
