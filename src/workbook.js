const _ = require('lodash');
const Excel = require('exceljs');

const workbook = new Excel.Workbook();
const date = new Date().toLocaleString().slice(0, 10);
const title = `Отчет по кэшбэкам (${date})`;

const range = r => _.range(1, r, 1);

function addHeader(sheet, title, colsCount) {
    _.each(range(colsCount + 2), index => {
        if(index === 1) sheet.getColumn(index).width = 30;
        else sheet.getColumn(index).width = 18;
    });
    mergeCells(sheet, [
        ['A1', 'F1'],
    ]);
    const A1 = sheet.getCell('A1');
    A1.value = title;
    A1.alignment = {horizontal: 'center', vertical: 'middle'};
    sheet.getRow(1).height = 30;
    sheet.getRow(1).eachCell(cell => {
        cell.font = {
            ...cell.font,
            bold: true,
            size: 16
        };
    });
    sheet.addRow(['']);
}

function addTableHeader(sheet, lists) {
    const sites = _.map(lists, 'fileName');
    sheet.addRow(['', ...sites]);
    const currentRow = sheet.getRow(sheet.rowCount);
    currentRow.alignment = {horizontal: 'center', vertical: 'middle'};
    currentRow.height = 30;
    currentRow.eachCell(cell => {
        cell.font = {
            ...cell.font,
            bold: true
        };
        setCellBorder(sheet, cell, 'thick', ['top', 'left', 'right', 'bottom']);
    });
}

function addTable(sheet, data, lists) {
    const listsLength = lists.length;
    const firstRow = sheet.lastRow.number + 1;
    firstRow.height = 50;
    let dataWithEmptyCells = _.cloneDeep(data);
    _.each(data, (item, index) => {
        const currentLength = item.value.length;
        const count = listsLength - currentLength;
        if(count) {
            const fillArray = _.times(count, _.constant([undefined, false]));
            dataWithEmptyCells[index] = {
                title: item.title,
                value: [...item.value, ...fillArray]
            };
        }
    });
    _.each(dataWithEmptyCells, shop => {
        const {title, value} = shop;
        const cellValues = _.map(value, val => {
            if(!val[0]) {
                return {'richText': [
                    {'font': {'color': {'argb': 'ff0000'}},'text': ''},
                ]};
            }
            else if(val[1] === false) {
                return {'richText': [
                    {'font': {'color': {'argb': 'ff0000'}},'text': val[0]},
                ]};
            }
            else if(val[1] === true) return {'richText': [
                {'font': {'color': {'argb': '008009'}},'text': val[0]},
            ]};
        });
        sheet.addRow([title, ...cellValues]);
    });
    const lastRow = sheet.lastRow.number;
    sheet.eachRow({includeEmpty: true}, (row, rowNumber) => {
        if(rowNumber >= firstRow && rowNumber <= lastRow) {
            row.eachCell((cell, colNumber) => {
                if(colNumber === 1) {
                    setCellBorder(sheet, cell, 'thick', ['left', 'right']);
                    if(rowNumber === lastRow) {
                        setCellBorder(sheet, cell, 'thick', ['left', 'right', 'bottom']);
                    }
                } else if(colNumber === listsLength + 1) {
                    setCellBorder(sheet, cell, 'thick', ['right']);
                } else {
                    setCellBorder(sheet, cell, 'thin', ['left', 'right']);
                    if(rowNumber === lastRow) {
                        cell.border = {
                            bottom: {style:'thick'},
                            right: {style:'thin'}
                        };
                    }
                }
                if(rowNumber === lastRow && colNumber === listsLength + 1) {
                    setCellBorder(sheet, cell, 'thick', ['bottom', 'right']);
                }
            });
        }
    });
}

const buildReport = (data, lists) => {
    const sheet = workbook.addWorksheet('Отчет');
    const colsCount = lists.length;
    addHeader(sheet, title, colsCount);
    addTableHeader(sheet, lists);
    addTable(sheet, data, lists);
    workbook.xlsx.writeFile(`../${title}.xlsx`);
    console.log('DONE');
}
//================== heplers =================
function mergeCells(sheet, cellsRangeMap) {
    _.each(cellsRangeMap, range => {
        sheet.mergeCells(range[0], range[1]);
    });
}

function setCellBorder(sheet, cells, style, sides) {
    const obj = {};
    _.each(sides, side => {
        obj[side] = {style};
    });
    eachCell(sheet, cells, cell => {
        cell.border = obj;
    });
}

function eachCell(sheet, cells, impl) {
    if(_.isObject(cells)) {
        impl(cells);
    }
    if(_.isString(cells)) {
        impl(sheet.getCell(cells));
    }
    if(_.isArray(cells)) {
        _.each(cells, cell => {
            if(_.isObject(cell)) {
                impl(cell);
            }
            if(_.isString(cell)) {
                impl(sheet.getCell(cell));
            }
        });
    }
}

module.exports = buildReport;
