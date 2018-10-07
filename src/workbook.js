const _ = require('lodash');
const Excel = require('exceljs');

const workbook = new Excel.Workbook();
const date = new Date().toLocaleString().slice(0, 10);
const title = `Отчет по кэшбэкам (${date})`;

function addHeader(sheet, title) {
    _.each([1, 2, 3, 4, 5, 6], index => {
        sheet.getColumn(index).width = 18;
    });
    mergeCells(sheet, [
        ['A1', 'E1'],
    ]);
    const A1 = sheet.getCell('A1');
    A1.value = title;
    A1.alignment = {horizontal: 'center', vertical: 'center'};
    sheet.getRow(A1._row._number).height = 30;
}

function addTableHeader(sheet, lists) {
    const sites = _.map(lists, 'fileName');
    sheet.addRow(['XXX', 'megafon', ...sites]);
}

function addTable(sheet, data) {
    _.each(data, (shop, shopIndex) => {
        sheet.addRow([shopIndex, 'МЕГАФОН', ...shop]);
    })
}

const buildReport = (data, lists) => {
    const sheet = workbook.addWorksheet('Отчет');
    addHeader(sheet, title);
    addTableHeader(sheet, lists);
    addTable(sheet, data);
    workbook.xlsx.writeFile(`${title}.xlsx`);
}

function mergeCells(sheet, cellsRangeMap) {
    _.each(cellsRangeMap, range => {
        sheet.mergeCells(range[0], range[1]);
    });
}

module.exports = buildReport;
